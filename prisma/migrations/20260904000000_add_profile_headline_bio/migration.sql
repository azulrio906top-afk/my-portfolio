-- Add public profile copy used by the landing page and chatbot.
ALTER TABLE "Profile" ADD COLUMN "headline" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Profile" ADD COLUMN "bio" TEXT NOT NULL DEFAULT '';
