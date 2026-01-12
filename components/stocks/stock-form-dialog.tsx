'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { stockFormSchema, StockFormValues, defaultStockFormValues } from '@/lib/validations/stock'
import { Stock } from '@/types'

interface StockFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onSubmit: (data: StockFormValues) => void
  onCancel: () => void
  isLoading: boolean
  submitLabel: string
  loadingLabel: string
  stock?: Stock | null
}

export function StockFormDialog({
  open,
  onOpenChange,
  title,
  description,
  onSubmit,
  onCancel,
  isLoading,
  submitLabel,
  loadingLabel,
  stock,
}: StockFormDialogProps) {
  const form = useForm<StockFormValues>({
    resolver: zodResolver(stockFormSchema),
    defaultValues: defaultStockFormValues,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  useEffect(() => {
    if (open && stock) {
      reset({
        productName: stock.productName,
        sku: stock.sku,
        quantity: String(stock.quantity),
        minQuantity: String(stock.minQuantity),
        location: stock.location || '',
      })
    } else if (open && !stock) {
      reset(defaultStockFormValues)
    }
  }, [open, stock, reset])

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit(data)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='productName'>Ürün Adı</Label>
              <Input id='productName' {...register('productName')} placeholder='Ürün adı' />
              {errors.productName && (
                <p className='text-sm text-destructive'>{errors.productName.message}</p>
              )}
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='sku'>SKU (Stok Kodu)</Label>
              <Input id='sku' {...register('sku')} placeholder='SKU-001' />
              {errors.sku && <p className='text-sm text-destructive'>{errors.sku.message}</p>}
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='quantity'>Miktar</Label>
                <Input id='quantity' type='number' {...register('quantity')} placeholder='0' />
                {errors.quantity && (
                  <p className='text-sm text-destructive'>{errors.quantity.message}</p>
                )}
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='minQuantity'>Minimum Miktar</Label>
                <Input
                  id='minQuantity'
                  type='number'
                  {...register('minQuantity')}
                  placeholder='10'
                />
                {errors.minQuantity && (
                  <p className='text-sm text-destructive'>{errors.minQuantity.message}</p>
                )}
              </div>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='location'>Lokasyon</Label>
              <Input id='location' {...register('location')} placeholder='Depo A, Raf 3' />
              {errors.location && (
                <p className='text-sm text-destructive'>{errors.location.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={onCancel}>
              İptal
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? loadingLabel : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
