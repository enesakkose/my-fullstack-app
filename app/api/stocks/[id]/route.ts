import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withErrorHandler, parseBody, getIdParam, NotFoundError } from '@/lib/api'

const updateSchema = z.object({
  productName: z.string().min(1).optional(),
  sku: z.string().min(1).optional(),
  quantity: z.number().int().min(0).optional(),
  minQuantity: z.number().int().min(0).optional(),
  location: z.string().nullable().optional(),
  lastRestock: z.string().datetime().optional(),
})

// GET /api/stocks/[id]
export const GET = withErrorHandler(async (request: NextRequest, context) => {
  const id = await getIdParam(context)

  const stock = await prisma.stock.findUnique({ where: { id } })
  if (!stock) throw new NotFoundError('Stok bulunamadı')

  return stock
})

// PUT /api/stocks/[id]
export const PUT = withErrorHandler(async (request: NextRequest, context) => {
  const id = await getIdParam(context)
  const data = await parseBody(request, updateSchema)

  const stock = await prisma.stock.update({
    where: { id },
    data: {
      ...data,
      lastRestock: data.lastRestock ? new Date(data.lastRestock) : undefined,
    },
  })

  return stock
})

// DELETE /api/stocks/[id]
export const DELETE = withErrorHandler(async (request: NextRequest, context) => {
  const id = await getIdParam(context)

  await prisma.stock.delete({ where: { id } })

  return { success: true }
})
