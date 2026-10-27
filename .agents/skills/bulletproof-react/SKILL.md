---
name: bulletproof-react
description: Scalable, clean React and TypeScript architecture guidelines inspired by bulletproof-react (26k+ stars). Enforces feature-based modularity, separation of business logic into custom hooks, single responsibility, and prevents monolithic "AI spaghetti code".
---

# BULLETPROOF REACT & CLEAN FRONTEND ARCHITECTURE

Quy chuẩn kiến trúc mã nguồn React + TypeScript sản xuất cao cấp, loại bỏ triệt để hiện tượng **"AI code tùm lum"** (viết file khổng lồ 400-500 dòng, nhồi nhét state, tính toán tiền bạc và render UI chung một chỗ).

---

## 1. NGUYÊN TẮC CỐT LÕI (CORE LAWS)

1. **Luật 150 Dòng (Max File Length Rule):**
   * Một component **không được vượt quá 150-180 dòng code**.
   * Nếu vượt quá: Bắt buộc phải bóc tách thành các sub-components nhỏ hơn hoặc chuyển logic sang Custom Hook.
2. **Tách Biệt Triệt Để UI và Business Logic (Presenter & Hook Separation):**
   * **Component chỉ làm nhiệm vụ Render UI:** Nhận props và hiển thị (Dumb/Presentational Component).
   * **Toàn bộ logic tính toán (Filter, Grouping, Số dư, CRUD DB):** Bắt buộc đưa vào **Custom Hook** (ví dụ: `useCalendarDeck()`, `useSpendingSummary()`, `useQuickCapture()`).
3. **Cấu trúc Theo Tính Năng (Feature-Based Architecture / Screaming Architecture):**
   * Tuyệt đối không ném tất cả component vào một thư mục `components/` phẳng lì vô trật tự.
   * Tổ chức theo từng Domain nghiệp vụ:
     ```text
     src/features/<feature-name>/
     ├── components/     # UI nội bộ của tính năng này
     ├── hooks/          # Custom hooks xử lý state & logic tính toán
     ├── types/          # Typescript interfaces riêng của tính năng
     └── index.ts        # Public API xuất ra ngoài
     ```

---

## 2. BẢN ĐỒ CẤU TRÚC THƯ MỤC CHUẨN

```text
src/
├── components/          # Các UI Primitive dùng chung toàn app (Button, Modal, Card, Input)
├── features/            # Các module tính năng độc lập
│   ├── calendar/        # Lưới lịch, Chồng ảnh, Badge +N
│   │   ├── components/  # CalendarGrid, StackedDeckCard, EmptyDaySlot
│   │   └── hooks/       # useCalendarMatrix, useStackedDeck
│   │
│   ├── spending/        # Nghiệp vụ ghi nhận chi tiêu & Camera
│   │   ├── components/  # QuickCaptureModal, DayAlbumModal, NonPhotoDrawer
│   │   └── hooks/       # useDayAlbum, useExpenseEntry
│   │
│   ├── analytics/       # Thống kê Story (Spotify Wrapped)
│   │   ├── components/  # MonthlyRecapModal, RecapSlides
│   │   └── hooks/       # useRecapMetrics
│   │
│   └── settings/        # Quản lý danh mục & Sao lưu Local
│       ├── components/  # CategoryManager, BackupRestorePanel
│       └── hooks/       # useCategoryOperations
│
├── hooks/               # Các hooks dùng chung toàn app
├── services/            # Tầng lưu trữ (IndexedDB, nén ảnh WebP)
└── types/               # Kiểu dữ liệu chia sẻ toàn cầu
```

---

## 3. QUY CHUẨN CODE TYPESCRIPT & REACT

1. **Tuyệt đối CẤM `any`:**
   * Mọi props, state, event handler đều phải có kiểu dữ liệu tường minh.
2. **Pure Functions cho tính toán tài chính:**
   * Các hàm tính toán số dư, cộng dồn chi tiêu, format tiền tệ phải là Pure Functions nằm trong `utils/` hoặc `helpers/`, không viết nhúng trực tiếp trong JSX `onClick`.
3. **Colocation (Đặt code gần nơi sử dụng):**
   * Nếu một component con chỉ được dùng bởi duy nhất một component cha, đặt nó trong cùng thư mục của component cha đó, không đưa ra thư mục dùng chung toàn cục.
