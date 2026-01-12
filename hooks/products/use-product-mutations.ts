import { trpc } from '@/lib/trpc/client'

interface UseProductMutationsOptions {
  onCreateSuccess?: () => void
  onUpdateSuccess?: () => void
  onDeleteSuccess?: () => void
}

export function useProductMutations(options: UseProductMutationsOptions = {}) {
  const { onCreateSuccess, onUpdateSuccess, onDeleteSuccess } = options

  const createMutation = trpc.product.create.useMutation({
    onSuccess: onCreateSuccess,
  })

  const updateMutation = trpc.product.update.useMutation({
    onSuccess: onUpdateSuccess,
  })

  const deleteMutation = trpc.product.delete.useMutation({
    onSuccess: onDeleteSuccess,
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
    // Create
    createProduct,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    // Update
    updateProduct,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,

    // Delete
    deleteProduct,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  }
}
