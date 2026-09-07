-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "architecture" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "challenge" TEXT,
ADD COLUMN     "impact" TEXT,
ADD COLUMN     "role" TEXT,
ADD COLUMN     "solution" TEXT;

-- CreateTable
CREATE TABLE "SiteContent" (
    "id" SERIAL NOT NULL,
    "heroBadge" TEXT,
    "heroTitle" TEXT,
    "heroDescription" TEXT,
    "aboutTitle" TEXT,
    "aboutText" TEXT,
    "services" JSONB,
    "whyTitle" TEXT,
    "whyItems" JSONB,
    "ctaTitle" TEXT,
    "ctaDescription" TEXT,
    "ctaPrimaryText" TEXT,
    "ctaSecondaryText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteContent_pkey" PRIMARY KEY ("id")
);
