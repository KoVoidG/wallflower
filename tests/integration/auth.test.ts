import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Business } from '@prisma/client';
import { requireAuth, requireOnboarded } from '../../src/lib/auth/guards';
import { verifyBusinessOwnership } from '../../src/lib/auth/ownership';
import { UnauthorizedError, NotFoundError } from '../../src/lib/errors';
import { prisma } from '../../src/db/prisma';

vi.mock('next/headers', () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

const mockRedirect = vi.fn();
vi.mock('next/navigation', () => ({
  redirect: (url: string) => mockRedirect(url),
}));

const mockGetSession = vi.fn();
vi.mock('../../src/lib/auth/server', () => ({
  auth: {
    api: {
      getSession: () => mockGetSession(),
    },
  },
}));

vi.mock('../../src/db/prisma', () => ({
  prisma: {
    business: {
      findUnique: vi.fn(),
    },
  },
}));

describe('Auth Guards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requireAuth should throw UnauthorizedError if no session exists', async () => {
    mockGetSession.mockResolvedValueOnce(null);
    await expect(requireAuth()).rejects.toThrow(UnauthorizedError);
  });

  it('requireAuth should return session if authenticated', async () => {
    const mockSession = { user: { id: 'user-1', email: 'test@example.com' } };
    mockGetSession.mockResolvedValueOnce(mockSession);

    const result = await requireAuth();
    expect(result).toEqual(mockSession);
  });

  it('requireOnboarded should redirect to /onboarding if no business profile is defined', async () => {
    const mockSession = { user: { id: 'user-1' } };
    mockGetSession.mockResolvedValueOnce(mockSession);
    vi.mocked(prisma.business.findUnique).mockResolvedValueOnce(null);

    try {
      await requireOnboarded();
    } catch {
      // ignore navigation redirects throw
    }
    expect(mockRedirect).toHaveBeenCalledWith('/onboarding');
  });

  it('requireOnboarded should return session and business if onboarded', async () => {
    const mockSession = { user: { id: 'user-1' } };
    const mockBusiness = { id: 'biz-1', userId: 'user-1', name: 'My SME' };
    mockGetSession.mockResolvedValueOnce(mockSession);
    vi.mocked(prisma.business.findUnique).mockResolvedValueOnce(mockBusiness as unknown as Business);

    const result = await requireOnboarded();
    expect(result).toEqual({ session: mockSession, business: mockBusiness });
  });
});

describe('Ownership Authorization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('verifyBusinessOwnership should throw NotFoundError if business does not exist', async () => {
    vi.mocked(prisma.business.findUnique).mockResolvedValueOnce(null);
    await expect(verifyBusinessOwnership('user-1', 'biz-1')).rejects.toThrow(NotFoundError);
  });

  it('verifyBusinessOwnership should throw UnauthorizedError if user is not the owner', async () => {
    const mockBusiness = { id: 'biz-1', userId: 'user-2', name: 'Other SME' };
    vi.mocked(prisma.business.findUnique).mockResolvedValueOnce(mockBusiness as unknown as Business);

    await expect(verifyBusinessOwnership('user-1', 'biz-1')).rejects.toThrow(UnauthorizedError);
  });

  it('verifyBusinessOwnership should pass if user owns the business', async () => {
    const mockBusiness = { id: 'biz-1', userId: 'user-1', name: 'My SME' };
    vi.mocked(prisma.business.findUnique).mockResolvedValueOnce(mockBusiness as unknown as Business);

    const result = await verifyBusinessOwnership('user-1', 'biz-1');
    expect(result).toEqual(mockBusiness);
  });
});
