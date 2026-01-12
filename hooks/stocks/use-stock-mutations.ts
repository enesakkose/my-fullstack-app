import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { Stock, CreateStockData, UpdateStockData } from '@/types'

interface UseStockMutationsOptions {
  onCreateSuccess?: () => void
  onUpdateSuccess?: () => void
  onDeleteSuccess?: () => void
}

export function useStockMutations(options: UseStockMutationsOptions = {}) {
  const { onCreateSuccess, onUpdateSuccess, onDeleteSuccess } = options
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data: CreateStockData) => api.post<Stock>('/stocks', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] })
      toast.success('Stok başarıyla oluşturuldu')
      onCreateSuccess?.()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Stok oluşturulurken hata oluştu')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: UpdateStockData & { id: number }) =>
      api.put<Stock>(`/stocks/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] })
      toast.success('Stok başarıyla güncellendi')
      onUpdateSuccess?.()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Stok güncellenirken hata oluştu')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete<{ success: boolean }>(`/stocks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] })
      toast.success('Stok başarıyla silindi')
      onDeleteSuccess?.()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Stok silinirken hata oluştu')
    },
  })

  return {
    createStock: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    updateStock: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,

    deleteStock: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  }
}
