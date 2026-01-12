import { useState, useCallback } from 'react'
import { Stock } from '@/types'
import { DialogType } from '@/enums'

export function useStockDialogs() {
  const [activeDialog, setActiveDialog] = useState<DialogType | null>(null)
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)

  const openCreateDialog = useCallback(() => {
    setActiveDialog(DialogType.CREATE)
    setSelectedStock(null)
  }, [])

  const openEditDialog = useCallback((stock: Stock) => {
    setSelectedStock(stock)
    setActiveDialog(DialogType.EDIT)
  }, [])

  const openDeleteDialog = useCallback((stock: Stock) => {
    setSelectedStock(stock)
    setActiveDialog(DialogType.DELETE)
  }, [])

  const closeDialog = useCallback(() => {
    setActiveDialog(null)
    setSelectedStock(null)
  }, [])

  return {
    isCreateOpen: activeDialog === DialogType.CREATE,
    isEditOpen: activeDialog === DialogType.EDIT,
    isDeleteOpen: activeDialog === DialogType.DELETE,
    selectedStock,

    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    closeDialog,

    setCreateOpen: (open: boolean) => !open && activeDialog === DialogType.CREATE && closeDialog(),
    setEditOpen: (open: boolean) => !open && activeDialog === DialogType.EDIT && closeDialog(),
    setDeleteOpen: (open: boolean) => !open && activeDialog === DialogType.DELETE && closeDialog(),
  }
}
