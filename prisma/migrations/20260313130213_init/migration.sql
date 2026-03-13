-- CreateTable
CREATE TABLE "Poem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "poemText" TEXT NOT NULL,
    "poemType" TEXT NOT NULL,
    "imageData" TEXT NOT NULL,
    "season" TEXT,
    "mood" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
