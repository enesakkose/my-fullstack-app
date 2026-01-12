import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Error types
export class ApiError extends Error {
  constructor(message: string, public statusCode: number = 500, public code?: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Kayıt bulunamadı') {
    super(message, 404, 'NOT_FOUND')
  }
}

export class ValidationError extends ApiError {
  constructor(message: string = 'Geçersiz veri', public details?: z.ZodIssue[]) {
    super(message, 400, 'VALIDATION_ERROR')
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = 'Bu kayıt zaten mevcut') {
    super(message, 409, 'CONFLICT')
  }
}

// Handler type
type ApiHandler<T = unknown> = (
  request: NextRequest,
  context: { params: Promise<Record<string, string>> }
) => Promise<T>

// Wrapper function
export function withErrorHandler<T>(handler: ApiHandler<T>) {
  return async (
    request: NextRequest,
    context: { params: Promise<Record<string, string>> }
  ): Promise<NextResponse> => {
    try {
      const result = await handler(request, context)

      // If handler returns NextResponse, use it directly
      if (result instanceof NextResponse) {
        return result
      }

      // Otherwise wrap in JSON response
      return NextResponse.json(result)
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: 'Geçersiz veri', details: error.issues }, { status: 400 })
      }

      // Handle custom API errors
      if (error instanceof ApiError) {
        return NextResponse.json(
          { error: error.message, code: error.code },
          { status: error.statusCode }
        )
      }

      // Handle Prisma errors
      const prismaError = error as { code?: string; meta?: { target?: string[] } }
      if (prismaError.code === 'P2002') {
        const field = prismaError.meta?.target?.[0] || 'alan'
        return NextResponse.json(
          { error: `Bu ${field} zaten mevcut`, code: 'CONFLICT' },
          { status: 409 }
        )
      }
      if (prismaError.code === 'P2025') {
        return NextResponse.json({ error: 'Kayıt bulunamadı', code: 'NOT_FOUND' }, { status: 404 })
      }

      // Log unexpected errors
      console.error('API Error:', error)

      // Return generic error
      return NextResponse.json(
        { error: 'Sunucu hatası', code: 'INTERNAL_SERVER_ERROR' },
        { status: 500 }
      )
    }
  }
}

// Helper to parse and validate request body
export async function parseBody<T extends z.ZodSchema>(
  request: NextRequest,
  schema: T
): Promise<z.infer<T>> {
  const body = await request.json()
  return schema.parse(body)
}

// Helper to parse query params
export function parseQuery<T extends z.ZodSchema>(request: NextRequest, schema: T): z.infer<T> {
  const { searchParams } = new URL(request.url)
  const params: Record<string, string | null> = {}
  searchParams.forEach((value, key) => {
    params[key] = value
  })
  return schema.parse(params)
}

// Helper to parse route params
export async function parseParams(context: {
  params: Promise<Record<string, string>>
}): Promise<Record<string, string>> {
  return context.params
}

// Helper to get ID from params
export async function getIdParam(context: {
  params: Promise<Record<string, string>>
}): Promise<number> {
  const params = await context.params
  const id = parseInt(params.id)
  if (isNaN(id)) {
    throw new ValidationError('Geçersiz ID')
  }
  return id
}
