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

interface DeleteStockDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  stockName?: string
  onConfirm: () => void
  onCancel: () => void
  isLoading: boolean
}

export function DeleteStockDialog({
  open,
  onOpenChange,
  stockName,
  onConfirm,
  onCancel,
  isLoading,
}: DeleteStockDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stok Kaydını Sil</DialogTitle>
          <DialogDescription>
            <span className='font-semibold'>{stockName}</span> stok kaydını silmek istediğinize emin
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
