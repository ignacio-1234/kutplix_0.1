# CLAUDE.md - Kutplix Codebase Guide

## Project Overview

Kutplix is a digital content management platform built with Next.js 14 (App Router). It connects clients who need digital content (social media posts, reels, stories, carousels) with designers who produce it, managed by administrators. The platform handles the full lifecycle: project requests, designer assignment, delivery, revision, and approval.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Database/Storage:** Supabase (PostgreSQL + file storage)
- **Authentication:** Custom JWT sessions via `jose` + HTTP-only cookies
- **Styling:** Tailwind CSS 3.4 with custom theme
- **Validation:** Zod schemas in API routes
- **Password Hashing:** bcryptjs (10 salt rounds)
- **Fonts:** DM Sans (body), Sora (display headings)
- **Icons:** Native emojis (lucide-react installed but minimally used)
- **Utilities:** clsx + tailwind-merge for class name composition

## Quick Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Run production build
npm run lint     # ESLint
```

## Project Structure

```
kutplix_0.1/
├── app/                          # Next.js App Router pages & API
│   ├── layout.tsx                # Root layout (AuthProvider, fonts)
│   ├── page.tsx                  # Landing page
│   ├── globals.css               # Global styles + Tailwind component classes
│   ├── login/page.tsx            # Login/Register dual-mode page
│   ├── api/                      # API routes (REST endpoints)
│   │   ├── auth/                 # Authentication (login, register, logout, session)
│   │   ├── projects/             # Project CRUD + [id] routes
│   │   ├── plans/                # Plan listing and editing
│   │   ├── notifications/        # Notification creation
│   │   ├── deliveries/           # Designer delivery submissions
│   │   ├── client/               # Client-specific (stats, reports, resources, upload)
│   │   ├── designer/             # Designer-specific (portfolio, resources, metrics)
│   │   ├── admin/                # Admin (users CRUD, companies, designers)
│   │   └── debug/                # Debug endpoints
│   └── dashboard/                # Role-based dashboard pages
│       ├── cliente/              # Client pages (7 pages)
│       ├── disenador/            # Designer pages (8 pages)
│       └── admin/                # Admin pages (10 pages, has own layout.tsx)
├── components/                   # Shared React components
│   ├── Sidebar.tsx               # Role-aware navigation sidebar
│   ├── PlansSection.tsx          # Public plans display
│   └── AdminPlansEditor.tsx      # Admin plan editor
├── lib/                          # Shared utilities
│   ├── session.ts                # JWT session create/verify/delete/update
│   ├── auth-context.tsx          # AuthProvider React Context
│   ├── supabase.ts               # Supabase client singleton
│   └── utils.ts                  # cn() helper (clsx + tailwind-merge)
├── types/
│   └── database.ts               # All TypeScript type definitions
├── database/
│   └── migrations/               # SQL migration files
├── scripts/                      # Utility scripts (verify_data, assign_projects)
├── middleware.ts                  # Auth routing + role enforcement
├── tailwind.config.ts            # Custom colors, fonts
└── .env.local.example            # Required environment variables
```

## Environment Variables

Required in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
JWT_SECRET=<secret-for-jwt-signing>
NODE_ENV=development
```

## Architecture & Key Patterns

### Authentication Flow

1. **Login/Register** -> API route validates with Zod -> queries Supabase -> creates JWT cookie via `jose`
2. **Middleware** (`middleware.ts`) runs on every non-API/static request:
   - Unauthenticated users accessing `/dashboard/*` are redirected to `/login`
   - Authenticated users accessing `/login` are redirected to their role dashboard
   - Users are confined to their role's dashboard path (e.g., clients cannot access `/dashboard/admin`)
3. **Session** lasts 7 days, stored as HTTP-only cookie named `session`
4. **AuthProvider** (`lib/auth-context.tsx`) wraps the app, provides `user`, `company`, `designer`, `subscription`, `login()`, `register()`, `logout()`, `refreshUser()`

### API Route Authorization Pattern

Every protected API route follows this pattern:

```typescript
const session = await verifySession()
if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
// Check session.role for authorization
// Load related entity (company/designer) from Supabase
// Verify ownership/access before executing operation
```

### User Roles & Dashboard Routing

| Role | Dashboard Path | DB Relationships |
|------|---------------|-----------------|
| `client` | `/dashboard/cliente` | Has `company` record, `subscription` with `plan` |
| `designer` | `/dashboard/disenador` | Has `designer` record with specialties, rating |
| `admin` | `/dashboard/admin` | Full access to all data |

### Project Status Workflow

```
pending -> in_progress -> in_review -> approved
                            |
                            v
                     changes_requested -> in_review (revision_count incremented)

Any status -> cancelled
```

### Data Fetching Pattern

- Dashboard pages use `useState` + `useEffect` with `fetch()` to API routes
- Multiple parallel fetches via `Promise.all()`
- Loading states with skeleton cards or spinners
- Error handling with try-catch and fallback UI

### Supabase Integration

- Client initialized in `lib/supabase.ts` as singleton using `createClient()`
- All database queries go through Supabase client in API routes (server-side)
- File uploads use Supabase Storage (`resources` bucket)
- No Supabase Row Level Security (RLS) relied upon; access control is in API routes

## Database Schema (Key Tables)

- **users**: id, email, password_hash, first_name, last_name, role (`admin`|`client`|`designer`), is_active
- **companies**: id, user_id (FK), name, industry, brand_colors, website, phone
- **designers**: id, user_id (FK), specialties[], max_concurrent_projects, rating
- **projects**: id, company_id (FK), designer_id (FK), title, description, content_type, priority, status, deadline, revision_count
- **plans**: id, name, description, monthly_projects, max_revisions, price, features (JSONB), is_active
- **subscriptions**: id, company_id (FK), plan_id (FK), status, projects_used, auto_renew
- **resources**: id, project_id (FK), uploaded_by (FK), file_name, file_url, file_size, category (`input`|`output`|`reference`)
- **deliveries**: id, project_id (FK), designer_id (FK), version, notes, files (JSONB)
- **reviews**: id, delivery_id (FK), reviewed_by (FK), status, comments
- **notifications**: id, user_id (FK), title, message, type, is_read

All types are defined in `types/database.ts`.

## Naming Conventions

- **Database columns**: `snake_case` (e.g., `first_name`, `company_id`, `revision_count`)
- **TypeScript variables/functions**: `camelCase`
- **React components & TypeScript types**: `PascalCase`
- **Files**: lowercase for utilities (`session.ts`, `utils.ts`), PascalCase for components (`Sidebar.tsx`)
- **API routes**: lowercase with hyphens for path segments, `route.ts` file name
- **UI text & error messages**: Spanish (the app's user-facing language)

## Styling Conventions

### Tailwind Custom Theme

```
Primary:   #2E75B6 (corporate blue), dark: #235a8c, light: #D5E8F0
Success:   #4CAF50 (green)
Warning:   #FF9800 (orange)
Danger:    #f44336 (red)
Neutral:   light #F5F5F5, dark #333333
```

### Reusable CSS Classes (defined in `globals.css`)

- `.btn-primary` / `.btn-secondary` - Button styles
- `.card` - Card wrapper with shadow and rounded corners
- `.input` - Form input styling
- Custom animations: `fadeIn`, `slideUp`, `fadeInLeft`, `pulse-slow`

### Font Usage

- Body text: `font-sans` (DM Sans)
- Headings/display: `font-display` (Sora)

## Key Conventions for AI Assistants

1. **Always verify session** in API routes before any data operation. Use `verifySession()` from `@/lib/session`.
2. **Respect role-based access**: Filter data by the user's company/designer association. Never expose cross-tenant data.
3. **Use Zod** for input validation in API routes.
4. **Return Spanish error messages** in API responses (e.g., `"No autorizado"`, `"Proyecto no encontrado"`).
5. **Use `@/` path alias** for imports (maps to project root per `tsconfig.json`).
6. **Follow the existing Supabase query pattern**: Use `supabase.from('table').select()` / `.insert()` / `.update()` in API routes only (never in client components directly).
7. **New pages** go under the appropriate `app/dashboard/[role]/` directory.
8. **New API routes** follow REST conventions under `app/api/`.
9. **New shared components** go in `components/`.
10. **New types** should be added to `types/database.ts`.
11. **CSS**: Use Tailwind utilities inline. Add reusable component classes to `globals.css` only when truly shared.
12. **No ORM**: Direct Supabase client queries (no Prisma or similar).
13. **Content types** are: `static`, `reel`, `story`, `carousel`.
14. **Priority levels** are: `low`, `medium`, `high`, `urgent`.
15. **The Sidebar component** (`components/Sidebar.tsx`) must be updated when adding new dashboard pages.
