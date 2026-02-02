// js/config.js
window.INVITE = {
  couple: {
    bride: "Nguyễn Ngọc Ánh",
    groom: "Đỗ Viết Long",
    topNames: "Ngọc Ánh & Viết Long",
    monogram: "NGỌC ÁNH ✦ VIẾT LONG",
    monthTag: "02 • 2026",
  },

  families: {
    brideSide: {
      title: "Nhà Gái",
      address: "Thôn Guồng, Lập Thạch, Phú Thọ",
      dad: "ÔNG NGUYỄN XUÂN TỚI",
      mom: "BÀ NGUYỄN THỊ THUÂN",
    },
    groomSide: {
      title: "Nhà Trai",
      address: "TDP Tam Hợp, Tự Lạn, Bắc Ninh",
      dad: "ÔNG ĐỖ VIẾT ĐÔNG",
      mom: "BÀ NGUYỄN THỊ THÊM",
    },
  },

  location: {
    placeName: "TƯ GIA NHÀ GÁI",
    addressLine: "Thôn Guồng, Lập Thạch, Phú Thọ",
    // Nút chỉ đường (Google Maps search query)
    directionsUrl: "https://www.google.com/maps/search/?api=1&query=21.4036389%2C105.4833889",
    // ✅ Dán src iframe từ Google Maps (Share → Embed a map)
    // Ví dụ sẽ có dạng: https://www.google.com/maps/embed?pb=...
    embedSrc: "https://www.google.com/maps?q=21.4036389,105.4833889&output=embed",
  },

  // Ảnh
  gift: {
    bankName: "BIDV",
    accountName: "NGUYEN THI NGOC ANH",
    accountNumber: "4253950313",
    bankBranch: "BIDV - PGD Lap Thach",
    qrImage: "./assets/qr.png"
  },

  images: {
    hero: "./assets/hero.jpg",
    album: [
      { src: "./assets/album-1.jpg", label: "Khoảnh khắc 01" },
      { src: "./assets/album-2.jpg", label: "Khoảnh khắc 02" },
      { src: "./assets/album-3.jpg", label: "Khoảnh khắc 03" },
      { src: "./assets/album-4.jpg", label: "Khoảnh khắc 04" },
      { src: "./assets/album-5.jpg", label: "Khoảnh khắc 05" },
    ],
  },

  // Sự kiện (giờ địa phương, VN = UTC+7)
  events: {
    // Countdown tới Lễ Thành Hôn
    countdownTarget: "2026-02-07T10:00:00",

    party: {
      title: "Tiệc mừng lễ thành hôn",
      dateText: "06.02.2026",
      timeText: "16:00 — Thứ 6",
      lunarText: "(Tức Ngày 19 Tháng 12 Năm Ất Tỵ)",
      startISO: "2026-02-06T16:00:00",
      durationHours: 3
    },

    wedding: {
      title: "Lễ thành hôn",
      dateText: "07.02.2026",
      timeText: "10:00 — Thứ Bảy",
      lunarText: "(Tức Ngày 20 Tháng 12 Năm Ất Tỵ)",
      startISO: "2026-02-07T10:00:00",
      durationHours: 2
    }
  }
};
