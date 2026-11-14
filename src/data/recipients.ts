/**
 * Static Recipient Dataset for See You
 *
 * Precompiled static dataset containing 128-bit unguessable tokens for intern recipients.
 * Conforms to PROJECT.md § Interface Contracts and SEE_YOU_PROJECT_BRIEF.md §7 & §18.
 */

import type { RecipientData } from './types';

// ---------------------------------------------------------------------------
// 1. Nadya Putri (Standard Complete Recipient with Video Note)
// ---------------------------------------------------------------------------
export const RECIPIENT_NADYA: RecipientData = {
  token: 'tok_nadya_128bit',
  recipient: {
    name: 'Nadya Putri',
    nickname: 'Nadya',
  },
  theme: {
    background: '#F7F3EA',
    accent: '#687B61',
  },
  greeting: {
    headline: 'Surat untuk Nadya',
    quote: 'Setiap akhir perjalanan adalah awal dari petualangan baru yang menanti.',
    message:
      'Halo, Nadya! Terima kasih atas energi luar biasa, dedikasi, dan kerja keras yang kamu hadirkan di Komnasinfo selama masa magangmu. Ini adalah kenang-kenangan sederhana dari kami semua.',
  },
  facilitatorLetter: {
    sender: 'Krisnanda',
    role: 'Fasilitator & Pembimbing',
    salutation: 'Untuk Nadya,',
    paragraphs: [
      'Mengingat kembali minggu pertamamu, rasa ingin tahu dan ketenanganmu dalam menghadapi tantangan begitu berkesan. Kamu selalu menyikapi setiap persoalan dengan sudut pandang matang dan perhatian tulus.',
      'Melewati batas waktu yang ketat dan diskusi panjang, ketangguhanmu membuat tim tetap solid. Kamu tidak hanya membawa keahlian teknis, tetapi juga empati yang membuat tim ini bertumbuh.',
      'Saat melangkah ke babak berikutnya, ketahuilah bahwa jejak karyamu telah membekas di Komnasinfo. Kami sangat bersyukur dan bangga pernah berproses bersamamu.',
    ],
    signature: 'Krisnanda',
  },
  teamLetters: [
    {
      sender: 'Bambang Wijaya',
      role: 'Kepala Komnasinfo',
      avatar: '/see-you/assets/photos/bambang.webp',
      accent: '#29382F',
      message:
        'Nadya, dedikasimu patut diapresiasi. Komnasinfo menjadi lebih hidup dan bermakna dengan kehadiranmu. Sukses selalu untuk langkahmu berikutnya!',
    },
    {
      sender: 'Fajar Nugraha',
      role: 'Desainer Senior',
      avatar: '/see-you/assets/photos/fajar.webp',
      accent: '#687B61',
      message:
        'Sangat menyenangkan bisa berkolaborasi denganmu. Teruslah berkarya dengan antusiasme dan ketelitian luar biasa yang kamu miliki!',
    },
    {
      sender: 'Ayu Lestari',
      role: 'Koordinator Proyek',
      avatar: '/see-you/assets/photos/ayu.webp',
      accent: '#D9C8A5',
      message:
        'Terima kasih atas kehangatan dan kerja timmu, Nadya. Komunikasi selalu terasa mudah dan menyenangkan. Sampai bertemu lagi di lain waktu!',
    },
  ],
  memories: [
    {
      src: '/see-you/assets/photos/memory-1.webp',
      alt: 'Retrospektif sprint tim di studio',
      caption: 'Retrospektif sprint pertama bersama tim di studio',
    },
    {
      src: '/see-you/assets/photos/memory-2.webp',
      alt: 'Rehat kopi dan obrolan hangat',
      caption: 'Canda tawa dan obrolan sore di sela istirahat',
    },
    {
      src: '/see-you/assets/photos/memory-3.webp',
      alt: 'Perayaan demo day',
      caption: 'Merayakan keberhasilan demo day bersama seluruh tim',
    },
  ],
  videoNote: {
    src: '/see-you/assets/videos/farewell-nadya.mp4',
    poster: '/see-you/assets/photos/video-poster-nadya.webp',
    note: 'Kompilasi pesan dan ucapan perpisahan dari rekan tim.',
  },
  closing: {
    headline: 'Sampai Jumpa Lagi',
    message: 'Semoga langkahmu ke depan senantiasa dipenuhi keberkahan, kebahagiaan, dan pencapaian-pencapaian yang membanggakan.',
    sender: 'Komnasinfo & Chronicle',
    period: 'Periode Magang: Agustus - Desember 2026',
  },
};

// ---------------------------------------------------------------------------
// 2. Budi Santoso (Second Valid Recipient)
// ---------------------------------------------------------------------------
export const RECIPIENT_BUDI: RecipientData = {
  token: 'tok_budi_128bit',
  recipient: {
    name: 'Budi Santoso',
    nickname: 'Budi',
  },
  theme: {
    background: '#F7F3EA',
    accent: '#29382F',
  },
  greeting: {
    headline: 'Surat untuk Budi',
    quote: 'Apa yang kita bawa pulang ditentukan oleh siapa yang berjalan di sisi kita.',
    message:
      'Halo, Budi! Seiring berakhirnya masa magangmu, kami ingin meluangkan waktu sejenak untuk mengingat kembali apa yang telah kita bangun dan lalui bersama.',
  },
  facilitatorLetter: {
    sender: 'Krisnanda',
    role: 'Fasilitator & Pembimbing',
    salutation: 'Untuk Budi,',
    paragraphs: [
      'Sejak hari pertama, kamu menunjukkan tekad kuat dan ketajaman berpikir dalam menyelesaikan setiap tantangan. Kamu tidak pernah puas dengan jalan pintas, melainkan selalu mencari solusi terbaik.',
      'Melihatmu memecahkan berbagai tantangan frontend dengan tenang dan selalu siap membantu rekan-rekanmu adalah salah satu hal yang paling kami hargai. Kesabaran dan fokusmu menjadi teladan bagi tim.',
      'Terima kasih atas karya, integritas, dan kebersamaanmu, Budi. Kami yakin kamu akan terus menciptakan hal-hal luar biasa ke mana pun langkahmu membawamu.',
    ],
    signature: 'Krisnanda',
  },
  teamLetters: [
    {
      sender: 'Bambang Wijaya',
      role: 'Kepala Komnasinfo',
      avatar: '/see-you/assets/photos/bambang.webp',
      accent: '#29382F',
      message:
        'Budi, ketelitian teknis dan sikap positifmu akan sangat kami rindukan. Kerja yang luar biasa sepanjang masa magang!',
    },
    {
      sender: 'Fajar Nugraha',
      role: 'Desainer Senior',
      avatar: '/see-you/assets/photos/fajar.webp',
      accent: '#687B61',
      message:
        'Bekerja bersamamu selalu terasa mudah dan menginspirasi. Jangan pernah kehilangan antusiasme dan standar tinggimu!',
    },
    {
      sender: 'Ayu Lestari',
      role: 'Koordinator Proyek',
      avatar: '/see-you/assets/photos/ayu.webp',
      accent: '#D9C8A5',
      message:
        'Terima kasih selalu dapat diandalkan dan tetap tenang di bawah tekanan. Sukses selalu untuk kelulusan dan masa depanmu!',
    },
  ],
  memories: [
    {
      src: '/see-you/assets/photos/memory-budi-1.webp',
      alt: 'Sesi brainstorming arsitektur sistem',
      caption: 'Sesi diskusi arsitektur sistem di ruang rapat',
    },
    {
      src: '/see-you/assets/photos/memory-budi-2.webp',
      alt: 'Diskusi santai dan rehat kopi',
      caption: 'Rehat kopi sore dan diskusi santai tim',
    },
    {
      src: '/see-you/assets/photos/memory-budi-3.webp',
      alt: 'Foto bersama presentasi akhir',
      caption: 'Foto bersama setelah presentasi akhir magang',
    },
  ],
  videoNote: {
    src: '/see-you/assets/videos/farewell-budi.mp4',
    poster: '/see-you/assets/photos/video-poster-budi.webp',
    note: 'Kompilasi pesan dan ucapan perpisahan dari rekan tim.',
  },
  closing: {
    headline: 'Sampai Jumpa Lagi',
    message: 'Terima kasih telah menjadi bagian tak tergantikan dari Komnasinfo. Teruslah berkarya dan raih impianmu, Budi!',
    sender: 'Komnasinfo & Chronicle',
    period: 'Periode Magang: Agustus - Desember 2026',
  },
};

// ---------------------------------------------------------------------------
// 3. Siti Rahma (Edge Case: Null Avatars & Missing VideoNote)
// ---------------------------------------------------------------------------
export const RECIPIENT_SITI: RecipientData = {
  token: 'tok_siti_128bit',
  recipient: {
    name: 'Siti Rahma',
    nickname: 'Siti',
  },
  theme: {
    background: '#F7F3EA',
    accent: '#A8B5A0',
  },
  greeting: {
    headline: 'Surat untuk Siti',
    quote: 'Kebaikan dan ketulusan selalu meninggalkan jejak paling mendalam.',
    message:
      'Halo, Siti! Kami sangat bersyukur atas ketulusan hati dan dedikasi luar biasa yang kamu berikan selama di Komnasinfo.',
  },
  facilitatorLetter: {
    sender: 'Krisnanda',
    role: 'Fasilitator & Pembimbing',
    salutation: 'Untuk Siti,',
    paragraphs: [
      'Gagasan dan sudut pandang bijak yang kamu sampaikan selalu membawa keseimbangan dalam setiap diskusi tim.',
      'Terima kasih atas kerja keras dan dukungan tanpa pamrih yang kamu berikan. Kehadiranmu membuat Komnasinfo terasa lebih hangat.',
    ],
    signature: 'Krisnanda',
  },
  teamLetters: [
    {
      sender: 'Bambang Wijaya',
      role: 'Kepala Komnasinfo',
      avatar: null,
      accent: '#29382F',
      message: 'Siti, komitmen dan ketekunanmu sangat berharga bagi tim.',
    },
    {
      sender: 'Fajar Nugraha',
      role: 'Desainer Senior',
      avatar: null,
      accent: '#687B61',
      message: 'Terima kasih atas dukungan cemerlang dan kehangatanmu sepanjang proyek!',
    },
  ],
  memories: [
    {
      src: '/see-you/assets/photos/memory-siti-1.webp',
      alt: 'Sesi diskusi di studio',
      caption: 'Sesi diskusi dan berbagi gagasan di studio',
    },
  ],
  videoNote: undefined,
  closing: {
    headline: 'Sampai Jumpa Lagi',
    message: 'Semoga kedamaian dan kesuksesan senantiasa menyertai setiap langkahmu ke depan, Siti.',
    sender: 'Komnasinfo & Chronicle',
    period: 'Periode Magang: Agustus - Desember 2026',
  },
};

// ---------------------------------------------------------------------------
// 4. Dewi Ayu (Edge Case: Unicode Characters & Emojis across all fields)
// ---------------------------------------------------------------------------
export const RECIPIENT_DEWI: RecipientData = {
  token: 'tok_dewi_128bit',
  recipient: {
    name: 'Dewi Ayu 🌸',
    nickname: 'Dewi 🌸',
  },
  theme: {
    background: '#F7F3EA',
    accent: '#D9C8A5',
  },
  greeting: {
    headline: 'A letter for Dewi Ayu 🌸',
    quote: 'Setiap jejak langkah adalah cerita yang tak terlupakan 🌿✨',
    message:
      'Halo Dewi! Terima kasih atas senyuman, semangat membara, dan energi positifmu di Komnasinfo 💖.',
  },
  facilitatorLetter: {
    sender: 'Krisnanda',
    role: 'Facilitator & Lead',
    salutation: 'Dear Dewi 🌸,',
    paragraphs: [
      'Kehadiranmu selalu membawa keceriaan dan semangat baru dalam setiap diskusi tim. Terima kasih atas dedikasi dan kerja kerasmu.',
      'Semoga langkahmu ke depan semakin gemilang dan penuh berkah 🌟.',
    ],
    signature: 'Krisnanda',
  },
  teamLetters: [
    {
      sender: 'Bambang Wijaya',
      role: 'Head of Komnasinfo',
      avatar: '/see-you/assets/photos/bambang.webp',
      accent: '#29382F',
      message: 'Dewi, semangatmu luar biasa! Sukses selalu di masa depan! ✨',
    },
    {
      sender: 'Ayu Lestari',
      role: 'Project Coordinator',
      avatar: null,
      accent: '#D9C8A5',
      message: 'Terima kasih banyak atas keceriaanmu, Dewi! Sampai jumpa lagi! 🌸',
    },
  ],
  memories: [
    {
      src: '/see-you/assets/photos/memory-dewi-1.webp',
      alt: 'Perayaan akhir magang 🎊',
      caption: 'Kenangan indah bersama tim Komnasinfo 📸',
    },
  ],
  videoNote: {
    src: '/see-you/assets/videos/farewell-dewi.mp4',
    poster: '/see-you/assets/photos/video-poster-dewi.webp',
    note: 'Pesan manis dari seluruh keluarga Komnasinfo 🎬',
  },
  closing: {
    headline: 'Sampai Bertemu Lagi 🌿',
    message: 'Terima kasih telah menjadi bagian berharga dari keluarga Komnasinfo! ✨',
    sender: 'Komnasinfo & Chronicle',
    period: 'Internship Period: August - December 2026',
  },
};

// ---------------------------------------------------------------------------
// 5. Aya (Authentic Chronicle Reference Demo Intern)
// ---------------------------------------------------------------------------
export const RECIPIENT_AYA: RecipientData = {
  token: 'tok_aya_128bit',
  recipient: {
    name: 'Aya',
    nickname: 'Aya',
  },
  theme: {
    background: '#F7F3EA',
    accent: '#687B61',
  },
  greeting: {
    headline: 'Hello, Aya!',
    quote: 'Rasanya baru kemarin kamu datang dengan rasa ingin tahu. Tahu-tahu, kamu sudah menjadi bagian dari cerita kami.',
    message: 'Sebelum kita berpisah, ada beberapa hal yang ingin kami sampaikan. Pelan-pelan saja membacanya, ya.',
  },
  facilitatorLetter: {
    sender: 'Krisnanda',
    role: 'Fasilitator magangmu',
    salutation: 'Dear Aya,',
    paragraphs: [
      'Aku bangga melihat caramu belajar: bertanya tanpa takut, mencoba lagi saat belum berhasil, dan selalu membawa perhatian pada pekerjaan kecil sekalipun.',
      'Terima kasih sudah hadir dengan sepenuh hati. Semoga semua yang kamu temukan di sini menjadi bekal untuk petualangan berikutnya. Jangan lupa, kamu selalu punya tempat untuk kembali menyapa.',
    ],
    signature: 'Kak Rani',
  },
  teamLetters: [
    {
      sender: 'Kak Dimas',
      role: 'Ketua Bidang Komnasinfo',
      avatar: null,
      accent: '#A8B5A0',
      message:
        'Terima kasih sudah membawa sudut pandang baru ke setiap diskusi. Ketelitian dan semangatmu membuat pekerjaan bersama terasa lebih hidup.',
    },
    {
      sender: 'Kak Sinta',
      role: 'Anggota Komnasinfo',
      avatar: null,
      accent: '#D9C8A5',
      message:
        'Aku akan kangen obrolan spontan dan caramu selalu menemukan ide dari hal-hal sederhana. Jangan berhenti penasaran, ya!',
    },
    {
      sender: 'Kak Bima',
      role: 'Anggota Komnasinfo',
      avatar: null,
      accent: '#C7D5C1',
      message:
        'Dari tenggat yang sibuk sampai tawa di sela hari, senang sekali pernah satu tim denganmu. Semoga jalanmu selalu terbuka.',
    },
  ],
  memories: [
    {
      src: '/see-you/assets/photos/memory-1.webp',
      alt: 'Tawa di sela pekerjaan',
      caption: 'Tawa di sela pekerjaan',
    },
  ],
  videoNote: {
    note: 'Ruang untuk video kenangan. Video akan tampil di sini jika ditambahkan ke data cerita.',
  },
  closing: {
    headline: 'Sampai jumpa di bab berikutnya.',
    message: 'Terus bertumbuh, terus berkarya, dan jangan ragu menulis ceritamu sendiri. Terima kasih sudah menjadi bagian dari Chronicle.',
    sender: 'Tim Komnasinfo / Chronicle',
    period: 'Periode magang 2025',
  },
};

// ---------------------------------------------------------------------------
// Aggregated Datasets & Token Lookup Maps
// ---------------------------------------------------------------------------
export const RECIPIENTS: RecipientData[] = [
  RECIPIENT_NADYA,
  RECIPIENT_BUDI,
  RECIPIENT_SITI,
  RECIPIENT_DEWI,
  RECIPIENT_AYA,
];

// Prototype-safe ES6 Map for O(1) case-sensitive lookups
export const RECIPIENTS_BY_TOKEN = new Map<string, RecipientData>([
  [RECIPIENT_NADYA.token, RECIPIENT_NADYA],
  [RECIPIENT_BUDI.token, RECIPIENT_BUDI],
  [RECIPIENT_SITI.token, RECIPIENT_SITI],
  [RECIPIENT_DEWI.token, RECIPIENT_DEWI],
  [RECIPIENT_AYA.token, RECIPIENT_AYA],
  // Also support Chronicle reference token alias
  ['tok_aya_chronicle', RECIPIENT_AYA],
]);

// Read-only object registry for backward compatibility
export const RECIPIENT_REGISTRY: Record<string, RecipientData> = Object.freeze(
  Object.fromEntries(RECIPIENTS_BY_TOKEN)
);
