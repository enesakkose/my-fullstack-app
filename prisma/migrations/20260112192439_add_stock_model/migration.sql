-- CreateTable
CREATE TABLE "Stock" (
    "id" SERIAL NOT NULL,
    "productName" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "minQuantity" INTEGER NOT NULL DEFAULT 10,
    "location" TEXT,
    "lastRestock" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stock_sku_key" ON "Stock"("sku");

-- CreateIndex
CREATE INDEX "Stock_sku_idx" ON "Stock"("sku");

-- CreateIndex
CREATE INDEX "Stock_productName_idx" ON "Stock"("productName");
