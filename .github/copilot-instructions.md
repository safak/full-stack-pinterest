# AI Coding Instructions: Full-Stack Pinterest Clone

## Project Architecture

This is a **full-stack Pinterest clone** with a clean separation between frontend (React) and backend (Express).

### Tech Stack
- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS 4 + Tanstack Query
- **Backend**: Express 5 + TypeScript + MongoDB (Mongoose)
- **Media**: ImageKit for image hosting and optimization
- **Package Manager**: pnpm (workspace-based monorepo)

### Directory Structure
```
backend/          # Express API server
  controllers/    # Route handlers (auth, pin, board, comment, user)
  models/         # Mongoose schemas
  routes/         # Express route definitions
  db/             # MongoDB connection logic
  utils/          # Utilities like seed data
client/           # React SPA
  src/
    api/          # Axios client + API endpoints
    components/   # UI components (shadcn/ui based)
    hooks/        # React Query hooks (queries/ and mutations/)
    routes/       # Page components (homePage, postPage, etc.)
    types/        # TypeScript types (domain/ and api/)
    lib/          # Utilities (auth-store, utils)
```

## Key Architecture Patterns

### 1. Data Fetching with Tanstack Query
- **ALL data fetching uses React Query** - no direct API calls in components
- Custom hooks pattern: `useGet[Resource]` for queries, mutations in `mutations/` folder
- Location: `client/src/hooks/queries/` and `client/src/hooks/mutations/`
- Example: `useGetAllPins()` with infinite scroll pagination using `useInfiniteQuery`

```typescript
// Pattern for queries
export const useGetAllPins = (params?: { search?: string, userId?: string }) => {
  return useInfiniteQuery({
    queryKey: ["pins", userId],
    queryFn: ({ pageParam = 0 }) => getAllPins({ pageParam, search, userId }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: any) => lastPage.nextCursor,
  });
};
```

### 2. API Layer Organization
- **Centralized Axios instance** at `client/src/api/axios.ts` with interceptors
- Custom `X-Request-ID` header added to all requests (using `crypto.randomUUID()`)
- API endpoints organized by resource in `client/src/api/endpoints/` (e.g., `pin.api.ts`, `board.api.ts`)
- Response interceptor unwraps `.data` automatically
- Error handling via `handleApiError()` from `error-handler.ts`

### 3. Image Handling with ImageKit
- Images served via ImageKit CDN for optimization
- Custom `<Image>` component wrapper at `client/src/components/image/Image.tsx`
- Uses `@imagekit/react` with transformations (width-based resizing)
- Environment variable: `VITE_IK_IMAGEKIT_URL`

### 4. Type System
- **Shared type definitions** in `client/src/types/`
- Separated into `domain/` (business entities like Pin, User, Board) and `api/` (API responses/errors)
- All types exported through `types/index.ts` barrel file
- Backend models DON'T share types directly - client defines its own

### 5. Backend Architecture
- **No authentication middleware currently** (commented out in `axios.ts` and backend)
- RESTful API structure: `/users`, `/pins`, `/comments`, `/boards`
- Controllers return consistent format: `{ message, data, nextCursor? }`
- Pagination: cursor-based with `LIMIT = 21`, returns `nextCursor` when `hasNextPage`

### 6. Routing & Layouts
- React Router v7 with nested routes
- Layout components: `MainLayout` (authenticated) and `AuthLayout`
- Routes: `/` (home), `/create`, `/pin/:id`, `/user/:id`, `/auth`

### 7. State Management
- **No Redux/Zustand** - React Query handles server state
- Local state: `auth-store.ts` for in-memory token management (simple module pattern)
- Auth token stored in memory (NOT localStorage) - functions: `setAccessToken()`, `getAccessToken()`, `clearAccessToken()`

### 8. UI Components
- **shadcn/ui** components in `client/src/components/ui/`
- Custom components follow feature-based naming (e.g., `galleryItem/`, `pinCreationForm/`)
- CSS modules for some components (e.g., `BoardItem.css`, `GalleryItem.css`)

## Development Workflows

### Running the Project
```bash
# Backend (from backend/)
pnpm dev              # Uses node --watch with .env file

# Frontend (from client/)
pnpm dev              # Vite dev server
pnpm build            # TypeScript check + Vite build
pnpm lint             # ESLint
```

### Environment Variables
Backend requires `.env` with:
- `MONGO_DB_URI` - MongoDB connection string
- `CLIENT_URL` - Frontend URL for CORS
- `PORT` - API server port (default: 3000)

Client requires `.env` with:
- `VITE_API_BASE_URL` - Backend API URL
- `VITE_IK_IMAGEKIT_URL` - ImageKit URL endpoint

### Key Conventions
1. **Import aliasing**: Use `@/` for `client/src/` (configured in `vite.config.ts`)
2. **File extensions**: Always use `.ts` or `.tsx` in imports (required for Node ES modules in backend)
3. **Package manager**: ONLY use `pnpm` - project has pnpm lock files
4. **React Compiler**: Enabled via Babel plugin - avoid manual memoization unless necessary
5. **Type imports**: Use `import type` for type-only imports

### Common Patterns to Follow
- When creating new API endpoints, add them to `client/src/api/endpoints/[resource].api.ts`
- When adding queries, create hook in `client/src/hooks/queries/[resource].queries.ts`
- When adding mutations, create hook in `client/src/hooks/mutations/[resource].mutations.ts`
- Backend controllers should populate related data: `.populate("user", "username img displayName")`
- Gallery components use `react-infinite-scroll-component` for infinite scrolling

### Testing & Debugging
- Backend uses `node --watch` for auto-reload
- Frontend uses Vite HMR
- No test suite currently configured
- CORS configured permissively (`origin: true`) for development

## Important Notes
- **Auth is partially implemented** - token logic exists but isn't enforced
- Backend responses wrap data in `{ message, data }` format
- Pagination uses cursor-based approach (page numbers as cursors)
- MongoDB ObjectIds referenced as `Schema.Types.ObjectId` in models
- Frontend uses `timeago.js` for relative timestamps
- Emoji picker via `emoji-picker-react` package
