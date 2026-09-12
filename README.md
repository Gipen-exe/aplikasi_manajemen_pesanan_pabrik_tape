# Tape Leuwidingding — Kelola Pesanan

Aplikasi mobile-first untuk usaha tape di **Desa Leuwidingding, Cirebon**. Dibuat supaya pemilik tidak lupa siapa yang pesan, dan mana yang perlu didahulukan.

Buka di HP lewat browser, lalu **Tambahkan ke layar utama** supaya terasa seperti aplikasi.

## Yang bisa dilakukan

- Catat pesanan: nama, WhatsApp, jenis tape, jumlah, kapan diambil/diantar
- Antrian otomatis: **penting**, yang sudah **terlambat**, lalu yang **paling dekat** waktunya
- Ubah status: baru → sedang dibuat → siap diambil → selesai
- Cari nama atau catatan
- Tandai penting, status bayar, dan harga
- Cadangkan / pulihkan data (tersimpan di HP, tanpa akun)

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
