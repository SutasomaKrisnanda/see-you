# Panduan Pengaturan GitHub Pages untuk See You

File workflow GitHub Actions telah dikonfigurasi di [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

Berikut adalah langkah-langkah untuk mengaktifkan GitHub Pages di repositori GitHub Anda:

---

## 1. Konfigurasi Pengaturan di GitHub
1. Buka repositori **See You** di GitHub pada browser.
2. Masuk ke tab **Settings** (Pengaturan repositori).
3. Di menu sidebar sebelah kiri, klik menu **Pages** (di bagian *Code and automation*).
4. Pada bagian **Build and deployment**:
   - Di dropdown **Source**, pilih opsi: **`GitHub Actions`** (Bukan `Deploy from a branch`).
5. Selesai! Tidak perlu menekan tombol save tambahan untuk pilihan ini.

---

## 2. Cara Kerja Deployment Otomatis
- Setiap kali Anda melakukan `git push` ke branch `main`, GitHub Actions akan otomatis:
  1. Menjalankan checkout kode & instalasi dependensi pnpm.
  2. Menjalankan verifikasi unit test (`pnpm test`).
  3. Membangun aplikasi produksi (`pnpm run build`) dengan base path `/see-you/`.
  4. Menduplikasi `dist/index.html` menjadi `dist/404.html` agar SPA route / query param tidak 404 saat di-refresh.
  5. Mengunggah dan mempublikasikan situs ke GitHub Pages.

---

## 3. Menjalankan Deployment Manual (Opsional)
Jika ingin memicu deployment tanpa membuat commit baru:
1. Buka tab **Actions** di repositori GitHub Anda.
2. Di sidebar kiri, pilih workflow **Deploy See You to GitHub Pages**.
3. Klik tombol **Run workflow** di sebelah kanan atas, lalu pilih branch `main` dan klik tombol hijau **Run workflow**.

---

## 4. URL Akses Produksi
Setelah deployment selesai, situs Anda akan aktif di:
```text
https://<username-github>.github.io/see-you/?q=tok_nadya_128bit
https://<username-github>.github.io/see-you/?q=tok_budi_128bit
```
*(Ganti `<username-github>` dengan username GitHub Anda).*
