import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted'>
      <div className='text-center space-y-6 max-w-2xl px-4'>
        <h1 className='text-5xl font-bold tracking-tight'>Effect-TS + tRPC Demo</h1>
        <p className='text-xl text-muted-foreground'>
          Full-stack Next.js uygulaması: Effect-TS, tRPC, Prisma, PostgreSQL, TanStack Query ve
          Shadcn/ui ile oluşturuldu.
        </p>

        <div className='flex flex-col sm:flex-row gap-4 justify-center pt-4'>
          <Link href='/products'>
            <Button size='lg' className='w-full sm:w-auto'>
              Ürünler (tRPC)
            </Button>
          </Link>
          <Link href='/stocks'>
            <Button size='lg' variant='outline' className='w-full sm:w-auto'>
              Stoklar (REST API)
            </Button>
          </Link>
        </div>

        <div className='pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
          <div className='bg-card rounded-lg p-4 border'>
            <div className='font-semibold'>Effect-TS</div>
            <div className='text-muted-foreground'>Type-safe errors</div>
          </div>
          <div className='bg-card rounded-lg p-4 border'>
            <div className='font-semibold'>tRPC</div>
            <div className='text-muted-foreground'>End-to-end types</div>
          </div>
          <div className='bg-card rounded-lg p-4 border'>
            <div className='font-semibold'>Prisma</div>
            <div className='text-muted-foreground'>Type-safe ORM</div>
          </div>
          <div className='bg-card rounded-lg p-4 border'>
            <div className='font-semibold'>TanStack</div>
            <div className='text-muted-foreground'>Query & Table</div>
          </div>
        </div>
      </div>
    </div>
  )
}
