import { z } from 'zod'

export const stockFormSchema = z.object({
  productName: z
    .string()
    .min(1, 'Ürün adı zorunludur')
    .max(255, 'Ürün adı en fazla 255 karakter olabilir'),
  sku: z.string().min(1, 'SKU zorunludur').max(50, 'SKU en fazla 50 karakter olabilir'),
  quantity: z
    .string()
    .min(1, 'Miktar zorunludur')
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
      message: 'Miktar 0 veya daha büyük olmalıdır',
    }),
  minQuantity: z
    .string()
    .refine((val) => val === '' || (!isNaN(parseInt(val)) && parseInt(val) >= 0), {
      message: 'Minimum miktar 0 veya daha büyük olmalıdır',
    })
    .optional()
    .or(z.literal('')),
  location: z
    .string()
    .max(100, 'Lokasyon en fazla 100 karakter olabilir')
    .optional()
    .or(z.literal('')),
})

export type StockFormValues = z.infer<typeof stockFormSchema>

export const defaultStockFormValues: StockFormValues = {
  productName: '',
  sku: '',
  quantity: '',
  minQuantity: '',
  location: '',
}
