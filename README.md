# Tape Ketan Dasiti — Kelola Pesanan

Aplikasi mobile-first untuk **Tape Ketan Dasiti** di Desa Leuwidingding, Cirebon. Dipakai pemilik yang juga memproduksi, supaya tidak lupa siapa yang pesan dan mana yang harus lebih dulu diambil atau diantar.

Buka di HP lewat browser, lalu **Tambahkan ke layar utama** supaya terasa seperti aplikasi.

## Yang bisa dilakukan

- Catat pesanan Tape Ketan: ember besar/kecil, kotak 3000/2000/1500 ml, atau wadah custom
- Harga otomatis sesuai wadah, bisa diubah kalau custom
- Antrian dari yang **paling cepat** diambil atau diantar
- Ambil di tempat atau diantar ke rumah pemesan
- Catat asal pesanan (WhatsApp, datang, titip), DP, dan sisa hutang
- Status: baru → sedang dibuat → siap → selesai
- Cadangkan / pulihkan data (tersimpan di HP, tanpa akun)

## Harga wadah

| Wadah | Harga |
| --- | --- |
| Ember besar | Rp 110.000 |
| Ember kecil | Rp 75.000 |
| Kotak 3000ml | Rp 30.000 |
| Kotak 2000ml | Rp 25.000 |
| Kotak 1500ml | Rp 20.000 |
| Wadah custom | menyesuaikan |

## Cara menjalankan

```bash
npm install
npm run dev
```

Aplikasi berjalan di [http://127.0.0.1:43147](http://127.0.0.1:43147).

Untuk membangun versi produksi:

```bash
npm run build
npm run start
```

## Catatan

Versi awal ini **belum butuh internet atau akun**. Data tersimpan di penyimpanan HP (localStorage). Ganti HP? Pakai menu pengaturan → **Cadangkan data**.

Contoh pesanan muncul saat pertama kali dibuka, supaya alurnya bisa dicoba dulu.
