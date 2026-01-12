export interface Stock {
  id: number
  productName: string
  sku: string
  quantity: number
  minQuantity: number
  location: string | null
  lastRestock: string | null
  createdAt: string
  updatedAt: string
}

export interface StockListResponse {
  data: Stock[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateStockData {
  productName: string
  sku: string
  quantity: number
  minQuantity?: number
  location?: string
}

export interface UpdateStockData {
  productName?: string
  sku?: string
  quantity?: number
  minQuantity?: number
  location?: string | null
  lastRestock?: string
}
