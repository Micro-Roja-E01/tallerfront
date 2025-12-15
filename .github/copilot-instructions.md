# Tienda UCN Frontend - AI Coding Agent Instructions

## Project Overview

Next.js 15 e-commerce frontend for Universidad Católica del Norte. Built with TypeScript, shadcn/ui components, and NextAuth for authentication. Uses a layered architecture with Views, Services, Hooks, and Stores pattern.

## Architecture Layers

### View-Page Pattern

Pages (in `app/`) are thin wrappers that export Views from `src/views/`. Example:

```tsx
// app/products/page.tsx
import { ProductsView } from "@/views";
export default function ProductsPage() {
  return <ProductsView />;
}
```

Views in `src/views/app/` contain actual business logic and UI. They are client components ("use client") that use custom hooks for state management.

### Service Layer (`src/services/`)

All API calls go through service classes extending `BaseApiService`:

- Each service (ProductService, CartService, OrderService, AuthService) wraps axios calls
- Services inject `axiosInstance` from `@/providers` with auto-configured auth headers
- Never call axios directly from components or hooks

### Hook Layer (`src/hooks/api/`)

React Query hooks wrap service methods:

- `useGetProductsForCustomer`, `useGetProductDetail`, `useCreateProductMutation`, etc.
- Always include proper `queryKey` arrays with params for cache invalidation
- Use `enabled` flag for conditional fetching: `enabled: enabled && isValidId(id)`

### State Management

- **Zustand stores** (`src/stores/`): Client-side persistent state (e.g., `useCartStore` with localStorage)
- **React Query**: Server state caching and synchronization
- **NextAuth session**: Auth state, accessible via `useSession()` hook

## Authentication & Authorization

### NextAuth Configuration (`src/auth.config.ts`)

- Uses Credentials provider with JWT tokens from backend API
- Custom JWT callback stores: `accessToken`, `userId`, `role`, `customExp`
- Token structure is decoded from backend JWT (see `extractUserFromJwt` in `src/lib/auth.ts`)

### Middleware (`src/middleware.ts`)

Route protection logic:

- **Public routes**: `/`, `/products`, `/auth/*`, `/cart`
- **Admin routes**: `/admin/*` - requires `role: "Admin"`
- **Authenticated routes**: `/checkout`, `/orders` - requires valid session
- Always check token expiration via `isTokenExpired()` from `@/lib/auth`

### Axios Interceptor (`src/providers/axios-provider.tsx`)

Automatically:

1. Adds `Authorization: Bearer <token>` header from NextAuth session
2. Checks session expiration before each request
3. Auto-signs out and shows toast on expired sessions

## Error Handling Pattern

### API Error Handler (`src/lib/api.ts`)

Centralized `handleApiError()` function transforms axios errors into structured format:

```typescript
{ message: string, details: string, canRetry: boolean }
```

Always use this in query error handlers:

```typescript
const { error } = useQuery({...});
if (error) {
  const apiError = handleApiError(error);
  toast.error(apiError.message, { description: apiError.details });
}
```

## Key Conventions

### Import Paths

Always use `@/` alias (configured in tsconfig.json):

```typescript
import { Button } from "@/components/ui";
import { useCartStore } from "@/stores";
import { productService } from "@/services";
```

### Index Exports

Directories like `services/`, `hooks/`, `models/`, `views/` have `index.ts` barrel exports. Import from the directory, not individual files:

```typescript
// Good
import { ProductsView, CartView } from "@/views";
// Bad
import ProductsView from "@/views/app/products";
```

### TypeScript Models (`src/models/`)

- **requests/**: API request DTOs (e.g., `PaginationQueryParams`, `CreateProductRequest`)
- **responses/**: API response DTOs (e.g., `ProductListForCustomerResponse`)
- **generics/**: Shared types (e.g., `ApiResponse<T>`, `ApiErrorResult`)

### Naming Patterns

- Services: `ProductService`, methods like `getProductsForCustomer()`, `getProductsForAdmin()`
- Hooks: `useGetProductsForCustomer`, `useCreateProductMutation`
- Views: `ProductsView`, `ProductDetailView` (default exports)
- Components: PascalCase, named exports from `components/ui/index.ts`

## Development Workflow

### Running the Project

```bash
npm run dev          # Start dev server with Turbopack (port 5023)
npm run build        # Production build
npm run lint         # ESLint check
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Prettier format
npm run type-check   # TypeScript validation
npm run knip         # Find unused exports/dependencies
```

### Environment Setup

1. Copy `.env.example` to `.env.local`
2. Set `NEXT_PUBLIC_API_URL` (backend API base URL, with quotes)
3. Generate `NEXTAUTH_SECRET` via `npx auth secret`

Backend repo: https://github.com/Micro-Roja-E01/Tienda

## UI Components (shadcn/ui)

All components are in `src/components/ui/` with a central `index.ts` export. Common components:

- Forms: Use `react-hook-form` + `zod` + `@hookform/resolvers`
- Data display: `Table`, `Card`, `Badge`, `Skeleton`
- User feedback: `sonner` toast via `toast.error()`, `toast.success()`
- Modals: `AlertDialog`, `Dialog`, `Sheet`

### Layout Components (`src/components/layout/`)

- `Navbar`: Uses `useSession()` for conditional auth UI
- `CartDropdown`: Syncs with `useCartStore()` via custom `useCartDropdown()` hook
- `Footer`: Static component

## Common Pitfalls to Avoid

1. **Never mutate Zustand state directly** - always use provided setters
2. **Don't fetch on server components** - move to client components with React Query hooks
3. **Always validate IDs** - use `isValidId()` from `@/lib/utils` before API calls
4. **Error boundaries** - app has `error.tsx` for runtime errors, `not-found.tsx` for 404s
5. **Dynamic imports for heavy components** - consider for admin features to reduce bundle size

## Admin Features

Admin panel routes (`/admin/*`) for product management:

- `/admin/products` - List all products with toggle availability
- `/admin/new-product` - Create product with image upload (FormData)

Use `useCreateProductMutation()` for product creation with `multipart/form-data`.
