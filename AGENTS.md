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
  features/
    {feature}/
      api/       # API functions
      components/# Feature-specific components
      hooks/     # Feature-specific hooks
      stores/    # Zustand stores
  hooks/         # Global hooks
  lib/           # Utilities (cn function)
  pages/         # Route components
    public/      # Public-facing pages
    admin/       # Admin dashboard pages
  shared/
    lib/         # Shared utilities (api.ts)
    types/       # Global TypeScript types
```

### Styling (Tailwind CSS v4)
- Use `@theme` for CSS variables in `index.css`
- Utility classes with `cn()` from `@/lib/utils` for conditional classes
- Follow shadcn patterns: `data-slot` attributes, semantic color tokens
- Custom animations defined in `tailwind.config.js`

### State Management
- **Global state**: Zustand with persistence middleware when needed
- **Server state**: TanStack Query (React Query)
- **Form state**: React Hook Form + Zod validation

### Error Handling
- API errors: Throw in API layer, catch in hooks/components
- Use `sonner` for toast notifications
- Form validation errors: Display inline with field messages

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

### Form Pattern
```typescript
const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: { ... },
});

// Use shadcn Form, FormField, FormItem components
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
- Authentication uses JWT stored in localStorage + HttpOnly cookies
- Proxy configured in `vite.config.ts` for `/api` to `localhost:3000`
- Uses React 19 with StrictMode
- All shadcn/ui components are in `@/components/ui` - don't modify, extend via wrapper components
