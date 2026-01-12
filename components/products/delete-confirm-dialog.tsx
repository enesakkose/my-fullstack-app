'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface DeleteConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productName?: string
  onConfirm: () => void
  onCancel: () => void
  isLoading: boolean
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  productName,
  onConfirm,
  onCancel,
  isLoading,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ürünü Sil</DialogTitle>
          <DialogDescription>
            <span className='font-semibold'>{productName}</span> ürününü silmek istediğinize emin
            misiniz? Bu işlem geri alınamaz.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onCancel}>
            İptal
          </Button>
          <Button variant='destructive' onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Siliniyor...' : 'Sil'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
