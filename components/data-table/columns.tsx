'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react'

export type Product = {
  id: number
  name: string
  description: string | null
  price: number
  stock: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface ColumnOptions {
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
}

export const createColumns = ({ onEdit, onDelete }: ColumnOptions): ColumnDef<Product>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => <span className='font-mono text-sm'>{row.getValue('id')}</span>,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Ürün Adı
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => <span className='font-medium'>{row.getValue('name')}</span>,
  },
  {
    accessorKey: 'description',
    header: 'Açıklama',
    cell: ({ row }) => {
      const desc = row.getValue('description') as string | null
      return desc ? (
        <span className='text-muted-foreground max-w-[200px] truncate block'>{desc}</span>
      ) : (
        <span className='text-muted-foreground'>-</span>
      )
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Fiyat
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => {
      const price = row.getValue('price') as number
      return (
        <span className='font-medium'>
          {new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
          }).format(price / 100)}
        </span>
      )
    },
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Stok
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => {
      const stock = row.getValue('stock') as number
      return (
        <Badge variant={stock > 10 ? 'default' : stock > 0 ? 'secondary' : 'destructive'}>
          {stock}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Durum',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>{isActive ? 'Aktif' : 'Pasif'}</Badge>
      )
    },
  },
  {
    id: 'actions',
    header: 'İşlemler',
    cell: ({ row }) => {
      const product = row.original
      return (
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon' onClick={() => onEdit?.(product)}>
            <Pencil className='h-4 w-4' />
          </Button>
          <Button variant='ghost' size='icon' onClick={() => onDelete?.(product)}>
            <Trash2 className='h-4 w-4 text-destructive' />
          </Button>
        </div>
      )
    },
  },
]
