import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withErrorHandler, parseBody, parseQuery } from '@/lib/api'

// Schemas
const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional().nullable(),
})

const createSchema = z.object({
  productName: z.string().min(1),
  sku: z.string().min(1),
  quantity: z.number().int().min(0),
  minQuantity: z.number().int().min(0).optional(),
  location: z.string().optional(),
})

// GET /api/stocks
export const GET = withErrorHandler(async (request: NextRequest) => {
  const { page, limit, search } = parseQuery(request, querySchema)
  const skip = (page - 1) * limit

  const where = search
    ? {
        OR: [
          { productName: { contains: search, mode: 'insensitive' as const } },
          { sku: { contains: search, mode: 'insensitive' as const } },
          { location: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {}

  const [stocks, total] = await Promise.all([
    prisma.stock.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.stock.count({ where }),
  ])

  return {
    data: stocks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
})

// POST /api/stocks
export const POST = withErrorHandler(async (request: NextRequest) => {
  const data = await parseBody(request, createSchema)

  const stock = await prisma.stock.create({
    data: {
      productName: data.productName,
      sku: data.sku,
      quantity: data.quantity,
      minQuantity: data.minQuantity ?? 10,
      location: data.location,
    },
  })

  return NextResponse.json(stock, { status: 201 })
})
