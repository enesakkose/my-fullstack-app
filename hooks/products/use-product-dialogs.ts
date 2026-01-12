import { useState, useCallback } from 'react'
import { Product } from '@/components/data-table/columns'
import { DialogType } from '@/enums'

export function useProductDialogs() {
  const [activeDialog, setActiveDialog] = useState<DialogType | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const openCreateDialog = useCallback(() => {
    setActiveDialog(DialogType.CREATE)
    setSelectedProduct(null)
  }, [])

  const openEditDialog = useCallback((product: Product) => {
    setSelectedProduct(product)
    setActiveDialog(DialogType.EDIT)
  }, [])

  const openDeleteDialog = useCallback((product: Product) => {
    setSelectedProduct(product)
    setActiveDialog(DialogType.DELETE)
  }, [])

  const closeDialog = useCallback(() => {
    setActiveDialog(null)
    setSelectedProduct(null)
  }, [])

  return {
    // Dialog state
    isCreateOpen: activeDialog === DialogType.CREATE,
    isEditOpen: activeDialog === DialogType.EDIT,
    isDeleteOpen: activeDialog === DialogType.DELETE,
    selectedProduct,

    // Actions
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    closeDialog,

    // For Dialog onOpenChange handlers
    setCreateOpen: (open: boolean) => !open && activeDialog === DialogType.CREATE && closeDialog(),
    setEditOpen: (open: boolean) => !open && activeDialog === DialogType.EDIT && closeDialog(),
    setDeleteOpen: (open: boolean) => !open && activeDialog === DialogType.DELETE && closeDialog(),
  }
}
