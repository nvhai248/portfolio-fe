# Phase 1 Stabilize Report

## Summary
- Status: **PASS**
- Scope done: regression checklist routes, harden theme flow, responsive stabilization nhẹ ở header, smoke test automation + validation runs.

## Changes implemented

### Theme hardening
1. `src/lib/stores/theme.svelte.ts`
   - Bổ sung guard đọc/ghi `localStorage` bằng `try/catch` để tránh lỗi môi trường hạn chế storage.
   - Tách key `THEME_STORAGE_KEY`.
   - Theo dõi `prefers-color-scheme` khi **không có saved preference** để fallback system preference nhất quán.
   - Tránh persist dư thừa khi init.
2. `src/app.html`
   - Script bootstrap theme an toàn hơn (try/catch).
   - Đồng bộ explicit add/remove class `dark` để giảm sai trạng thái ban đầu.

### Route resilience
3. `src/routes/+page.server.ts`
   - Bọc fetch Sanity trong `try/catch`.
   - Fallback `{ posts: [], settings: null }` nếu fetch lỗi để route `/` không fail hard.

### Responsive consistency
4. `src/lib/components/layout/Header.svelte`
   - Cải thiện hành vi trên màn nhỏ: `min-w-0`, `truncate` cho tên, ẩn subtitle dưới 420px.
   - Thêm `data-testid="theme-toggle"` phục vụ smoke test.
5. `src/routes/+layout.svelte`
   - Thêm `data-testid="main-content"`.
6. `src/lib/components/layout/Footer.svelte`
   - Thêm `data-testid="site-footer"`.

### Smoke test automation
7. `playwright.config.ts`
   - Cấu hình Playwright smoke chạy với web server local (`vite dev`), Chromium.
8. `tests/smoke/routes-and-theme.spec.ts`
   - Matrix verification:
     - Routes: `/`, `/about`, `/projects`, `/cv`, `/blog`
     - Themes: light/dark
     - Viewports: mobile/tablet/desktop
   - Kiểm tra HTTP response hợp lệ, main/footer/home-link visible, route marker visible, class `dark` đúng theo theme.
   - Dedicated test: toggle theme -> persist localStorage -> reload -> route navigation still consistent.
9. `package.json` + `package-lock.json`
   - Thêm dev dependency `@playwright/test`.
   - Thêm scripts:
     - `test:smoke`
     - `test:smoke:ui`

## Validation evidence

### 1) Type/semantic checks
- Command: `npm run check`
- Result: **PASS**
- Evidence: `svelte-check found 0 errors and 0 warnings`

### 2) Production build
- Command: `npm run build`
- Result: **PASS**
- Evidence: Vite client+server build thành công.

### 3) Smoke tests
- Command: `npm run test:smoke`
- Result: **PASS**
- Evidence: `31 passed` (~32s)

## Test matrix result (route × theme × viewport)
- Total cases: **30 route checks + 1 theme persistence check**
- Pass: **31/31**
- Fail: **0**

## Blockers
- Không có blocker kỹ thuật tại thời điểm chạy.

## Notes
- Playwright browsers đã được cài local bằng `npx playwright install chromium` để chạy smoke test.
- Có cảnh báo `npm audit` vulnerabilities từ dependency tree hiện tại (không thuộc scope stabilize phase 1).
