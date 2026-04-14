# Phase 1 Regression Checklist (Post-refactor Stabilize)

## Scope routes
- `/`
- `/about`
- `/projects`
- `/cv`
- `/blog`

## Checklist chuẩn

### 1) Render & HTTP validity
- [ ] Route trả về trạng thái hợp lệ (2xx)
- [ ] Không crash SSR/hydration
- [ ] Main content hiển thị đúng section chính

### 2) Navigation consistency
- [ ] Logo/home link hoạt động trên tất cả route
- [ ] Header hiển thị ổn định trên mobile/tablet/desktop
- [ ] Footer luôn render và không lệch layout

### 3) CTA & content anchors
- [ ] CTA chính route `/` hiển thị (`View Projects`)
- [ ] Điểm nhấn nội dung route-specific xuất hiện đúng
- [ ] Không mất nội dung quan trọng khi đổi viewport

### 4) Theme behavior (dark/light)
- [ ] Toggle theme đổi trạng thái đúng
- [ ] `localStorage(theme)` được lưu đúng giá trị
- [ ] Reload vẫn giữ theme đã chọn
- [ ] Chuyển route vẫn giữ theme
- [ ] Fallback theo system preference khi chưa có saved preference

### 5) Responsive consistency
- [ ] Mobile (390x844): không vỡ header/footer, text không tràn xấu
- [ ] Tablet (768x1024): spacing và wrapping ổn định
- [ ] Desktop (1280x800): alignment và hierarchy đúng
- [ ] Focus outline rõ ràng với keyboard

## Test automation mapping
Smoke test file: `tests/smoke/routes-and-theme.spec.ts`
- Matrix: 5 routes × 2 themes × 3 viewports = 30 route checks
- + 1 dedicated test cho theme persistence (toggle/reload/navigation)
- Tổng: **31 tests**
