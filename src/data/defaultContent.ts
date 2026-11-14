/**
 * Default Content & Copy Configuration for See You
 *
 * Guarantees zero sensitive recipient data disclosure on errors or missing tokens.
 * Conforms to PROJECT.md and SEE_YOU_PROJECT_BRIEF.md §7.3 & §8.
 */

import type { FallbackContent } from './types';

export const BRAND_WORDMARK = {
  prefix: 'SEE',
  suffix: 'YOU.',
  full: 'SEE YOU.',
  tagline: 'A Little Something for You',
};

export const FALLBACK_CONTENT: FallbackContent = {
  title: 'Surat Tidak Ditemukan / Link Tidak Valid',
  subtitle: 'Letter Not Found',
  message:
    'Kami tidak dapat menemukan surat yang sesuai dengan tautan ini. Mohon pastikan tautan yang kamu buka sudah lengkap atau coba periksa dan pindai kembali kode QR pada hamper bungamu.',
  instruction:
    'Jika kamu merasa ini adalah kekeliruan, silakan hubungi tim fasilitator atau scan ulang kode QR di kartu ucapan hamper kamu.',
};

export const DESKTOP_GATE_CONTENT = {
  brandTitle: 'SEE YOU.',
  brandTagline: 'A Little Something for You',
  headline: 'This letter is meant to be opened on your phone.',
  subheadline: 'Surat ini dirancang khusus untuk dibuka di ponselmu (smartphone).',
  instruction:
    'Pindai kode QR di bawah ini menggunakan kamera ponsel atau pemindai QR untuk membuka surat kenanganmu.',
  footnote: 'Buka kamera ponsel atau aplikasi pemindai QR di HP kamu dan arahkan ke kode ini.',
  hint: 'Tautan dan parameter surat kamu tersimpan secara aman.',
};
