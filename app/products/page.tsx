'use client'

import { DataTable } from '@/components/data-table/data-table'
import { createColumns } from '@/components/data-table/columns'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useProducts, useProductMutations, useProductDialogs } from '@/hooks'
import { ProductFormDialog } from '@/components/products/product-form-dialog'
import { DeleteConfirmDialog } from '@/components/products/delete-confirm-dialog'
import { ProductFormValues } from '@/lib/validations/product'

export default function ProductsPage() {
  // Custom hooks
  const { products, pagination, isLoading, isFetching, search, setPage, setSearch, refetch } =
    useProducts()

  const {
    isCreateOpen,
    isEditOpen,
    isDeleteOpen,
    selectedProduct,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    closeDialog,
    setCreateOpen,
    setEditOpen,
    setDeleteOpen,
  } = useProductDialogs()

  const { createProduct, updateProduct, deleteProduct, isCreating, isUpdating, isDeleting } =
    useProductMutations({
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

  // Handlers
  const handleCreate = (data: ProductFormValues) => {
    createProduct({
      name: data.name,
      description: data.description || undefined,
      price: Math.round(parseFloat(data.price) * 100),
      stock: parseInt(data.stock),
    })
  }

  const handleUpdate = (data: ProductFormValues) => {
    if (!selectedProduct) return
    updateProduct({
      id: selectedProduct.id,
      name: data.name,
      description: data.description || undefined,
      price: Math.round(parseFloat(data.price) * 100),
      stock: parseInt(data.stock),
    })
  }

  const handleDelete = () => {
    if (!selectedProduct) return
    deleteProduct(selectedProduct.id)
  }

  const columns = createColumns({
    onEdit: openEditDialog,
    onDelete: openDeleteDialog,
  })

  return (
    <div className='container mx-auto py-10'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-3xl font-bold'>Ürünler</h1>
          <p className='text-muted-foreground'>Ürün yönetimi ve stok takibi</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className='mr-2 h-4 w-4' />
          Yeni Ürün
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={products}
        isLoading={isLoading}
        isFetching={isFetching}
        pagination={pagination}
        onPageChange={setPage}
        onSearch={setSearch}
        searchValue={search}
        searchPlaceholder='Ürün ara...'
      />

      {/* Create Dialog */}
      <ProductFormDialog
        open={isCreateOpen}
        onOpenChange={setCreateOpen}
        title='Yeni Ürün Ekle'
        description='Yeni bir ürün oluşturmak için bilgileri doldurun.'
        onSubmit={handleCreate}
        onCancel={closeDialog}
        isLoading={isCreating}
        submitLabel='Oluştur'
        loadingLabel='Oluşturuluyor...'
      />

      {/* Edit Dialog */}
      <ProductFormDialog
        open={isEditOpen}
        onOpenChange={setEditOpen}
        title='Ürünü Düzenle'
        description='Ürün bilgilerini güncelleyin.'
        onSubmit={handleUpdate}
        onCancel={closeDialog}
        isLoading={isUpdating}
        submitLabel='Güncelle'
        loadingLabel='Güncelleniyor...'
        product={selectedProduct}
      />

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setDeleteOpen}
        productName={selectedProduct?.name}
        onConfirm={handleDelete}
        onCancel={closeDialog}
        isLoading={isDeleting}
      />
    </div>
  )
}
