import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from './server';
import { prisma } from '../../db/prisma';
import { UnauthorizedError } from '../errors';
import {
  DEV_BYPASS_ENABLED,
  DEV_MOCK_SESSION,
  DEV_MOCK_BUSINESS,
} from './dev-bypass';

export async function getSession() {
  if (DEV_BYPASS_ENABLED) {
    return DEV_MOCK_SESSION;
  }

  const reqHeaders = await headers();
  return await auth.api.getSession({
    headers: reqHeaders,
  });
}

export async function requireAuth() {
  if (DEV_BYPASS_ENABLED) {
    return DEV_MOCK_SESSION;
  }

  const session = await getSession();
  if (!session) {
    throw new UnauthorizedError('Authentication required');
  }
  return session;
}

export async function requireOnboarded() {
  if (DEV_BYPASS_ENABLED) {
    return {
      session: DEV_MOCK_SESSION,
      business: DEV_MOCK_BUSINESS,
    };
  }

  const session = await requireAuth();
  
  const business = await prisma.business.findUnique({
    where: { userId: session.user.id },
  });

  if (!business) {
    redirect('/onboarding');
  }

  return {
    session,
    business,
  };
}
