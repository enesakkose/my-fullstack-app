import { useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { useDebounce } from '@/hooks/common'

interface UseProductsOptions {
  initialPage?: number
  limit?: number
  debounceMs?: number
}

export function useProducts(options: UseProductsOptions = {}) {
  const { initialPage = 1, limit = 10, debounceMs = 300 } = options
  const [page, setPage] = useState(initialPage)
  const [search, setSearch] = useState('')

  // Debounce search to prevent excessive API calls
  const debouncedSearch = useDebounce(search, debounceMs)

  const query = trpc.product.getAll.useQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
  })

  return {
    // Data
    products: query.data?.data ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isFetching: query.isFetching,

    // Pagination
    page,
    setPage,

    // Search - input uses search, query uses debouncedSearch
    search,
    setSearch,

    // Refetch
    refetch: query.refetch,
  }
}
