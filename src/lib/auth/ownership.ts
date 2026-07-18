import { prisma } from '../../db/prisma';
import { UnauthorizedError, NotFoundError } from '../errors';

export async function verifyBusinessOwnership(userId: string, businessId: string) {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
  });

  if (!business) {
    throw new NotFoundError('Business not found');
  }

  if (business.userId !== userId) {
    throw new UnauthorizedError('Unauthorized access to this business profile');
  }

  return business;
}

export async function verifySnapshotOwnership(userId: string, snapshotId: string) {
  const snapshot = await prisma.financialSnapshot.findUnique({
    where: { id: snapshotId },
    include: { business: true },
  });

  if (!snapshot) {
    throw new NotFoundError('Financial snapshot not found');
  }

  if (snapshot.business.userId !== userId) {
    throw new UnauthorizedError('Unauthorized access to this financial snapshot');
  }

  return snapshot;
}

export async function verifySimulationOwnership(userId: string, simulationId: string) {
  const simulation = await prisma.simulation.findUnique({
    where: { id: simulationId },
    include: { business: true },
  });

  if (!simulation) {
    throw new NotFoundError('Simulation not found');
  }

  if (simulation.business.userId !== userId) {
    throw new UnauthorizedError('Unauthorized access to this simulation record');
  }

  return simulation;
}

export async function verifyReportOwnership(userId: string, reportId: string) {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: { business: true },
  });

  if (!report) {
    throw new NotFoundError('Report not found');
  }

  if (report.business.userId !== userId) {
    throw new UnauthorizedError('Unauthorized access to this report');
  }

  return report;
}
