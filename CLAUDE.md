# Project guidance

This is the Luzik driving-school website, built with Next.js 16 App Router, React 19, TypeScript and Tailwind CSS 4. See README.md for the current structure, editing workflow and release requirements.

- Preserve original Polish copy and established styling unless the user requests changes.
- `app/(luzik)/` contains completed offer pages; `components/home/` and `components/site/` contain their views.
- Blog posts use root `/<slug>` URLs. Keep `app/posts/` and `app/pages/` compatibility redirects.
- WordPress data access is in `lib/wordpress.ts`; shared office/course settings use `lib/luzik-settings-server.ts` and its client context.
- Default article cache is one hour; settings cache is 60 seconds. Local `WORDPRESS_CACHE_DISABLED=true` bypasses cache.
- Do not expose `.env.local` or webhook secrets. Local previews must remain unindexed.
- Forms currently prepare a mailto message; do not claim automatic delivery until a backend and SMTP have been connected and verified.
- Keep the WordPress plugins in `wordpress/`; they are not part of the Next.js runtime.
- `pnpm lint`, `pnpm test` and `pnpm build` verify code. `pnpm audit:site` needs a running preview on port 3001; `pnpm audit:settings` uses an isolated fixture on port 3002 after a build.
- Avoid reverting unrelated work or creating commits without user authorization.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
