# MONEYFLOW — Web + Mobile starter

MONEYFLOW là bộ khung MVP quản lý chi tiêu đa nền tảng gồm:
- `apps/web`: ứng dụng web responsive (Next.js).
- `apps/mobile`: ứng dụng Android/iOS (Expo + React Native).
- `apps/api`: REST API (NestJS) làm nền tảng mở rộng.
- `packages/finance-core`: các hàm tính toán tài chính dùng chung.

## Yêu cầu
- Node.js 20+
- pnpm 9+
- PostgreSQL (chỉ cần khi triển khai database; API hiện là scaffold khởi đầu)

## Cài đặt
```bash
pnpm install
pnpm dev:web
```
Web chạy tại `http://localhost:3000`.

Chạy Mobile:
```bash
pnpm dev:mobile
```
Làm theo hướng dẫn Expo để mở bằng Expo Go hoặc simulator.

Chạy API:
```bash
pnpm dev:api
```
API mặc định chạy tại `http://localhost:4000`.

## Trạng thái MVP
Đã có:
- Dashboard responsive.
- Thêm giao dịch thu/chi.
- Danh sách lịch sử giao dịch.
- Lọc theo loại giao dịch.
- Tóm tắt thu nhập, chi tiêu, số dư tính từ giao dịch mẫu/nhập vào.
- Màn hình mobile khởi đầu có dashboard và thêm giao dịch.
- REST API scaffold và hàm tính toán tài chính dùng chung.

Chưa triển khai production:
- Đăng ký/đăng nhập và phân quyền.
- Database bền vững, migrations.
- Đồng bộ Web-Mobile thực sự.
- Quản lý công nợ và nhắc nợ chạy nền.
- Push notifications, import/export, báo cáo nâng cao.
- Kiểm thử đầy đủ và triển khai production.

**Lưu ý:** Bản này là starter MVP để chạy và phát triển tiếp, chưa phù hợp để lưu trữ dữ liệu tài chính nhạy cảm trong production. Web demo lưu dữ liệu trong trình duyệt (`localStorage`); bản Mobile hiện là giao diện khởi đầu, chưa đồng bộ với Web/API.
