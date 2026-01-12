import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@/hooks/common'
import { api } from '@/lib/api'
import { StockListResponse } from '@/types'

interface UseStocksOptions {
  initialPage?: number
  limit?: number
  debounceMs?: number
}

export function useStocks(options: UseStocksOptions = {}) {
  const { initialPage = 1, limit = 10, debounceMs = 300 } = options
  const [page, setPage] = useState(initialPage)
  const [search, setSearch] = useState('')

  const debouncedSearch = useDebounce(search, debounceMs)

  const query = useQuery({
    queryKey: ['stocks', page, limit, debouncedSearch],
    queryFn: () =>
      api.get<StockListResponse>('/stocks', {
        params: { page, limit, search: debouncedSearch || undefined },
      }),
  })

  return {
    stocks: query.data?.data ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    page,
    setPage,
    search,
    setSearch,
    refetch: query.refetch,
  }
}
