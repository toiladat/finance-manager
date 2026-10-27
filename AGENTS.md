# DỰ ÁN LOCKET FINANCE PWA

Toàn bộ các tác vụ trong dự án này (từ thiết kế UI đến tổ chức mã nguồn) **BẮT BUỘC tuân thủ 100%** nội dung của 2 trụ cột skills đã cài đặt trong `.agents/skills/`:

---

## TRỤ CỘT 1: THIẾT KẾ UI/UX CHUẨN APPLE & ANTI-AI-SLOP
1. 👉 **[apple-design-skill](file:///.agents/skills/apple-design-skill/SKILL.md)**: 100+ quy chuẩn chính thống Apple Human Interface Guidelines (HIG), squircle geometry, accessibility, native contrast.
2. 👉 **[frontend-design](file:///.agents/skills/frontend-design/SKILL.md)**: Loại bỏ triệt để "AI Slop / Vibe AI", định hình thẩm mỹ thủ công, nhịp điệu typography, tactile feedback.
3. 👉 **[ios-craft-design](file:///.agents/skills/ios-craft-design/SKILL.md)**: May đo riêng cho dự án Locket Finance (Lưới lịch xếp lớp ảnh, bảng màu Dark Mode OLED/Charcoal, cơ chế Locket 3-giây).

---

## TRỤ CỘT 2: KIẾN TRÚC MÃ NGUỒN CLEAN CODE & FEATURE-BASED
4. 👉 **[clean-code](file:///.agents/skills/clean-code/SKILL.md)**: Quy chuẩn Clean Code kinh điển của Robert C. Martin (Single Responsibility, Functions do one thing, Descriptive naming, No side-effects).
5. 👉 **[bulletproof-react](file:///.agents/skills/bulletproof-react/SKILL.md)**: Kiến trúc React + TypeScript sạch sẽ, mô-đun hóa theo tính năng (`src/features/`), triệt tiêu hiện tượng "AI code tùm lum":
   * **Luật 150 Dòng:** Tuyệt đối không viết component phình to quá 150-180 dòng.
   * **Tách Biệt UI và Logic:** Component chỉ làm nhiệm vụ Presentational/Render. Mọi logic tính toán, filter, state quản lý phải nằm trong **Custom Hook**.
   * **Cấu trúc Feature-driven:** Tổ chức mã nguồn theo từng module (`calendar`, `spending`, `analytics`, `settings`) thay vì nhồi nhét vào một thư mục phẳng.
   * **Type-Safe 100%:** Tuyệt đối không dùng `any`.
