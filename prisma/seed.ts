import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning existing records...');
  // Delete in reverse order of dependencies
  await prisma.metricSnapshot.deleteMany({});
  await prisma.financialSnapshot.deleteMany({});
  await prisma.userPreference.deleteMany({});
  await prisma.business.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding minimal mock Thai SME...');

  const user = await prisma.user.create({
    data: {
      id: 'user-1',
      name: 'Somchai Dev',
      email: 'somchai@example.com',
      emailVerified: true,
    },
  });

  await prisma.userPreference.create({
    data: {
      userId: user.id,
      theme: 'system',
      locale: 'th',
    },
  });

  const business = await prisma.business.create({
    data: {
      id: 'biz-1',
      name: 'Somchai Cafe & Bakery',
      industry: 'food_and_beverage',
      type: 'retail',
      stage: 'growth',
      size: 'small',
      location: 'Bangkok',
      goals: ['increase_revenue', 'optimize_runway'],
      userId: user.id,
    },
  });

  const snapshot = await prisma.financialSnapshot.create({
    data: {
      id: 'snap-1',
      businessId: business.id,
      month: new Date('2026-06-01T00:00:00Z'),
      revenue: 150000.00,
      expenseCategories: {
        salary: '60000.00',
        rent: '20000.00',
        marketing: '15000.00',
        operations: '25000.00',
      },
      cashReserve: 400000.00,
      receivables: 30000.00,
      payables: 20000.00,
      debt: 100000.00,
    },
  });

  await prisma.metricSnapshot.create({
    data: {
      id: 'metric-1',
      snapshotId: snapshot.id,
      cashRunway: 13.33,
      grossProfit: 150000.00,
      netProfit: 30000.00,
      profitMargin: 20.00,
      burnRate: 30000.00,
      workingCapital: 410000.00,
      currentRatio: 21.50,
      breakEven: 120000.00,
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
