# CI Quality Gates (Phase 3)

Pipeline GitHub Actions (`.github/workflows/pipelines.yml`) chạy theo thứ tự bắt buộc cho `pull_request` và `push` vào `main`:

1. `npm ci`
2. `npm run check`
3. `npm run build`
4. `npm run test:smoke`

## Mục tiêu

- Chặn merge khi sai kiểu dữ liệu/lỗi Svelte (`check` fail).
- Chặn deploy khi build production fail.
- Chặn deploy khi smoke test route/theme fail.

## Ghi chú CI runtime

- Node.js pin cứng: `20.19.0`.
- Có npm cache từ `web/package-lock.json`.
- Playwright browser/deps được cài trong CI bằng:
  - `npx playwright install --with-deps chromium`
- Khi smoke test fail, workflow upload artifact:
  - `web/playwright-report`
  - `web/test-results`

## Debug nhanh khi pipeline fail

Chạy local tại thư mục `web` theo đúng thứ tự CI:

```bash
npm ci
npm run check
npm run build
npx playwright install chromium
npm run test:smoke
```

Nếu fail ở smoke test:

- Mở report local (sau khi chạy test):

```bash
npx playwright show-report
```

- Hoặc tải artifact `web-smoke-artifacts-*` từ GitHub Actions run bị fail để xem trace/report.
