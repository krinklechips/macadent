# CMS Platform Multi-Tenant Integration Runbook

This runbook documents a recommended setup for running one `cms-platform` instance (hosted on Render) for multiple tenants (for example: `macadent`, `topline`, `kardal`) while keeping:

- separate tenant-branded CMS domains
- separate tenant logins and permissions
- one shared backend/service to maintain

## Recommended Architecture

Use one Render web service for the CMS platform and map multiple custom domains to it.

Examples:

- `cms.macadent.com.my` -> `cms-platform-ap62.onrender.com`
- `cms.topline.example.com` -> `cms-platform-ap62.onrender.com`
- `cms.kardal.example.com` -> `cms-platform-ap62.onrender.com`

### Why this is the right setup

- One codebase + one deployment to maintain
- Each tenant gets a branded login URL
- Tenant access is enforced in the app (not by DNS)
- DNS changes are one-time per tenant domain

## Domain + Login Model (Recommended)

### 1) Keep one operator/admin domain for yourself

Use one internal admin domain for super-admin operations, for example:

- `admin.yourcms.com`

This is where you manage all tenants, users, templates, and platform-wide settings.

### 2) Give each tenant a branded CMS domain

Examples:

- `cms.macadent.com.my`
- `cms.topline...`
- `cms.kardal...`

The same Render service handles all of them.

### 3) Resolve tenant by hostname

When a request comes in, your CMS should determine the tenant from the `Host` header.

Example mapping:

- `cms.macadent.com.my` -> tenant slug `macadent`
- `cms.topline...` -> tenant slug `topline`

Fallback:

- `admin.yourcms.com` -> super-admin workspace (not tenant-scoped)

## Data Model (Suggested)

Minimum tables/entities to scale cleanly:

### `tenants`

- `id`
- `slug` (unique, e.g. `macadent`)
- `name`
- `status` (`active`, `suspended`)
- `created_at`

### `tenant_domains`

- `id`
- `tenant_id`
- `domain` (unique, e.g. `cms.macadent.com.my`)
- `is_primary`
- `verified_at`
- `ssl_status` (optional if tracked)

### `users`

- `id`
- `email` (global unique recommended)
- `password_hash` (or SSO identity reference)
- `status`
- `created_at`

### `tenant_memberships`

- `id`
- `tenant_id`
- `user_id`
- `role` (for example: `owner`, `admin`, `editor`, `viewer`)
- `status`

This is the key table for unique tenant login access.

### `content_slots`

- `id`
- `tenant_id`
- `slot_key` (for example: `macadent-home-updates`)
- `page_key`
- `section_key`
- `title`
- `tabs_json`
- `config_json`
- `published_at`

### `slot_items`

- `id`
- `slot_id`
- `tab_key`
- `type`
- `title`
- `summary`
- `body`
- `image_url`
- `cta_label`
- `cta_url`
- `updated_at`
- `sort_order`
- `is_published`

### `api_tokens` (optional)

- `id`
- `tenant_id` (nullable if platform-wide)
- `name`
- `token_hash`
- `scope` (for example `public-read`)
- `expires_at`

### `audit_logs` (recommended)

- `id`
- `tenant_id`
- `actor_user_id`
- `action`
- `target_type`
- `target_id`
- `payload_json`
- `created_at`

## Access Control Rules (Important)

Enforce tenant isolation in the app for every request:

- tenant admin/editor can only see and edit records for their tenant
- tenant API reads must be filtered by tenant
- super-admin can switch between tenants
- hostname-derived tenant context must be validated against user membership

Example:

- `admin@macadent.com.my` logs in at `cms.macadent.com.my`
- App resolves tenant `macadent`
- User is allowed only if membership exists for tenant `macadent`

## DNS and Render Setup (Per Tenant Domain)

For each tenant-branded CMS domain, do this once.

### Render

1. Open Render service: `cms-platform`
2. Go to `Settings` -> `Custom Domains`
3. Add custom domain (example): `cms.macadent.com.my`

### DNS Panel (for the client domain)

Add a CNAME record:

- `Type`: `CNAME`
- `Name`: `cms`
- `TTL`: default is fine
- `Target/Cname`: `cms-platform-ap62.onrender.com`

Notes:

- Use only the hostname (no `https://`)
- Do not include paths like `/api/health`
- If the panel does not auto-append the domain, use full host `cms.macadent.com.my`

### SSL

- Render should provision SSL automatically after domain verification
- Wait until the custom domain shows as active/verified

## Macadent Frontend Integration (Current Project)

This frontend is already partially wired to your CMS platform and falls back to local content if not configured.

Relevant files:

- `src/lib/cms/providers/platform.ts`
- `src/lib/cms/client.ts`
- `.env.example`

### Frontend environment variables (Macadent site host)

Set these in the Macadent frontend deployment (for example Vercel):

- `VITE_SITE_URL=https://macadent.com.my`
- `VITE_CMS_MODE=auto`
- `VITE_CMS_PLATFORM_BASE_URL=https://cms.macadent.com.my`
- `VITE_CMS_TENANT_SLUG=macadent`
- `VITE_CMS_API_TOKEN=<optional-if-required>`

Use `VITE_CMS_MODE=platform` only after you confirm the CMS endpoint is stable.

## Slot Keys Required for Macadent (Current UI)

Create and publish these slot keys in `cms-platform` for tenant `macadent`:

- `macadent-home-updates`
- `macadent-home-programs`
- `macadent-products-featured`

The frontend expects payloads shaped like:

- `slot` (with `key`, `tabs`, etc.)
- `itemsByTab` (tab -> array of items)

Use local fallback examples as reference in:

- `src/data/cmsFallbackSlots.ts`

## Public API Contract (Expected by Frontend)

Health check:

- `GET /api/health`

Public slot endpoint:

- `GET /api/public/slots/:slotKey?tenantSlug=macadent`

Expected behavior:

- Return `200` with slot payload for published slot
- Return tenant-scoped content only
- Reject or return `404` for unknown slot / wrong tenant

## Step-by-Step Onboarding Checklist (New Tenant)

Use this for future admins or future you.

### Phase 1: Tenant Setup in CMS Platform

1. Create tenant record (slug, name).
2. Create tenant admin user (or invite existing email).
3. Create tenant membership with role `owner` or `admin`.
4. Create required content slots for the tenant.
5. Publish sample content to each slot.

### Phase 2: Domain Setup

1. Add tenant custom domain in Render (for example `cms.macadent.com.my`).
2. Add DNS CNAME at the client domain DNS provider pointing `cms` -> Render hostname.
3. Wait for domain verification + SSL in Render.
4. Test `https://<tenant-cms-domain>/api/health`.

### Phase 3: Frontend Integration

1. Set frontend env vars (`VITE_CMS_PLATFORM_BASE_URL`, tenant slug, mode).
2. Redeploy frontend.
3. Test live pages using CMS slots.
4. Confirm fallback badge changes to platform source (if shown in UI).

### Phase 4: Access Validation

1. Login with tenant admin at branded CMS domain.
2. Confirm user only sees their tenant content.
3. Confirm they cannot access other tenant content by URL tampering.
4. Confirm content publish updates appear on frontend.

## Recommended Tenant Login Policy

Use one of these two models:

### Model A (Recommended): Global identity + tenant memberships

- User email exists once in `users`
- Access to tenants is via `tenant_memberships`
- Best for agencies/operators and shared staff accounts

Pros:

- Clean permission model
- One password per person
- Easy multi-tenant access for internal team

### Model B: Separate account per tenant email (still valid)

- Different user row per tenant/admin email
- Simpler for strict separation

Pros:

- Very easy to explain to clients
- Strong separation by convention

Cons:

- More duplicate accounts to manage

For your use case, use Model A for your internal team and tenant-specific users for client admins.

## Security and Ops Recommendations

- Store tokens hashed, not plaintext
- Rate-limit login and public endpoints
- Add audit logs for publish/delete actions
- Back up tenant content and media metadata
- Restrict CORS to known frontend domains
- Validate `Host` header against `tenant_domains`
- Do not trust `tenantSlug` query param alone for admin operations

## Macadent Quick Start (Concrete Example)

### CMS platform (Render)

- Service URL: `https://cms-platform-ap62.onrender.com`
- Custom domain to add in Render: `cms.macadent.com.my`

### DNS (client panel)

- Type: `CNAME`
- Name: `cms`
- Target: `cms-platform-ap62.onrender.com`

### Frontend env vars (Macadent site)

- `VITE_CMS_PLATFORM_BASE_URL=https://cms.macadent.com.my`
- `VITE_CMS_TENANT_SLUG=macadent`
- `VITE_CMS_MODE=auto`

### Verification URLs

- `https://cms.macadent.com.my/api/health`
- `https://cms.macadent.com.my/api/public/slots/macadent-home-updates?tenantSlug=macadent`

## Troubleshooting

### Domain not working

- Check CNAME target is exactly the Render hostname
- Check Render custom domain is added and verified
- Wait for DNS propagation

### Frontend still showing fallback content

- Confirm frontend env vars are set in production
- Confirm frontend redeployed after env change
- Confirm slot exists and is published for tenant `macadent`
- Check `/api/health` and public slot endpoint manually

### Wrong tenant content appears

- Check hostname -> tenant mapping in `tenant_domains`
- Confirm public endpoint resolves tenant safely
- Confirm slot lookup filters by tenant ID

## Template Copy Block (Use for Any Future Tenant)

Replace values in brackets:

- Tenant slug: `[tenant-slug]`
- CMS domain: `cms.[client-domain]`
- Render target: `cms-platform-ap62.onrender.com`
- Frontend CMS base URL: `https://cms.[client-domain]`
- Required slot keys: `[list slot keys used by that frontend]`

