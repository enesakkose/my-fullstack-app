import { z } from 'zod'

export const productFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Ürün adı zorunludur')
    .max(255, 'Ürün adı en fazla 255 karakter olabilir'),
  description: z
    .string()
    .max(1000, 'Açıklama en fazla 1000 karakter olabilir')
    .optional()
    .or(z.literal('')),
  price: z
    .string()
    .min(1, 'Fiyat zorunludur')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Fiyat pozitif bir sayı olmalıdır',
    }),
  stock: z
    .string()
    .min(1, 'Stok zorunludur')
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
      message: 'Stok 0 veya daha büyük olmalıdır',
    }),
})

export type ProductFormValues = z.infer<typeof productFormSchema>

export const defaultProductFormValues: ProductFormValues = {
  name: '',
  description: '',
  price: '',
  stock: '',
}
