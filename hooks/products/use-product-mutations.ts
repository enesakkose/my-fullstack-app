import { trpc } from '@/lib/trpc/client'
import { toast } from 'sonner'

interface UseProductMutationsOptions {
  onCreateSuccess?: () => void
  onUpdateSuccess?: () => void
  onDeleteSuccess?: () => void
}

export function useProductMutations(options: UseProductMutationsOptions = {}) {
  const { onCreateSuccess, onUpdateSuccess, onDeleteSuccess } = options

  const createMutation = trpc.product.create.useMutation({
    onSuccess: () => {
      toast.success('Ürün başarıyla oluşturuldu')
      onCreateSuccess?.()
    },
    onError: (error) => {
      toast.error(error.message || 'Ürün oluşturulurken hata oluştu')
    },
  })

  const updateMutation = trpc.product.update.useMutation({
    onSuccess: () => {
      toast.success('Ürün başarıyla güncellendi')
      onUpdateSuccess?.()
    },
    onError: (error) => {
      toast.error(error.message || 'Ürün güncellenirken hata oluştu')
    },
  })

  const deleteMutation = trpc.product.delete.useMutation({
    onSuccess: () => {
      toast.success('Ürün başarıyla silindi')
      onDeleteSuccess?.()
    },
    onError: (error) => {
      toast.error(error.message || 'Ürün silinirken hata oluştu')
    },
  })

  const createProduct = (data: {
    name: string
    description?: string
    price: number
    stock: number
  }) => {
    createMutation.mutate(data)
  }

  const updateProduct = (data: {
    id: number
    name?: string
    description?: string
    price?: number
    stock?: number
  }) => {
    updateMutation.mutate(data)
  }

  const deleteProduct = (id: number) => {
    deleteMutation.mutate({ id })
  }

  return {
    createProduct,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    updateProduct,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,

    deleteProduct,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  }
}
