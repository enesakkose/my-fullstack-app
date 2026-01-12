# Full-Stack Next.js Demo - Proje Dokümantasyonu

## 🎯 Proje Amacı

Bu proje, farklı backend ve frontend pattern'larını karşılaştırmak için oluşturulmuş bir demo uygulamasıdır.

| Sayfa | Backend | Error Handling | Data Fetching |
|-------|---------|----------------|---------------|
| `/products` | tRPC | Effect-TS | tRPC hooks |
| `/stocks` | REST API | withErrorHandler | TanStack Query + api client |

---

## 📁 Proje Yapısı

```
my-fullstack-app/
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── trpc/[trpc]/         # tRPC endpoint
│   │   └── stocks/              # REST API endpoints
│   ├── products/                # Products sayfası (tRPC)
│   └── stocks/                  # Stocks sayfası (REST)
├── components/
│   ├── ui/                      # Shadcn/ui components
│   ├── data-table/              # Reusable DataTable
│   ├── products/                # Product dialogs
│   └── stocks/                  # Stock dialogs
├── hooks/
│   ├── common/                  # useDebounce vb.
│   ├── products/                # tRPC hooks
│   └── stocks/                  # REST hooks
├── lib/
│   ├── api/                     # API client & error handler
│   ├── trpc/                    # tRPC client & provider
│   ├── validations/             # Zod schemas
│   └── prisma.ts                # Prisma client
├── server/
│   ├── trpc.ts                  # tRPC init
│   └── routers/                 # tRPC routers
├── types/                       # TypeScript types
├── enums/                       # Enums
└── prisma/                      # Prisma schema
```

---

## 🔄 tRPC vs REST API Karşılaştırması

### tRPC (Products Sayfası)

```typescript
// Backend - server/routers/product.ts
export const productRouter = router({
  getAll: publicProcedure
    .input(z.object({ page: z.number() }))
    .query(async ({ input }) => {
      return prisma.product.findMany()
    }),
})

// Frontend - hooks/products/use-products.ts
const { data } = trpc.product.getAll.useQuery({ page: 1 })
```

| ✅ Artılar | ❌ Eksiler |
|-----------|-----------|
| End-to-end type safety | tRPC bilgisi gerekli |
| Otomatik tip çıkarımı | Sadece Next.js/React |
| Daha az boilerplate | Learning curve |
| IDE autocomplete | URL'ler standart değil |

---

### REST API (Stocks Sayfası)

```typescript
// Backend - app/api/stocks/route.ts
export const GET = withErrorHandler(async (request) => {
  const stocks = await prisma.stock.findMany()
  return { data: stocks }
})

// Frontend - hooks/stocks/use-stocks.ts
const query = useQuery({
  queryKey: ["stocks"],
  queryFn: () => api.get<StockListResponse>("/stocks")
})
```

| ✅ Artılar | ❌ Eksiler |
|-----------|-----------|
| Herkes bilir | Manuel tip tanımı |
| Framework agnostic | Response type güvenliği yok |
| Standart HTTP | Daha fazla boilerplate |
| Kolay debug | Refactoring zor |

---

## ⚡ Effect-TS vs Async/Await Karşılaştırması

### Effect-TS (Products Router)

```typescript
// Effect-TS ile
const program = Effect.gen(function* () {
  const product = yield* Effect.tryPromise({
    try: () => prisma.product.findUnique({ where: { id } }),
    catch: () => new DatabaseError("DB hatası"),
  })
  
  if (!product) {
    yield* Effect.fail(new NotFoundError("Ürün bulunamadı"))
  }
  
  return product
})

const result = await Effect.runPromise(program).catch((error) => {
  if (error instanceof NotFoundError) {
    throw new TRPCError({ code: "NOT_FOUND" })
  }
  throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
})
```

| ✅ Artılar | ❌ Eksiler |
|-----------|-----------|
| Hatalar tip sisteminde | Yüksek learning curve |
| Compose edilebilir | Verbose syntax |
| Retry, timeout built-in | Overkill küçük projeler için |
| Test edilebilir | Debugging zor |

---

### Async/Await (Stocks Route)

```typescript
// Async/await ile (withErrorHandler wrapper kullanarak)
export const GET = withErrorHandler(async (request) => {
  const id = await getIdParam(context)
  
  const stock = await prisma.stock.findUnique({ where: { id } })
  if (!stock) throw new NotFoundError("Stok bulunamadı")
  
  return stock
})
```

| ✅ Artılar | ❌ Eksiler |
|-----------|-----------|
| Herkes bilir | Hatalar runtime'da |
| Basit syntax | Manuel error handling |
| Debug kolay | Compose zor |
| Hızlı development | Retry manuel |

---

## 🛠️ API Client Kullanımı

```typescript
import { api } from "@/lib/api"

// GET
const stocks = await api.get<StockListResponse>("/stocks", {
  params: { page: 1, limit: 10 }
})

// POST
const newStock = await api.post<Stock>("/stocks", {
  productName: "Ürün",
  sku: "SKU-001"
})

// PUT
const updated = await api.put<Stock>(`/stocks/${id}`, { quantity: 50 })

// DELETE
await api.delete(`/stocks/${id}`)
```

---

## 📦 Kullanılan Teknolojiler

| Teknoloji | Versiyon | Amaç |
|-----------|----------|------|
| Next.js | 16.1.1 | Framework |
| React | 19.2.3 | UI Library |
| TypeScript | 5.x | Type Safety |
| tRPC | 11.8.1 | Type-safe API (Products) |
| Effect-TS | 3.19.14 | Functional Error Handling |
| Prisma | 7.2.0 | ORM |
| PostgreSQL | 16 | Database |
| TanStack Query | 5.90.16 | Data Fetching |
| TanStack Table | 8.21.3 | DataGrid |
| Shadcn/ui | Latest | UI Components |
| Zod | 4.3.5 | Validation |
| React Hook Form | 7.71.0 | Form Management |

---

## 🚀 Çalıştırma

```bash
# 1. PostgreSQL başlat
docker compose up -d

# 2. Prisma migration
bunx prisma migrate dev

# 3. Development server
bun run dev

# 4. Tarayıcıda aç
open http://localhost:3000
```

---

## 📊 Hangi Yaklaşımı Seçmeli?

### tRPC + Effect-TS Seç:
- Büyük ekip/proje
- Type safety kritik
- Complex business logic
- Long-term maintenance

### REST + Async/Await Seç:
- Küçük/orta proje
- Hızlı MVP geliştirme
- Ekip tRPC bilmiyor
- Mobile/diğer client'lar olacak

---

## 📝 Sonuç

Bu proje her iki yaklaşımı da göstermektedir:

| Products | Stocks |
|----------|--------|
| Modern, type-safe | Klasik, anlaşılır |
| tRPC + Effect-TS | REST + withErrorHandler |
| Learning curve yüksek | Herkes yapabilir |

Her iki yaklaşım da production-ready. Seçim projenin gereksinimlerine ve ekibin deneyimine bağlı.
