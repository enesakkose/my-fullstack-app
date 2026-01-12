'use client'

import { DataTable } from '@/components/data-table/data-table'
import { createStockColumns } from '@/components/stocks/columns'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useStocks, useStockMutations, useStockDialogs } from '@/hooks'
import { StockFormDialog } from '@/components/stocks/stock-form-dialog'
import { DeleteStockDialog } from '@/components/stocks/delete-stock-dialog'
import { StockFormValues } from '@/lib/validations/stock'

export default function StocksPage() {
  const { stocks, pagination, isLoading, isFetching, search, setPage, setSearch, refetch } =
    useStocks()

  const {
    isCreateOpen,
    isEditOpen,
    isDeleteOpen,
    selectedStock,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    closeDialog,
    setCreateOpen,
    setEditOpen,
    setDeleteOpen,
  } = useStockDialogs()

  const { createStock, updateStock, deleteStock, isCreating, isUpdating, isDeleting } =
    useStockMutations({
      onCreateSuccess: () => {
        closeDialog()
        refetch()
      },
      onUpdateSuccess: () => {
        closeDialog()
        refetch()
      },
      onDeleteSuccess: () => {
        closeDialog()
        refetch()
      },
    })

  const handleCreate = (data: StockFormValues) => {
    createStock({
      productName: data.productName,
      sku: data.sku,
      quantity: parseInt(data.quantity),
      minQuantity: data.minQuantity ? parseInt(data.minQuantity) : undefined,
      location: data.location || undefined,
    })
  }

  const handleUpdate = (data: StockFormValues) => {
    if (!selectedStock) return
    updateStock({
      id: selectedStock.id,
      productName: data.productName,
      sku: data.sku,
      quantity: parseInt(data.quantity),
      minQuantity: data.minQuantity ? parseInt(data.minQuantity) : undefined,
      location: data.location || undefined,
    })
  }

  const handleDelete = () => {
    if (!selectedStock) return
    deleteStock(selectedStock.id)
  }

  const columns = createStockColumns({
    onEdit: openEditDialog,
    onDelete: openDeleteDialog,
  })

  return (
    <div className='container mx-auto py-10'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-3xl font-bold'>Stok Yönetimi</h1>
          <p className='text-muted-foreground'>Depo ve stok takibi (REST API)</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className='mr-2 h-4 w-4' />
          Yeni Stok
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={stocks}
        isLoading={isLoading}
        isFetching={isFetching}
        pagination={pagination}
        onPageChange={setPage}
        onSearch={setSearch}
        searchValue={search}
        searchPlaceholder='Stok ara...'
      />

      <StockFormDialog
        open={isCreateOpen}
        onOpenChange={setCreateOpen}
        title='Yeni Stok Ekle'
        description='Yeni bir stok kaydı oluşturmak için bilgileri doldurun.'
        onSubmit={handleCreate}
        onCancel={closeDialog}
        isLoading={isCreating}
        submitLabel='Oluştur'
        loadingLabel='Oluşturuluyor...'
      />

      <StockFormDialog
        open={isEditOpen}
        onOpenChange={setEditOpen}
        title='Stok Düzenle'
        description='Stok bilgilerini güncelleyin.'
        onSubmit={handleUpdate}
        onCancel={closeDialog}
        isLoading={isUpdating}
        submitLabel='Güncelle'
        loadingLabel='Güncelleniyor...'
        stock={selectedStock}
      />

      <DeleteStockDialog
        open={isDeleteOpen}
        onOpenChange={setDeleteOpen}
        stockName={selectedStock?.productName}
        onConfirm={handleDelete}
        onCancel={closeDialog}
        isLoading={isDeleting}
      />
    </div>
  )
}
