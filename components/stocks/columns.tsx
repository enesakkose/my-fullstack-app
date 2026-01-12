'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Stock } from '@/types'

interface ColumnOptions {
  onEdit?: (stock: Stock) => void
  onDelete?: (stock: Stock) => void
}

export const createStockColumns = ({ onEdit, onDelete }: ColumnOptions): ColumnDef<Stock>[] => [
  {
    accessorKey: 'productName',
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Ürün Adı
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
  },
  {
    accessorKey: 'sku',
    header: 'SKU',
    cell: ({ row }) => (
      <code className='bg-muted px-2 py-1 rounded text-sm'>{row.getValue('sku')}</code>
    ),
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Miktar
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => {
      const quantity = row.getValue('quantity') as number
      const minQuantity = row.original.minQuantity
      const isLow = quantity <= minQuantity

      return (
        <div className='flex items-center gap-2'>
          <span className={isLow ? 'text-destructive font-semibold' : ''}>{quantity}</span>
          {isLow && <Badge variant='destructive'>Düşük</Badge>}
        </div>
      )
    },
  },
  {
    accessorKey: 'minQuantity',
    header: 'Min. Miktar',
  },
  {
    accessorKey: 'location',
    header: 'Lokasyon',
    cell: ({ row }) => {
      const location = row.getValue('location') as string | null
      return location || <span className='text-muted-foreground'>-</span>
    },
  },
  {
    accessorKey: 'lastRestock',
    header: 'Son Stok',
    cell: ({ row }) => {
      const date = row.getValue('lastRestock') as string | null
      if (!date) return <span className='text-muted-foreground'>-</span>
      return new Date(date).toLocaleDateString('tr-TR')
    },
  },
  {
    id: 'actions',
    header: 'İşlemler',
    cell: ({ row }) => {
      const stock = row.original
      return (
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon' onClick={() => onEdit?.(stock)}>
            <Pencil className='h-4 w-4' />
          </Button>
          <Button variant='ghost' size='icon' onClick={() => onDelete?.(stock)}>
            <Trash2 className='h-4 w-4 text-destructive' />
          </Button>
        </div>
      )
    },
  },
]
