-- CreateEnum
CREATE TYPE "TemplateType" AS ENUM ('GENERAL', 'RESTAURANT', 'PORTFOLIO', 'PROGRAMMER', 'DEVELOPER', 'BUSINESS', 'MEDICAL');

-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('HEADER', 'ABOUT', 'SERVICES', 'MENU', 'PORTFOLIO', 'TEAM', 'CONTACT', 'BLOG', 'FOOTER', 'PROJECTS', 'SKILLS', 'RESUME');

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "templateData" JSONB,
    "templateType" "TemplateType" NOT NULL DEFAULT 'GENERAL',

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateSection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sectionType" "SectionType" NOT NULL,
    "sectionData" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "templateId" TEXT NOT NULL,

    CONSTRAINT "TemplateSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "templateId" TEXT,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Template_userId_idx" ON "Template"("userId");

-- CreateIndex
CREATE INDEX "Template_templateType_idx" ON "Template"("templateType");

-- CreateIndex
CREATE INDEX "TemplateSection_templateId_idx" ON "TemplateSection"("templateId");

-- CreateIndex
CREATE INDEX "TemplateSection_sectionType_idx" ON "TemplateSection"("sectionType");

-- CreateIndex
CREATE INDEX "Media_userId_idx" ON "Media"("userId");

-- CreateIndex
CREATE INDEX "Media_templateId_idx" ON "Media"("templateId");

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateSection" ADD CONSTRAINT "TemplateSection_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;
