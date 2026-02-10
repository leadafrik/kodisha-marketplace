# KODISHA MARKETPLACE — SYSTEM PROMPT FOR ENGINEERS

**Use this document as the authoritative guide for all development decisions.**

---

## CORE MISSION

Build **Kodisha** — Kenya's default marketplace where **all rentals happen**. A single, trustworthy, scalable platform for listing and discovering:
- Stays (short-term, long-term, serviced, vacation, rooms)
- Spaces (venues, parking, coworking, studios, storage)
- Sports (fields, courts, equipment, training)
- Equipment (cameras, audio, tools, vehicles, party gear)

**Non-negotiable**: Premium, trustworthy, Kenya-first, scalable, clean code, future-proof.

---

## ARCHITECTURAL PRINCIPLES

### 1. Type-First Design
- All entities are strongly typed (TypeScript strict mode)
- No `any` types anywhere
- Types are the single source of truth for data shape

### 2. Service Layer Separates Logic
- Business logic lives in `src/services/`
- Routes are thin (receive request, call service, return response)
- Services are testable and reusable

### 3. Feature Flags for Phased Rollout
- Payments (M-Pesa): `PAYMENTS_ENABLED=false` (ready when flag on)
- Reviews: `REVIEWS_ENABLED=false` (ready when flag on)
- New features: always behind a flag until fully tested

### 4. Kenya-First Everything
- All 47 counties + 290 wards pre-loaded
- Phone numbers formatted: `+254700000000`
- Currency: Kenya Shilling (KES)
- Dates: dd/mm/yyyy (locally appropriate)

### 5. Trust by Design, Not by Gate-Keeping
- Anyone can list (no gate, just label as "Unverified")
- Verification is progressive (email → phone → ID → business)
- Trust score is transparent and earned

### 6. Extensible Categories
- Add categories without code changes
- Each category has specific required fields
- Category logic is config-driven, not hardcoded

### 7. SEO as Infrastructure
- Every listing gets an SEO-optimized page
- County pages are auto-generated
- Category+county combinations get dedicated pages
- Structured data (schema.org) is built-in

### 8. Payments are Architectural, Not Bolted On
- Payment tables exist now
- M-Pesa provider is scaffolded
- When `PAYMENTS_ENABLED=true`, no code refactoring needed
- Escrow, wallets, transactions all pre-designed

### 9. Admin Moderation is Non-Negotiable
- Every action by admins is logged (timestamp, admin ID, action, entity)
- Listings are reviewed before going live (optional, configurable)
- Flagged content goes to a queue, not auto-removed
- Users can be suspended, but suspension is reversible

### 10. Messaging is Core, Not Optional
- Real-time messaging between users (host ↔ guest)
- Scalable (Supabase Realtime for foundation)
- Rate-limited (30 messages per minute)
- Safety warnings for unverified users
- Conversation history saved

---

## FOLDER STRUCTURE & RESPONSIBILITIES

```
src/
├── app/                          # Next.js App Router (routes & pages)
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── reset-password/page.tsx
│   ├── (marketplace)/            # Main marketplace routes
│   │   ├── home/page.tsx
│   │   ├── browse/page.tsx
│   │   ├── [category]/page.tsx
│   │   ├── listing/[id]/page.tsx
│   │   ├── listing/create/page.tsx
│   │   └── host/dashboard/page.tsx
│   ├── admin/                    # Admin routes (protected)
│   │   ├── dashboard/page.tsx
│   │   ├── moderation/page.tsx
│   │   └── users/page.tsx
│   ├── api/                      # API routes (Next.js serverless)
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── listings/             # Listing CRUD
│   │   ├── messages/             # Messaging
│   │   ├── admin/                # Admin actions
│   │   └── health/route.ts       # Health check
│   ├── kenya/[county]/page.tsx   # SEO county pages
│   └── layout.tsx                # Root layout
│
├── components/                   # React components (presentational)
│   ├── ui/                       # shadcn/ui components (import, don't modify)
│   ├── forms/                    # Form components (inputs, validation UI)
│   ├── listings/                 # Listing-specific (cards, detail, form)
│   ├── messaging/                # Messaging UI (chat window, message list)
│   ├── admin/                    # Admin-specific (tables, moderation)
│   └── shared/                   # Shared (nav, footer, layout)
│
├── data/                         # Configuration & static data
│   ├── categories.ts             # Category configuration (required fields, names)
│   ├── kenyaCounties.ts          # Kenya counties/wards (canonical source)
│   └── schema.sql                # Database schema (reference)
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts                # Auth context, login/logout
│   ├── useListings.ts            # Fetch, search, filter listings
│   ├── useMessages.ts            # Realtime messaging subscription
│   └── useUser.ts                # Current user profile
│
├── lib/                          # Core utilities (no React)
│   ├── supabase.ts               # Supabase client instances
│   ├── api-utils.ts              # API response formatters, pagination
│   └── validators.ts             # Input validation (Zod schemas)
│
├── services/                     # Business logic (pure functions, testable)
│   ├── listings.service.ts       # Listing validation, search, scoring
│   ├── users.service.ts          # User profile, verification logic
│   ├── messages.service.ts       # Messaging logic, rate limiting
│   └── admin.service.ts          # Admin actions, moderation
│
├── types/                        # TypeScript type definitions
│   └── index.ts                  # All types (NEVER use `any`)
│
└── utils/                        # Helper functions (formatting, validation)
    └── helpers.ts                # formatCurrency, formatDate, etc.
```

**Rule**: If it has business logic, it goes in `services/`. If it's presentational, it goes in `components/`. If it's utility, it goes in `utils/` or `lib/`.

---

## DATA MODEL PRINCIPLES

### Users
- Default: **Unverified** (email only)
- Progressive: phone → ID → business verification
- Every user has a **trust score** (0-1)
- Every user has activity signals (listings count, reviews count)

### Listings
- Every listing is **tied to exactly one category**
- Every listing has a **completeness score** (0-100%)
- Completeness is category-aware (Stays require different fields than Equipment)
- Listings are **location-anchored** (county → optionally ward)
- Listings can be featured (admin only)
- Listings can be flagged for review

### Verification
- **Unverified**: Email only
- **Email Verified**: Email confirmed
- **Phone Verified**: SMS confirmation
- **ID Verified**: Government ID uploaded (future)
- **Business Verified**: Legal entity verified (future)

### Trust Signals (Calculated, Not Manual)
- Verification level (higher = more trustworthy)
- Listings count (active, published)
- Reviews/rating (future)
- Account age (days since signup)
- Rapid listing patterns (fraud alert)

### Completeness Score (Category-Specific)
- 0-30%: Incomplete (red, needs work)
- 30-60%: In Progress (yellow, making progress)
- 60-90%: Almost Ready (blue, nearly publishable)
- 90-100%: Complete (green, ready to publish)

**Example**: A "Stays" listing requires `title`, `description`, `price`, `county`, `images`, `amenities`, `rules`. An "Equipment" listing doesn't need `amenities` or `rules`.

### Categories & Subcategories
- Categories are **top-level navigation** (Stays, Spaces, Sports, Equipment)
- Subcategories are **specific types** (e.g., Stays → Short-Term vs Long-Term)
- Each category has **required fields** (configured in `src/data/categories.ts`)
- Each category has **minimum price** (e.g., Equipment ≥ 100 KES, Spaces ≥ 500 KES)
- Each category has **required image count** (e.g., Stays ≥ 3, Equipment ≥ 2)

### Search & Filters
- Filter by: category, subcategory, county, price range, verification
- Sort by: recent, popular, price (asc/desc), rating
- Full-text search on title + description
- Results are paginated (default 20 per page)

---

## IMPLEMENTATION CHECKLIST

### Never Do This
❌ Use `any` types  
❌ Mix business logic in components  
❌ Hardcode strings (use enums)  
❌ Skip type definitions  
❌ Create duplicate functions  
❌ Put API calls directly in components  
❌ Ignore error handling  
❌ Skip input validation  

### Always Do This
✅ Use TypeScript strict mode  
✅ Put business logic in services  
✅ Use enums for constants  
✅ Define types first  
✅ Reuse service functions  
✅ Use hooks for data fetching  
✅ Handle errors explicitly  
✅ Validate all inputs  

---

## FILE NAMING CONVENTIONS

| Type | Convention | Example |
|------|-----------|---------|
| Component | PascalCase | `ListingCard.tsx`, `MessageInput.tsx` |
| Service | camelCase + `.service.ts` | `listings.service.ts`, `users.service.ts` |
| Hook | camelCase + `use` prefix | `useAuth.ts`, `useListings.ts` |
| Utility | camelCase | `helpers.ts`, `validators.ts` |
| Type file | match type name | `user.ts` for `User` type |
| Enum | PascalCase | `VerificationStatus`, `ListingStatus` |
| API route | match endpoint | `/api/listings` → `listings/route.ts` |

---

## CODE STYLE

### Component Structure
```tsx
// 1. Imports (React first, then external, then local)
import { FC } from 'react';
import { cn } from '@/utils/helpers';
import { Listing } from '@/types';

// 2. Types/Interfaces
interface Props {
  listing: Listing;
  onMessage: () => void;
}

// 3. Component
const ListingCard: FC<Props> = ({ listing, onMessage }) => {
  return <div>{listing.title}</div>;
};

// 4. Export
export default ListingCard;
```

### Service Function Structure
```ts
/**
 * Validate listing data before creation
 * @param data Raw listing data
 * @param category Which category (affects required fields)
 * @returns Validation result with errors if invalid
 */
export function validateListingData(
  data: Record<string, any>,
  category: MainCategory
): { valid: boolean; errors: string[] } {
  // Implementation
}
```

### API Route Structure
```ts
// GET: List items
// POST: Create item
export async function GET(request: NextRequest) {
  try {
    // 1. Extract & validate params
    // 2. Call service
    // 3. Return response
    return successResponse(data);
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}
```

---

## TESTING THE BUILD

Always run before committing:
```bash
npm run build        # TypeScript + Next.js build
npm run lint         # ESLint
npm run dev          # Local dev server
```

---

## FEATURE FLAGS

```env
# Enable/disable payment processing
NEXT_PUBLIC_PAYMENTS_ENABLED=false

# Enable/disable reviews
NEXT_PUBLIC_REVIEWS_ENABLED=false

# More flags can be added as needed
NEXT_PUBLIC_VERIFY_LISTINGS_ON_CREATION=false
```

Check flags like this:
```ts
if (process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === 'true') {
  // Show payment option
}
```

---

## WHAT "READY TO SHIP" MEANS

✅ All TypeScript compiles with zero errors  
✅ All types are strict (no `any`)  
✅ All business logic is in services  
✅ All routes are typed  
✅ All database tables are indexed  
✅ All error cases are handled  
✅ All inputs are validated  
✅ All user-facing strings are labeled  
✅ All admin actions are logged  
✅ Dev server runs without warnings  

---

## DECISION TREE

**Should this be a component?**
- If it's visual/interactive → YES

**Should this be a service?**
- If it has business logic → YES

**Should this be a hook?**
- If it's data fetching/state → YES

**Should this be a utility?**
- If it's a pure function (no state) → YES

**Should this be in the database?**
- If it needs to persist or be queried → YES

**Should this be feature-flagged?**
- If it's rolling out gradually → YES

---

## GUARDRAILS

If you ever think:
- "I'll just add a tiny bit of logic to this component" → Move it to a service
- "I'll use `any` just for now" → Define the type properly
- "I'll hardcode this string" → Create an enum
- "This function belongs in multiple places" → Move it to utils
- "I'll skip validation on this input" → Always validate

---

## THE MOST IMPORTANT RULE

**Every decision should pass this test:**
> "If I showed this code to a senior engineer from a billion-shilling company, would they approve?"

If the answer is no, refactor.

---

**Status**: This specification is the north star for all development.  
**Use it**: Before writing code, check if the spec covers it.  
**Question it**: If spec is unclear, ask before implementing.  
**Follow it**: No departures without discussion.

**Next**: Which phase should we implement first?
