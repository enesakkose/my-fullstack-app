'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
} from '@tanstack/react-table'
import { useState, memo } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  isFetching?: boolean
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  onPageChange?: (page: number) => void
  onSearch?: (search: string) => void
  searchValue?: string
  searchPlaceholder?: string
}

// Memoized table body to prevent unnecessary re-renders
const TableContent = memo(function TableContent<TData, TValue>({
  table,
  columns,
  isLoading,
}: {
  table: ReturnType<typeof useReactTable<TData>>
  columns: ColumnDef<TData, TValue>[]
  isLoading?: boolean
}) {
  if (isLoading) {
    return (
      <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            {columns.map((_, j) => (
              <TableCell key={j}>
                <Skeleton className='h-4 w-full' />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    )
  }

  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className='h-24 text-center'>
            Sonuç bulunamadı.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  )
}) as <TData, TValue>(props: {
  table: ReturnType<typeof useReactTable<TData>>
  columns: ColumnDef<TData, TValue>[]
  isLoading?: boolean
}) => React.ReactElement

// Separate search input component to prevent re-renders
function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className='max-w-sm'
    />
  )
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  isFetching,
  pagination,
  onPageChange,
  onSearch,
  searchValue: externalSearchValue,
  searchPlaceholder = 'Ara...',
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [internalSearchValue, setInternalSearchValue] = useState('')

  // Use external search value if provided, otherwise use internal
  const isControlled = externalSearchValue !== undefined
  const searchValue = isControlled ? externalSearchValue : internalSearchValue

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  const handleSearch = (value: string) => {
    if (!isControlled) {
      setInternalSearchValue(value)
    }
    onSearch?.(value)
  }

  return (
    <div className='space-y-4'>
      {onSearch && (
        <SearchInput value={searchValue} onChange={handleSearch} placeholder={searchPlaceholder} />
      )}

      <div className='rounded-md border relative'>
        {isFetching && !isLoading && (
          <div className='absolute inset-0 bg-background/50 flex items-center justify-center z-10'>
            <div className='animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full' />
          </div>
        )}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableContent table={table} columns={columns} isLoading={isLoading} />
        </Table>
      </div>

      {pagination && onPageChange && (
        <div className='flex items-center justify-between'>
          <div className='text-sm text-muted-foreground'>Toplam {pagination.total} kayıt</div>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              Önceki
            </Button>
            <div className='text-sm'>
              Sayfa {pagination.page} / {pagination.totalPages}
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              Sonraki
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
