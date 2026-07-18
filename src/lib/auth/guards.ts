import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from './server';
import { prisma } from '../../db/prisma';
import { UnauthorizedError } from '../errors';

export async function getSession() {
  const reqHeaders = await headers();
  return await auth.api.getSession({
    headers: reqHeaders,
  });
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new UnauthorizedError('Authentication required');
  }
  return session;
}

export async function requireOnboarded() {
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
