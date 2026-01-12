import { z } from 'zod'
import { Effect } from 'effect'
import { router, publicProcedure } from '../trpc'
import { prisma } from '@/lib/prisma'
import { TRPCError } from '@trpc/server'

// Error types for Effect-TS
class DatabaseError extends Error {
  readonly _tag = 'DatabaseError'
  constructor(message: string) {
    super(message)
    this.name = 'DatabaseError'
  }
}

class NotFoundError extends Error {
  readonly _tag = 'NotFoundError'
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

// Input schemas
const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'price', 'stock', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

const createProductSchema = z.object({
  name: z.string().min(1, 'İsim zorunlu').max(255),
  description: z.string().max(1000).optional(),
  price: z.number().positive('Fiyat pozitif olmalı'),
  stock: z.number().int().nonnegative('Stok negatif olamaz'),
})

const updateProductSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
})

export const productRouter = router({
  // GET ALL - Pagination ile
  getAll: publicProcedure.input(paginationSchema).query(async ({ input }) => {
    const { page, limit, search, sortBy, sortOrder } = input
    const skip = (page - 1) * limit

    const program = Effect.gen(function* () {
      const where = search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { description: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}

      const [products, total] = yield* Effect.tryPromise({
        try: () =>
          Promise.all([
            prisma.product.findMany({
              where,
              skip,
              take: limit,
              orderBy: sortBy ? { [sortBy]: sortOrder ?? 'asc' } : { createdAt: 'desc' },
            }),
            prisma.product.count({ where }),
          ]),
        catch: () => new DatabaseError('Veritabanı hatası'),
      })

      return {
        data: products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      }
    })

    return Effect.runPromise(program)
  }),

  // GET BY ID
  getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const program = Effect.gen(function* () {
      const product = yield* Effect.tryPromise({
        try: () => prisma.product.findUnique({ where: { id: input.id } }),
        catch: () => new DatabaseError('Veritabanı hatası'),
      })

      if (!product) {
        yield* Effect.fail(new NotFoundError('Ürün bulunamadı'))
      }

      return product!
    })

    const result = await Effect.runPromise(program).catch((error) => {
      if (error instanceof NotFoundError) {
        throw new TRPCError({ code: 'NOT_FOUND', message: error.message })
      }
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Sunucu hatası' })
    })

    return result
  }),

  // CREATE
  create: publicProcedure.input(createProductSchema).mutation(async ({ input }) => {
    const program = Effect.tryPromise({
      try: () => prisma.product.create({ data: input }),
      catch: () => new DatabaseError('Ürün oluşturulamadı'),
    })

    return Effect.runPromise(program)
  }),

  // UPDATE
  update: publicProcedure.input(updateProductSchema).mutation(async ({ input }) => {
    const { id, ...data } = input

    const program = Effect.tryPromise({
      try: () => prisma.product.update({ where: { id }, data }),
      catch: () => new DatabaseError('Ürün güncellenemedi'),
    })

    return Effect.runPromise(program).catch(() => {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Ürün bulunamadı' })
    })
  }),

  // DELETE
  delete: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const program = Effect.tryPromise({
      try: () => prisma.product.delete({ where: { id: input.id } }),
      catch: () => new DatabaseError('Ürün silinemedi'),
    })

    return Effect.runPromise(program).catch(() => {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Ürün bulunamadı' })
    })
  }),
})
