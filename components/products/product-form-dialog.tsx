'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import {
  productFormSchema,
  ProductFormValues,
  defaultProductFormValues,
} from '@/lib/validations/product'
import { useEffect } from 'react'
import { Product } from '@/components/data-table/columns'

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onSubmit: (data: ProductFormValues) => void
  onCancel: () => void
  isLoading: boolean
  submitLabel: string
  loadingLabel: string
  defaultValues?: Partial<ProductFormValues>
  product?: Product | null
}

export function ProductFormDialog({
  open,
  onOpenChange,
  title,
  description,
  onSubmit,
  onCancel,
  isLoading,
  submitLabel,
  loadingLabel,
  product,
}: ProductFormDialogProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: defaultProductFormValues,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  // Reset form when dialog opens/closes or product changes
  useEffect(() => {
    if (open && product) {
      reset({
        name: product.name,
        description: product.description || '',
        price: String(product.price / 100),
        stock: String(product.stock),
      })
    } else if (open && !product) {
      reset(defaultProductFormValues)
    }
  }, [open, product, reset])

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
              <Label htmlFor='name'>Ürün Adı</Label>
              <Input id='name' {...register('name')} placeholder='Ürün adı' />
              {errors.name && <p className='text-sm text-destructive'>{errors.name.message}</p>}
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='description'>Açıklama</Label>
              <Input
                id='description'
                {...register('description')}
                placeholder='Ürün açıklaması (opsiyonel)'
              />
              {errors.description && (
                <p className='text-sm text-destructive'>{errors.description.message}</p>
              )}
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='price'>Fiyat (₺)</Label>
                <Input
                  id='price'
                  type='number'
                  step='0.01'
                  {...register('price')}
                  placeholder='0.00'
                />
                {errors.price && <p className='text-sm text-destructive'>{errors.price.message}</p>}
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='stock'>Stok</Label>
                <Input id='stock' type='number' {...register('stock')} placeholder='0' />
                {errors.stock && <p className='text-sm text-destructive'>{errors.stock.message}</p>}
              </div>
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
