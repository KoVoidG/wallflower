-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preference" (
    "id" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'system',
    "locale" TEXT NOT NULL DEFAULT 'th',
    "userId" TEXT NOT NULL,

    CONSTRAINT "user_preference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "goals" TEXT[],
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_snapshot" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "revenue" DECIMAL(12,2) NOT NULL,
    "expenseCategories" JSONB NOT NULL,
    "cashReserve" DECIMAL(12,2) NOT NULL,
    "receivables" DECIMAL(12,2) NOT NULL,
    "payables" DECIMAL(12,2) NOT NULL,
    "debt" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metric_snapshot" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "cashRunway" DECIMAL(12,2),
    "grossProfit" DECIMAL(12,2) NOT NULL,
    "netProfit" DECIMAL(12,2) NOT NULL,
    "profitMargin" DECIMAL(5,2) NOT NULL,
    "burnRate" DECIMAL(12,2) NOT NULL,
    "workingCapital" DECIMAL(12,2) NOT NULL,
    "currentRatio" DECIMAL(8,2),
    "breakEven" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metric_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "risk_assessment" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "risk_assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detected_risk" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "probability" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "evidence" TEXT NOT NULL,
    "mitigation" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "detected_risk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulation" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "baselineSnapshotId" TEXT NOT NULL,
    "scenarioType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "calculationVersion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "simulation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulation_input" (
    "id" TEXT NOT NULL,
    "simulationId" TEXT NOT NULL,
    "assumptions" JSONB NOT NULL,

    CONSTRAINT "simulation_input_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulation_result" (
    "id" TEXT NOT NULL,
    "simulationId" TEXT NOT NULL,
    "caseType" TEXT NOT NULL,
    "revenue" DECIMAL(12,2) NOT NULL,
    "expenses" DECIMAL(12,2) NOT NULL,
    "profit" DECIMAL(12,2) NOT NULL,
    "cashRunway" DECIMAL(12,2),
    "workingCapital" DECIMAL(12,2) NOT NULL,
    "roi" DECIMAL(5,2),
    "paybackPeriod" DECIMAL(8,2),

    CONSTRAINT "simulation_result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_recommendation" (
    "id" TEXT NOT NULL,
    "simulationId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "confidenceLabel" TEXT NOT NULL,
    "evidence" JSONB NOT NULL,
    "risks" TEXT[],
    "actions" JSONB NOT NULL,
    "assumptions" TEXT[],
    "uncertainty" TEXT NOT NULL,
    "disclaimer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dataThroughDate" TIMESTAMP(3) NOT NULL,
    "calculationVersion" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "healthAnalysis" JSONB NOT NULL,
    "risks" JSONB NOT NULL,
    "simulationDetails" JSONB NOT NULL,
    "recommendations" JSONB NOT NULL,
    "actionPlan" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "user_preference_userId_key" ON "user_preference"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "business_userId_key" ON "business"("userId");

-- CreateIndex
CREATE INDEX "financial_snapshot_businessId_idx" ON "financial_snapshot"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "financial_snapshot_businessId_month_key" ON "financial_snapshot"("businessId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "metric_snapshot_snapshotId_key" ON "metric_snapshot"("snapshotId");

-- CreateIndex
CREATE INDEX "risk_assessment_businessId_idx" ON "risk_assessment"("businessId");

-- CreateIndex
CREATE INDEX "risk_assessment_snapshotId_idx" ON "risk_assessment"("snapshotId");

-- CreateIndex
CREATE INDEX "detected_risk_assessmentId_idx" ON "detected_risk"("assessmentId");

-- CreateIndex
CREATE INDEX "simulation_businessId_idx" ON "simulation"("businessId");

-- CreateIndex
CREATE INDEX "simulation_baselineSnapshotId_idx" ON "simulation"("baselineSnapshotId");

-- CreateIndex
CREATE UNIQUE INDEX "simulation_input_simulationId_key" ON "simulation_input"("simulationId");

-- CreateIndex
CREATE INDEX "simulation_result_simulationId_idx" ON "simulation_result"("simulationId");

-- CreateIndex
CREATE UNIQUE INDEX "ai_recommendation_simulationId_key" ON "ai_recommendation"("simulationId");

-- CreateIndex
CREATE INDEX "report_businessId_idx" ON "report"("businessId");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preference" ADD CONSTRAINT "user_preference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business" ADD CONSTRAINT "business_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_snapshot" ADD CONSTRAINT "financial_snapshot_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metric_snapshot" ADD CONSTRAINT "metric_snapshot_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "financial_snapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_assessment" ADD CONSTRAINT "risk_assessment_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_assessment" ADD CONSTRAINT "risk_assessment_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "financial_snapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detected_risk" ADD CONSTRAINT "detected_risk_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "risk_assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulation" ADD CONSTRAINT "simulation_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulation" ADD CONSTRAINT "simulation_baselineSnapshotId_fkey" FOREIGN KEY ("baselineSnapshotId") REFERENCES "financial_snapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulation_input" ADD CONSTRAINT "simulation_input_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "simulation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulation_result" ADD CONSTRAINT "simulation_result_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "simulation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_recommendation" ADD CONSTRAINT "ai_recommendation_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "simulation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
