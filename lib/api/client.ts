import { ApiError } from './error-handler'

type RequestConfig = {
  params?: Record<string, string | number | boolean | undefined | null>
  headers?: Record<string, string>
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl
  }

  private buildUrl(endpoint: string, params?: RequestConfig['params']): string {
    const url = new URL(endpoint, window.location.origin)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value))
        }
      })
    }

    return url.toString()
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const url = this.buildUrl(`${this.baseUrl}${endpoint}`, config?.params)

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new ApiError(
        error.error || `HTTP error ${response.status}`,
        response.status,
        error.code
      )
    }

    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  }

  // HTTP Methods
  get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, config)
  }

  post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>('POST', endpoint, data, config)
  }

  put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>('PUT', endpoint, data, config)
  }

  patch<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>('PATCH', endpoint, data, config)
  }

  delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, config)
  }
}

// Pre-configured API instance
export const api = new ApiClient('/api')

// Create custom instances for different base URLs
export function createApiClient(baseUrl: string): ApiClient {
  return new ApiClient(baseUrl)
}

export { ApiClient }
