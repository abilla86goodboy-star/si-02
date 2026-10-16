# SYSTEM INFORMATION TWO — Portofolio Kelas

Home berupa pengalaman "Planet Jumping" (React + Vite, tanpa library tambahan).

## Menjalankan

```bash
npm install
npm run dev      # buka alamat yang tampil (biasanya http://localhost:5173)
npm run build    # hasil produksi ada di folder dist
```

## Struktur

- `src/data.js` — URL aset, daftar planet, dan data fakta tiap planet
- `src/Home.jsx` — markup komponen Home (React)
- `src/usePlanetJumping.js` — engine canvas portal, preloader, transisi, dan kursor
- `src/home.css` — seluruh styling

## Catatan

- Video & gambar dimuat dari CDN, jadi butuh koneksi internet.
- Font SF Pro / Aalto dipakai jika terpasang di perangkat; jika tidak, otomatis pakai Arial / Arial Narrow.
- `StrictMode` sengaja tidak dipakai agar preloader tidak berjalan dua kali di mode dev.
