---
name: ios-craft-design
description: Apple HIG & Human-Crafted Mobile Frontend Design Guidelines. Enforces iOS native aesthetics, squircle geometry, OLED dark tones, spring physics, tactile touch interactions, and eliminates generic "AI slop" or synthetic gradients.
---

# IOS CRAFT & ANTI-AI-SLOP DESIGN SYSTEM

Quy chuẩn thiết kế giao diện Frontend chuẩn Apple Human Interface Guidelines (HIG) dành riêng cho ứng dụng di động / PWA. Toàn bộ giao diện tạo ra phải mang linh hồn "Thủ công, tinh xảo, đầm tay" như một ứng dụng Native iOS hàng đầu (Crafted by Humans), tuyệt đối không để dính bất kỳ dấu vết "Vibe AI" (AI Slop).

---

## 1. NGUYÊN TẮC "DIỆT TẬN GỐC VIBE AI" (ANTI-AI MANIFESTO)

1. **CẤM TUYỆT ĐỐI Gradient tím/xanh/hồng công nghiệp:**
   * Tuyệt đối không dùng: `from-indigo-500 to-purple-600`, `from-pink-500 to-rose-500` hoặc các nút bấm phát sáng neon rẻ tiền.
   * Thay vào đó: Dùng nền đơn sắc tối sâu (Deep Charcoal / OLED Jet Black) kết hợp viền **Hairline 1px sắc nét** (`rgba(255, 255, 255, 0.08)`).
2. **CẤM Đổ bóng mềm bồng bềnh vô nghĩa (`shadow-2xl`):**
   * Trong iOS Dark Mode, chiều sâu không đến từ bóng đen đổ vào nền đen, mà đến từ **Độ nâng sáng bề mặt (Surface Elevation)** và **Đường viền mỏng như sợi tóc (Hairline Border)**.
3. **CẤM Animation tuyến tính (`ease-in-out` thông thường):**
   * Mọi chuyển động phải tuân theo **Vật lý lò xo (Spring Physics)** với độ cản thực tế (`stiffness: 400, damping: 30`).
4. **BẮT BUỘC Phản hồi xúc giác thị giác (Tactile Touch):**
   * Mọi card, nút bấm khi chạm vào phải co nhẹ: `active:scale-[0.96]` hoặc `active:scale-[0.97]` kèm `transition-transform duration-100 ease-out`.

---

## 2. HỆ THỐNG MÀU CHUẨN (APPLE SYSTEM DARK TOKENS)

Lấy trực tiếp từ hệ quy chiếu của ứng dụng mẫu:

```css
:root {
  /* Nền chính - Không gian sâu */
  --bg-canvas: #0E0E11;        /* Nền tối sâu thẳm, không bẩn */
  
  /* Bề mặt thành phần (Surfaces) */
  --bg-card: #18181D;          /* Bề mặt card chính */
  --bg-card-elevated: #222228; /* Bề mặt card nổi / Hover / Pressed */
  --bg-subtle: #2C2C34;        /* Nút phụ / Tag / Segmented control */
  
  /* Đường viền chuẩn Retina (Hairlines) */
  --border-hairline: rgba(255, 255, 255, 0.07);
  --border-active: rgba(255, 255, 255, 0.15);
  
  /* Kính mờ (Frosted Glass) */
  --glass-bg: rgba(22, 22, 27, 0.75);
  --glass-blur: blur(20px);
  
  /* Chữ & Phân cấp thị giác */
  --text-primary: #FFFFFF;     /* Trắng 100% cho tiêu đề & số tiền */
  --text-secondary: #8E8E93;   /* Xám iOS cho phụ đề & nhãn */
  --text-tertiary: #545458;    /* Mờ cho các thành phần nền */
  
  /* Điểm nhấn có chủ đích (Minimal Accents) */
  --accent-income: #34C759;    /* Xanh lá iOS cho tiền vào */
  --accent-expense: #FF453A;   /* Đỏ cam iOS cho tiền ra */
  --accent-blue: #0A84FF;      /* Xanh dương Apple cho nút hành động chính */
  --accent-streak: #FF9F0A;    /* Cam rực rỡ cho chuỗi ngày streak 🔥 */
}
```

---

## 3. HÌNH HỌC & BO GÓC (APPLE SQUIRCLE GEOMETRY)

Trong iOS, bo góc không phải là hình tròn đơn thuần (Circular arcs) mà là đường cong Squircle chuyển tiếp mượt mà:
* **Card lớn / Bottom Sheet:** `rounded-[24px]` hoặc `rounded-[28px]`.
* **Photo Deck / Ô Lịch:** `rounded-[16px]` hoặc `rounded-[18px]`.
* **Nút bấm Pill / Filter Tag:** `rounded-full` (padding `px-3.5 py-1.5`).
* **Vòng tròn ngày rỗng:** Kích thước `w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.04]`.

---

## 4. QUY CÁCH CHỒNG ẢNH TRÊN LƯỚI LỊCH (PHOTO STACK SYSTEM)

Để đạt được hiệu ứng Calendar Stacked Deck như ảnh mẫu:
1. **Lớp ảnh đại diện (Top Card):**
   * Kích thước vuông tỷ lệ 1:1, bo góc `rounded-[16px]`.
   * Bao quanh bởi một viền hairline sáng: `border: 1px solid rgba(255,255,255,0.12)`.
2. **Lớp thẻ bóng phía sau (Stack Layers):**
   * Khi ngày có từ $\ge 2$ ảnh: Render một pseudo-card hoặc thẻ con nằm chìm phía sau với `scale: 0.94`, `translate-y: -2px`, `rotate: 3deg`, `opacity: 0.5`.
3. **Huy hiệu số lượng (Badge `+N`):**
   * Nằm ở góc trên bên phải của card.
   * Giao diện: Nền trắng đục/đen mờ siêu nhỏ, bo tròn `rounded-full`, text trắng kích thước `text-[10px] font-bold px-1.5 py-0.5`.
4. **Sticker danh mục:**
   * Nằm đè ở góc dưới của card (icon nhỏ dạng squircle có màu nhận diện danh mục).

---

## 5. CHUYỂN ĐỘNG & VẬT LÝ (SPRING PHYSICS)

Mọi component sử dụng Framer Motion phải cấu hình transition dạng:

```typescript
export const iOSSpring = {
  type: "spring",
  stiffness: 420,
  damping: 32,
  mass: 0.8
};

export const iOSTapFeedback = {
  scale: 0.96,
  transition: { duration: 0.1, ease: "easeOut" }
};
```

---

## 6. TYPOGRAPHY & CON SỐ TÀI CHÍNH

* Bắt buộc bật thuộc tính: `font-variant-numeric: tabular-nums` (để các số tiền căn lề hoàn hảo, không bị xô lệch khi số nhảy).
* Tracking chữ: `-0.02em` đến `-0.03em` tạo cảm giác chắc chắn, cô đọng đặc trưng của giao diện Apple.
