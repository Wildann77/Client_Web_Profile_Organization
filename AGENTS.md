# Agent Guidelines for WebProfileMuhammadiyah Client

## Project Overview
React + TypeScript + Vite web application for Muhammadiyah organization profile.
Uses shadcn/ui components, Tailwind CSS v4, TanStack Query, Zustand, and React Router.

## Build Commands

```bash
# Development server (port 5173)
npm run dev

# Production build
npm run build

# Lint with ESLint
npm run lint

# Preview production build
npm run preview
```

## Code Style Guidelines

### TypeScript
- Target: ES2022, strict mode enabled
- All components must be typed; use explicit return types for hooks
- Path alias `@/` maps to `./src/`
- Prefer `type` imports: `import type { Foo } from '...'`
- No unused locals or parameters (compiler enforced)

### Imports (Ordered)
1. React imports
2. Third-party libraries (grouped)
3. Absolute imports (`@/components`, `@/lib`, etc.)
4. Relative imports
5. Type-only imports last

### Component Patterns
```typescript
// Use function declarations for components
function ComponentName({ prop1, prop2 }: Props) {
  return <div>...</div>
}

// Export at bottom
export { ComponentName }

// For components with variants, use cva from class-variance-authority
const componentVariants = cva("base-classes", {
  variants: { variant: { default: "..." } },
  defaultVariants: { variant: "default" }
})
```

### Naming Conventions
- Components: PascalCase (`Button.tsx`, `ArticleCard.tsx`)
- Hooks: camelCase with `use` prefix (`useAuth.ts`, `useArticles.ts`)
- Stores: camelCase with `Store` suffix (`authStore.ts`)
- Types/Interfaces: PascalCase (`User`, `ArticleStatus`)
- Enum-like unions: PascalCase (`type ArticleStatus = 'DRAFT' | 'PUBLISHED'`)
- API functions: Group in `api/index.ts`, export as object

### File Structure
```
src/
  components/
    ui/          # shadcn/ui components (don't modify)
    editor/      # Tiptap editor components
    layout/      # Reusable layout components (Header, Footer, PublicLayout)
  features/
    {feature}/
      api/       # API functions
      components/# Feature-specific components
      hooks/     # Feature-specific hooks
      schemas/   # Zod validation schemas
      stores/    # Zustand stores
  hooks/         # Global hooks
  lib/           # Utilities (cn function)
  pages/         # Route components
    public/      # Public-facing pages
      profile/   # Organization profile pages (Visi-Misi, Sejarah, etc.)
    admin/       # Admin dashboard pages
  shared/
    components/  # Shared components (ErrorBoundary)
    lib/         # Shared utilities (api.ts)
    types/       # Global TypeScript types
```

### Styling (Tailwind CSS v4)
- Dark Mode: Uses `ThemeProvider` with `localStorage` persistence
- Theme Variables: Defined in `index.css` using `oklch`
- Color Tokens: Use semantic tokens instead of static colors:
  - `bg-background`, `bg-card`, `bg-muted`, `bg-accent`
  - `text-foreground`, `text-muted-foreground`, `text-primary`
  - `border`, `input`, `ring`
- Utility classes with `cn()` from `@/shared/lib/utils` for conditional classes
- Follow shadcn patterns: `data-slot` attributes, semantic color tokens

### State Management
- **Global state**: Zustand with persistence middleware when needed
- **Server state**: TanStack Query (React Query)
- **Form state**: React Hook Form + Zod validation

### Error Handling
- API errors: Throw in API layer, catch in hooks/components
- Use `sonner` for toast notifications
- Form validation errors: Display inline with field messages
- **Global Errors**: Wrapped with `ErrorBoundary` in `main.tsx`. Custom fallback can be provided via `fallback` prop.

### Loading Patterns
- **Standard**: Use Skeleton components instead of spinners for a "premium" feel.
- **Location**: Feature-specific skeletons go in `features/{feature}/components/` (e.g., `ArticleListSkeleton`).
- **Implementation**: Check `isLoading` from TanStack Query and render the skeleton.

### API Pattern
```typescript
// In feature/api/index.ts
import { get, post, patch, del } from '@/shared/lib/api';

export const featureApi = {
  getAll: () => get<Item[]>('/endpoint'),
  create: (data: CreateDto) => post<Item>('/endpoint', data),
  update: (id: string, data: UpdateDto) => patch<Item>(`/endpoint/${id}`, data),
  delete: (id: string) => del<void>(`/endpoint/${id}`),
};
```

### React Query Pattern
```typescript
export const useItems = () => {
  return useQuery({
    queryKey: ['items'],
    queryFn: featureApi.getAll,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: featureApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};
```

### Layout Patterns
- **Public Layout**: All public-facing pages must be wrapped with `PublicLayout` in `App.tsx`.
- **Reusable Components**: Layout-related components like `Header` and `Footer` must reside in `src/components/layout/`.
- **Admin Layout**: Admin pages use `AdminLayout` from `features/admin/components/`.
- **Dynamic Data**: `Header` and `Footer` MUST NOT hardcode site identity, contact, or social media info. Always use `useSetting(key)` from `@/features/settings/hooks/useSettings`.

```typescript
// App.tsx routing pattern
<Route element={<PublicLayout />}>
  <Route path="/" element={<HomePage />} />
  <Route path="/artikel" element={<ArticlesPage />} />
  <Route path="/profil/visi-misi" element={<VisionMissionPage />} />
  <Route path="/profil/sejarah" element={<HistoryPage />} />
</Route>
```

### Settings Pattern
- **Public data** (site name, contact, social): use `useSetting(key)` or `usePublicSettings()` — hits `/api/v1/settings/public`.
- **Admin data** (all settings): use `useAdminSettings()` — hits `/api/v1/settings` (requires ADMIN role).
- **Mutations**: use `useUpdateBulkSettings()` for saving multiple fields at once.
- **Cache invalidation**: mutations automatically invalidate both admin and public query keys.
- **Fallback**: always provide a sensible fallback string when using `useSetting()`.

### Users Management Pattern
- **Access**: Only for `ADMIN` role. Route: `/admin/pengguna`. 
- **Toggling Status**: Use `useToggleUserStatus` mutation hook for `isActive` toggle.
- **Form Handling**: Use `UserForm` which integrates with `react-hook-form` and `zod`.
- **Cache**: Admin user list uses the query key `['admin', 'users']`. Mutations invalidate this key.

```typescript
import { useSetting } from '@/features/settings/hooks/useSettings';

// In any component
const siteName = useSetting('site_name');    // string, '' if not set
const email    = useSetting('contact_email');
const display  = siteName || 'Organisasi Kami'; // always provide fallback
```

### Form Pattern
- **Schema Location**: All Zod schemas must be placed in `features/{feature}/schemas/`.
- **Validation**: Use React Hook Form + @hookform/resolvers/zod.

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { itemSchema, type ItemFormData } from '../schemas/itemSchema';

const form = useForm<ItemFormData>({
  resolver: zodResolver(itemSchema),
  defaultValues: { ... },
});
```

### Common Libraries
- UI: `@radix-ui/*`, `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`
- Forms: `react-hook-form`, `@hookform/resolvers`, `zod`
- Data: `@tanstack/react-query`, `axios`
- State: `zustand`
- Editor: `@tiptap/react`, `@tiptap/starter-kit`
- Date: `date-fns`

### Environment Variables
- `VITE_API_URL` - Backend API base URL (defaults to `http://localhost:3000/api/v1`)
- Access via `import.meta.env.VITE_*`

### Important Notes
- This is a **client-side only** React app (not RSC)
- Authentication uses JWT stored in localStorage + HttpOnly Refresh Token in cookies
- Proxy configured in `vite.config.ts` for local development
- Uses React 19 with StrictMode
- All shadcn/ui components are in `@/components/ui` - don't modify, extend via wrapper components

## Deployment (Vercel)

### Strategy: Vercel Rewrites
To solve CORS and Cookie issues without a custom domain, we use Vercel Rewrites. The frontend project handles the routing.

1. **Backend Deployment**:
   - Deploy as a separate project.
   - Use `vercel.json` with `@vercel/node` builder.
   - Entry point: `api/index.ts` (registers `module-alias` and `tsconfig-paths`).
   - `package.json` must have `"postinstall": "prisma generate"`.

2. **Frontend Deployment**:
   - Deploy as a separate project.
   - Use `vercel.json` to rewrite `/api/:path*` to the Vercel backend URL.
   - Set SPA routing: rewrite all other paths to `/index.html`.

### Environment Variables
**Backend**:
- `DATABASE_URL`: Neon PostgreSQL connection string.
- `JWT_SECRET`: Secret key for token signing.
- `FRONTEND_URL`: URL of the deployed frontend (for CORS).
- `CLOUDINARY_*`: Credentials for image uploads.

**Frontend**:
- No `VITE_API_URL` needed in production if using rewrites (requests go to `/api/v1`).
