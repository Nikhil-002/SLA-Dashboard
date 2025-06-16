-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SLAType" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "hours" INTEGER NOT NULL,

    CONSTRAINT "SLAType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SLAEntry" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "slaTypeId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "slaValue" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SLAEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SLAEntry" ADD CONSTRAINT "SLAEntry_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SLAEntry" ADD CONSTRAINT "SLAEntry_slaTypeId_fkey" FOREIGN KEY ("slaTypeId") REFERENCES "SLAType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
