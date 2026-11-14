/**
 * Static Recipient Dataset for See You
 *
 * Personal facilitator messages are transcribed from the supplied CSV.
 * Team messages are explicit placeholders until each sender provides their text.
 * Tokens are random 128-bit identifiers; regenerate/keep them private before deployment.
 */

import type { RecipientData, MemoryPhoto } from './types';
import memDsc1909 from '@/assets/images/memory/DSC01909.webp';
import memS6234123 from '@/assets/images/memory/S__6234123.webp';
import memLineAlbum from '@/assets/images/memory/LINE_ALBUM_Say HI MAU 24 October 2026_261115_1.webp';
import memDsc1885 from '@/assets/images/memory/DSC01885.webp';

export const DEFAULT_MEMORIES: MemoryPhoto[] = [
  {
    src: memDsc1909,
    alt: 'Momen kebersamaan tim Chronicle',
    caption: 'Momen kebersamaan dan tawa bersama tim',
  },
  {
    src: memS6234123,
    alt: 'Dokumentasi kegiatan magang',
    caption: 'Setiap langkah kecil yang kita lalui bersama',
  },
  {
    src: memLineAlbum,
    alt: 'Kenangan Say HI MAU',
    caption: 'Hangatnya cerita dan kebersamaan di kegiatan',
  },
  {
    src: memDsc1885,
    alt: 'Potret perjalanan magang',
    caption: 'Kenangan yang akan selalu membekas di hati',
  },
];

// ---------------------------------------------------------------------------
// 1. Putu Sebastian Artanda Putra
// ---------------------------------------------------------------------------
export const RECIPIENT_SEBAS: RecipientData = {
  token: "dc8d043425b7c4c96628af494b9fdf27",
  recipient: {
    name: "Putu Sebastian Artanda Putra",
    nickname: "Sebas",
  },
  theme: {
    background: '#F7F3EA',
    accent: '#687B61',
  },
  flower: 'matahari',
  greeting: {
    headline: "Hello, Sebas!",
    quote: 'Setiap pertemuan meninggalkan cerita yang layak dikenang.',
    message: "Terima kasih sudah menjadi bagian dari perjalanan magang Chronicle. Ada beberapa pesan kecil yang ingin kami tinggalkan untukmu.",
  },
  facilitatorLetter: {
    sender: 'Krisnanda',
    role: 'Fasilitator Magang Chronicle',
    salutation: "Untuk Sebas,",
    paragraphs: [
      "Halo Sebas! Pertama kali aku mau ucapin terima kasih karena telah bergabung dalam perjalanan magang kita di Chronicle. Aku mau apresiasi semua keaktifanmu selama rangkaian kegiatan magang ini. Aku harap semua pelajaran dan pengalaman yang kamu alami selama magang ini dapat berguna untukmu kedepannya. Kami pasti menyambutmu di lingkaran PDD Abadi xixixi. Terakhir, apabila kamu ingin bergabung dengan HMJ, maka kami memberikan undangan terbuka padamu untuk bergabung dalam keluarga Komnasinfo~",
    ],
    signature: 'Krisnanda',
  },
  teamLetters: [
    {
      sender: "Fisah",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#29382F",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Fisah belum diisi.]",
    },
    {
      sender: "Alvin",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#687B61",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Alvin belum diisi.]",
    },
    {
      sender: "Nanda",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#D9C8A5",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Nanda belum diisi.]",
    },
    {
      sender: "Davin",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#A8B5A0",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Davin belum diisi.]",
    },
    {
      sender: "Tara",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#C7D5C1",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Tara belum diisi.]",
    },
    {
      sender: "Kia",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#29382F",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Kia belum diisi.]",
    },
    {
      sender: "Ary",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#687B61",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Ary belum diisi.]",
    },
    {
      sender: "William",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#D9C8A5",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari William belum diisi.]",
    },
    {
      sender: "Natha",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#A8B5A0",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Natha belum diisi.]",
    },
    {
      sender: "Zahra",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#C7D5C1",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Zahra belum diisi.]",
    },
  ],
  memories: DEFAULT_MEMORIES,
  videoNote: undefined,
  closing: {
    headline: 'Sampai jumpa di bab berikutnya.',
    message: "Semoga pengalaman selama di Chronicle menjadi bekal yang baik untuk perjalananmu selanjutnya. Terima kasih sudah pernah menjadi bagian dari cerita ini, Sebas.",
    sender: 'Komnasinfo & Chronicle',
    period: 'Periode Magang Chronicle',
  },
};

// ---------------------------------------------------------------------------
// 2. Zakia Azzahra Citra
// ---------------------------------------------------------------------------
export const RECIPIENT_KIA: RecipientData = {
  token: "fd238adccd0a98bd08ee7ce750a061ab",
  recipient: {
    name: "Zakia Azzahra Citra",
    nickname: "Kia",
  },
  theme: {
    background: '#F7F3EA',
    accent: '#687B61',
  },
  flower: 'carnation',
  greeting: {
    headline: "Hello, Kia!",
    quote: 'Setiap pertemuan meninggalkan cerita yang layak dikenang.',
    message: "Terima kasih sudah menjadi bagian dari perjalanan magang Chronicle. Ada beberapa pesan kecil yang ingin kami tinggalkan untukmu.",
  },
  facilitatorLetter: {
    sender: 'Krisnanda',
    role: 'Fasilitator Magang Chronicle',
    salutation: "Untuk Kia,",
    paragraphs: [
      "Haloo Kia! Pertama kali, aku mau ucapin terima kasih karena telah bergabung dalam perjalanan magang kita di Chronicle. Sebenarnya bukan milih sih, aku dan Fisah yang memilihmu untuk join bareng kita. Kami sudah rapatkan bersama Pendpro dan Pengmas, dan sepakat mengundangmu magang bersama Chronicle. Aku harap kamu tidak marah xixixi. Semoga magang bersama kita tidak membuatmu kecewa dan sebaliknya memberimu rasa nyaman ehe. Pokoknya next kalau mau join HMJ, pintu Komnasinfo akan selalu terbuka untukmu~",
    ],
    signature: 'Krisnanda',
  },
  teamLetters: [
    {
      sender: "Fisah",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#29382F",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Fisah belum diisi.]",
    },
    {
      sender: "Alvin",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#687B61",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Alvin belum diisi.]",
    },
    {
      sender: "Nanda",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#D9C8A5",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Nanda belum diisi.]",
    },
    {
      sender: "Davin",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#A8B5A0",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Davin belum diisi.]",
    },
    {
      sender: "Tara",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#C7D5C1",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Tara belum diisi.]",
    },
    {
      sender: "Kia",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#29382F",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Kia belum diisi.]",
    },
    {
      sender: "Ary",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#687B61",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Ary belum diisi.]",
    },
    {
      sender: "William",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#D9C8A5",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari William belum diisi.]",
    },
    {
      sender: "Natha",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#A8B5A0",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Natha belum diisi.]",
    },
    {
      sender: "Zahra",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#C7D5C1",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Zahra belum diisi.]",
    },
  ],
  memories: DEFAULT_MEMORIES,
  videoNote: undefined,
  closing: {
    headline: 'Sampai jumpa di bab berikutnya.',
    message: "Semoga pengalaman selama di Chronicle menjadi bekal yang baik untuk perjalananmu selanjutnya. Terima kasih sudah pernah menjadi bagian dari cerita ini, Kia.",
    sender: 'Komnasinfo & Chronicle',
    period: 'Periode Magang Chronicle',
  },
};

// ---------------------------------------------------------------------------
// 3. Muhamad Hanif Pardi
// ---------------------------------------------------------------------------
export const RECIPIENT_HANIF: RecipientData = {
  token: "ef12817427d2bab28f50dc84cdc16d03",
  recipient: {
    name: "Muhamad Hanif Pardi",
    nickname: "Hanif",
  },
  theme: {
    background: '#F7F3EA',
    accent: '#687B61',
  },
  greeting: {
    headline: "Hello, Hanif!",
    quote: 'Setiap pertemuan meninggalkan cerita yang layak dikenang.',
    message: "Terima kasih sudah menjadi bagian dari perjalanan magang Chronicle. Ada beberapa pesan kecil yang ingin kami tinggalkan untukmu.",
  },
  facilitatorLetter: {
    sender: 'Krisnanda',
    role: 'Fasilitator Magang Chronicle',
    salutation: "Untuk Hanif,",
    paragraphs: [
      "Haloo Hanif! eh, Pardi? Yang mana aja boleh lah ya wkwk. Pertama aku mau ucapin terima kasih karena telah bergabung dalam perjalanan magang bersama kita di Chronicle. Aku harap semua pengalaman dan pelajaran yang kamu alami selama rangkaian kegiatan magang ini dapat berguna untukmu kedepannya. Semangat dalam menjalani pendidikan kedokteran. Dan apabila dalam perjalananmu kamu memilih untuk bergabung dengan HMJ Kedokteran, maka ini adalah undangan terbuka untukmu bergabung bersama keluarga Komnasinfo~",
    ],
    signature: 'Krisnanda',
  },
  teamLetters: [
    {
      sender: "Fisah",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#29382F",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Fisah belum diisi.]",
    },
    {
      sender: "Alvin",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#687B61",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Alvin belum diisi.]",
    },
    {
      sender: "Nanda",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#D9C8A5",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Nanda belum diisi.]",
    },
    {
      sender: "Davin",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#A8B5A0",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Davin belum diisi.]",
    },
    {
      sender: "Tara",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#C7D5C1",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Tara belum diisi.]",
    },
    {
      sender: "Kia",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#29382F",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Kia belum diisi.]",
    },
    {
      sender: "Ary",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#687B61",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Ary belum diisi.]",
    },
    {
      sender: "William",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#D9C8A5",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari William belum diisi.]",
    },
    {
      sender: "Natha",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#A8B5A0",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Natha belum diisi.]",
    },
    {
      sender: "Zahra",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#C7D5C1",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Zahra belum diisi.]",
    },
  ],
  memories: DEFAULT_MEMORIES,
  videoNote: undefined,
  closing: {
    headline: 'Sampai jumpa di bab berikutnya.',
    message: "Semoga pengalaman selama di Chronicle menjadi bekal yang baik untuk perjalananmu selanjutnya. Terima kasih sudah pernah menjadi bagian dari cerita ini, Hanif.",
    sender: 'Komnasinfo & Chronicle',
    period: 'Periode Magang Chronicle',
  },
};

// ---------------------------------------------------------------------------
// 4. I Made Adi Jaya Saputra
// ---------------------------------------------------------------------------
export const RECIPIENT_ADI: RecipientData = {
  token: "ab516a69ab76a5464eb8bb925d47ed27",
  recipient: {
    name: "I Made Adi Jaya Saputra",
    nickname: "Adi",
  },
  theme: {
    background: '#F7F3EA',
    accent: '#687B61',
  },
  flower: 'matahari',
  greeting: {
    headline: "Hello, Adi!",
    quote: 'Setiap pertemuan meninggalkan cerita yang layak dikenang.',
    message: "Terima kasih sudah menjadi bagian dari perjalanan magang Chronicle. Ada beberapa pesan kecil yang ingin kami tinggalkan untukmu.",
  },
  facilitatorLetter: {
    sender: 'Krisnanda',
    role: 'Fasilitator Magang Chronicle',
    salutation: "Untuk Adi,",
    paragraphs: [
      "Halo Adi! Pertama aku mau ucapin terima kasih karena telah bergabung dalam perjalanan magang bersama kita di Chronicle. Terima kasih atas semua keaktifanmu selama kegiatan magang ini. Semoga semua yang telah kamu pelajari dan alami selama rangkaian magang ini dapat berguna untukmu kedepannya. Apabila kedepannya kamu ingin bergabung dengan HMJ, kami akan mengundangmu secara terbuka untuk bergabung dalam keluarga Komnasinfo~",
    ],
    signature: 'Krisnanda',
  },
  teamLetters: [
    {
      sender: "Fisah",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#29382F",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Fisah belum diisi.]",
    },
    {
      sender: "Alvin",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#687B61",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Alvin belum diisi.]",
    },
    {
      sender: "Nanda",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#D9C8A5",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Nanda belum diisi.]",
    },
    {
      sender: "Davin",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#A8B5A0",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Davin belum diisi.]",
    },
    {
      sender: "Tara",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#C7D5C1",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Tara belum diisi.]",
    },
    {
      sender: "Kia",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#29382F",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Kia belum diisi.]",
    },
    {
      sender: "Ary",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#687B61",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Ary belum diisi.]",
    },
    {
      sender: "William",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#D9C8A5",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari William belum diisi.]",
    },
    {
      sender: "Natha",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#A8B5A0",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Natha belum diisi.]",
    },
    {
      sender: "Zahra",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#C7D5C1",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Zahra belum diisi.]",
    },
  ],
  memories: DEFAULT_MEMORIES,
  videoNote: undefined,
  closing: {
    headline: 'Sampai jumpa di bab berikutnya.',
    message: "Semoga pengalaman selama di Chronicle menjadi bekal yang baik untuk perjalananmu selanjutnya. Terima kasih sudah pernah menjadi bagian dari cerita ini, Adi.",
    sender: 'Komnasinfo & Chronicle',
    period: 'Periode Magang Chronicle',
  },
};

// ---------------------------------------------------------------------------
// 5. Qonitah Qurrotu'ain
// ---------------------------------------------------------------------------
export const RECIPIENT_NITA: RecipientData = {
  token: "7b7d76113567b21c9629cc55c59c6a6c",
  recipient: {
    name: "Qonitah Qurrotu'ain",
    nickname: "Nita",
  },
  theme: {
    background: '#F7F3EA',
    accent: '#687B61',
  },
  flower: 'carnation',
  greeting: {
    headline: "Hello, Nita!",
    quote: 'Setiap pertemuan meninggalkan cerita yang layak dikenang.',
    message: "Terima kasih sudah menjadi bagian dari perjalanan magang Chronicle. Ada beberapa pesan kecil yang ingin kami tinggalkan untukmu.",
  },
  facilitatorLetter: {
    sender: 'Krisnanda',
    role: 'Fasilitator Magang Chronicle',
    salutation: "Untuk Nita,",
    paragraphs: [
      "Halo Nita! Pertama aku mau ucapin terima kasih karena telah bergabung dalam perjalanan magang bersama kita di Chronicle. Aku mau apresiasi atas semua keaktifanmu selama kegiatan magang ini. Jiwa ekstrovertmu menyinar terlalu terang bagiku xixixi. Aku harap kamu nyaman dan have fun selama kegiatan magang ini. Maaf karena fasil kalian hilang selama magang hehe. Semoga kamu bisa mendapat pengalaman yang baik selama magang, dan apabila dirimu memilih untuk lanjut bersama Komnasinfo, kami pasti menyambutmu dengan tangan terbuka ^^",
    ],
    signature: 'Krisnanda',
  },
  teamLetters: [
    {
      sender: "Fisah",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#29382F",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Fisah belum diisi.]",
    },
    {
      sender: "Alvin",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#687B61",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Alvin belum diisi.]",
    },
    {
      sender: "Nanda",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#D9C8A5",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Nanda belum diisi.]",
    },
    {
      sender: "Davin",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#A8B5A0",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Davin belum diisi.]",
    },
    {
      sender: "Tara",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#C7D5C1",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Tara belum diisi.]",
    },
    {
      sender: "Kia",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#29382F",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Kia belum diisi.]",
    },
    {
      sender: "Ary",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#687B61",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Ary belum diisi.]",
    },
    {
      sender: "William",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#D9C8A5",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari William belum diisi.]",
    },
    {
      sender: "Natha",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#A8B5A0",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Natha belum diisi.]",
    },
    {
      sender: "Zahra",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#C7D5C1",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Zahra belum diisi.]",
    },
  ],
  memories: DEFAULT_MEMORIES,
  videoNote: undefined,
  closing: {
    headline: 'Sampai jumpa di bab berikutnya.',
    message: "Semoga pengalaman selama di Chronicle menjadi bekal yang baik untuk perjalananmu selanjutnya. Terima kasih sudah pernah menjadi bagian dari cerita ini, Nita.",
    sender: 'Komnasinfo & Chronicle',
    period: 'Periode Magang Chronicle',
  },
};

// ---------------------------------------------------------------------------
// 6. Putu Eka Yoga Pradita
// ---------------------------------------------------------------------------
export const RECIPIENT_YOGA: RecipientData = {
  token: "40743bd0891c07b6a92e14be0cac6c2c",
  recipient: {
    name: "Putu Eka Yoga Pradita",
    nickname: "Yoga",
  },
  theme: {
    background: '#F7F3EA',
    accent: '#687B61',
  },
  flower: 'matahari',
  greeting: {
    headline: "Hello, Yoga!",
    quote: 'Setiap pertemuan meninggalkan cerita yang layak dikenang.',
    message: "Terima kasih sudah menjadi bagian dari perjalanan magang Chronicle. Ada beberapa pesan kecil yang ingin kami tinggalkan untukmu.",
  },
  facilitatorLetter: {
    sender: 'Krisnanda',
    role: 'Fasilitator Magang Chronicle',
    salutation: "Untuk Yoga,",
    paragraphs: [
      "Halo Yoga! Pertama aku mau ucapin terima kasih karena telah bergabung dalam perjalanan magang bersama kita di Chronicle. Aku harap disini kamu bisa mencapai apa yang kamu inginkan, dan mempelajari semua yang ingin kamu pelajari. Hidup ini memberikan kita berbagai kesempatan yang dapat kamu coba. Dan kami Komnasinfo akan memberikan Kesempatan sebanyak apapun itu padamu",
    ],
    signature: 'Krisnanda',
  },
  teamLetters: [
    {
      sender: "Fisah",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#29382F",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Fisah belum diisi.]",
    },
    {
      sender: "Alvin",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#687B61",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Alvin belum diisi.]",
    },
    {
      sender: "Nanda",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#D9C8A5",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Nanda belum diisi.]",
    },
    {
      sender: "Davin",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#A8B5A0",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Davin belum diisi.]",
    },
    {
      sender: "Tara",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#C7D5C1",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Tara belum diisi.]",
    },
    {
      sender: "Kia",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#29382F",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Kia belum diisi.]",
    },
    {
      sender: "Ary",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#687B61",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Ary belum diisi.]",
    },
    {
      sender: "William",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#D9C8A5",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari William belum diisi.]",
    },
    {
      sender: "Natha",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#A8B5A0",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Natha belum diisi.]",
    },
    {
      sender: "Zahra",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#C7D5C1",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Zahra belum diisi.]",
    },
  ],
  memories: DEFAULT_MEMORIES,
  videoNote: undefined,
  closing: {
    headline: 'Sampai jumpa di bab berikutnya.',
    message: "Semoga pengalaman selama di Chronicle menjadi bekal yang baik untuk perjalananmu selanjutnya. Terima kasih sudah pernah menjadi bagian dari cerita ini, Yoga.",
    sender: 'Komnasinfo & Chronicle',
    period: 'Periode Magang Chronicle',
  },
};

// ---------------------------------------------------------------------------
// 7. Si Putu Ngurah Bagus Angga Prawira
// ---------------------------------------------------------------------------
export const RECIPIENT_WAH_ANGGA: RecipientData = {
  token: "176699f6e30c3ca830228d57e4e9e2a2",
  recipient: {
    name: "Si Putu Ngurah Bagus Angga Prawira",
    nickname: "Wah Angga",
  },
  theme: {
    background: '#F7F3EA',
    accent: '#687B61',
  },
  flower: 'matahari',
  greeting: {
    headline: "Hello, Wah Angga!",
    quote: 'Setiap pertemuan meninggalkan cerita yang layak dikenang.',
    message: "Terima kasih sudah menjadi bagian dari perjalanan magang Chronicle. Ada beberapa pesan kecil yang ingin kami tinggalkan untukmu.",
  },
  facilitatorLetter: {
    sender: 'Krisnanda',
    role: 'Fasilitator Magang Chronicle',
    salutation: "Untuk Wah Angga,",
    paragraphs: [
      "Haloo Wah Angga! Wahh, aku tahu bahwa semua insan pada hakikatnya unik, tapi baru kali ini aku ketemu orang seperti ini wkwkwk. Aku mau ucapin terima kasih karena telah bergabung dalam perjalanan magang bersama kita di Chronicle. Aku harap kamu mendapat pengalaman yang baik selama magang bersama kita. Kalau kamu berminat belajar tentang website, aku bisa ajarin Coding dari awal secara eksklusif lhoo wkwk. Pelajaran yang bahkan bisa dipahami oleh mahasiswa kedokteran pastinya. Sebagai penutup, apabila kamu berniat melanjutkan bersama Komnasinfo, kami akan selalu menyambutmu~",
    ],
    signature: 'Krisnanda',
  },
  teamLetters: [
    {
      sender: "Fisah",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#29382F",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Fisah belum diisi.]",
    },
    {
      sender: "Alvin",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#687B61",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Alvin belum diisi.]",
    },
    {
      sender: "Nanda",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#D9C8A5",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Nanda belum diisi.]",
    },
    {
      sender: "Davin",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#A8B5A0",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Davin belum diisi.]",
    },
    {
      sender: "Tara",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#C7D5C1",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Tara belum diisi.]",
    },
    {
      sender: "Kia",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#29382F",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Kia belum diisi.]",
    },
    {
      sender: "Ary",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#687B61",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Ary belum diisi.]",
    },
    {
      sender: "William",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#D9C8A5",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari William belum diisi.]",
    },
    {
      sender: "Natha",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#A8B5A0",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Natha belum diisi.]",
    },
    {
      sender: "Zahra",
      role: "Anggota Chronicle",
      avatar: null,
      accent: "#C7D5C1",
      // TODO: Replace this placeholder with the sender's approved message.
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Pesan dari Zahra belum diisi.]",
    },
  ],
  memories: DEFAULT_MEMORIES,
  videoNote: undefined,
  closing: {
    headline: 'Sampai jumpa di bab berikutnya.',
    message: "Semoga pengalaman selama di Chronicle menjadi bekal yang baik untuk perjalananmu selanjutnya. Terima kasih sudah pernah menjadi bagian dari cerita ini, Wah Angga.",
    sender: 'Komnasinfo & Chronicle',
    period: 'Periode Magang Chronicle',
  },
};

// ---------------------------------------------------------------------------
// Testing & Backward-Compatibility Fixtures
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
  flower: ['carnation', 'matahari'],
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
  ],
  videoNote: {
    note: 'Ruang untuk video kenangan. Video akan tampil di sini jika ditambahkan ke data cerita.',
  },
  closing: {
    headline: 'Sampai jumpa di bab berikutnya.',
    message:
      'Terus bertumbuh, terus berkarya, dan jangan ragu menulis ceritamu sendiri. Terima kasih sudah menjadi bagian dari Chronicle.',
    sender: 'Tim Komnasinfo / Chronicle',
    period: 'Periode magang 2025',
  },
};

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
    headline: 'A letter for Budi',
    quote: 'What we take with us is defined by who we walked alongside.',
    message:
      'Hello, Budi! As your internship comes to a close, we wanted to take a moment to reflect on everything we built and shared together.',
  },
  facilitatorLetter: {
    sender: 'Krisnanda',
    role: 'Facilitator & Lead',
    salutation: 'Dear Budi,',
    paragraphs: [
      'From day one, you brought steady determination and a sharp analytical mind to every task.',
    ],
    signature: 'Krisnanda',
  },
  teamLetters: [
    {
      sender: 'Bambang Wijaya',
      role: 'Head of Komnasinfo',
      avatar: '/see-you/assets/photos/bambang.webp',
      accent: '#29382F',
      message: 'Budi, your technical diligence and positive attitude will be deeply missed.',
    },
  ],
  memories: [],
  videoNote: undefined,
  closing: {
    headline: 'Until We Meet Again',
    message: 'Thank you for being an indispensable part of Komnasinfo.',
    sender: 'Komnasinfo & Chronicle',
    period: 'Internship Period: August - December 2026',
  },
};

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
    headline: 'A letter for Siti',
    quote: 'Kindness and diligence leave the quietest yet deepest footprints.',
    message: 'Hello, Siti!',
  },
  facilitatorLetter: {
    sender: 'Krisnanda',
    role: 'Facilitator & Lead',
    salutation: 'Dear Siti,',
    paragraphs: ['Your thoughtful contributions brought balance to every team discussion.'],
    signature: 'Krisnanda',
  },
  teamLetters: [
    {
      sender: 'Bambang Wijaya',
      role: 'Head of Komnasinfo',
      avatar: null,
      accent: '#29382F',
      message: 'Siti, your commitment was invaluable to the team.',
    },
  ],
  memories: [],
  videoNote: undefined,
  closing: {
    headline: 'Until We Meet Again',
    message: 'Wishing you peace and success on your continued journey, Siti.',
    sender: 'Komnasinfo & Chronicle',
    period: 'Internship Period: August - December 2026',
  },
};

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
    message: 'Halo Dewi!',
  },
  facilitatorLetter: {
    sender: 'Krisnanda',
    role: 'Facilitator & Lead',
    salutation: 'Dear Dewi 🌸,',
    paragraphs: ['Kehadiranmu selalu membawa keceriaan.'],
    signature: 'Krisnanda',
  },
  teamLetters: [
    {
      sender: 'Ayu Lestari',
      role: 'Project Coordinator',
      avatar: null,
      accent: '#D9C8A5',
      message: 'Terima kasih banyak atas keceriaanmu, Dewi! 🌸',
    },
  ],
  memories: [],
  videoNote: undefined,
  closing: {
    headline: 'Sampai Bertemu Lagi 🌿',
    message: 'Terima kasih telah menjadi bagian berharga dari keluarga Komnasinfo! ✨',
    sender: 'Komnasinfo & Chronicle',
    period: 'Internship Period: August - December 2026',
  },
};

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
    headline: 'Surat untuk Aya',
    quote: 'Setiap pertemuan meninggalkan cerita yang layak dikenang.',
    message: 'Halo, Aya! Terima kasih sudah menjadi bagian dari perjalanan Chronicle.',
  },
  facilitatorLetter: {
    sender: 'Kak Rani',
    role: 'Fasilitator Magang',
    salutation: 'Untuk Aya,',
    paragraphs: ['Terima kasih sudah membawa semangat dan keceriaan di setiap sesi.'],
    signature: 'Kak Rani',
  },
  teamLetters: [
    {
      sender: 'Kak Bima',
      role: 'Anggota Komnasinfo',
      avatar: null,
      accent: '#C7D5C1',
      message: 'Senang sekali pernah satu tim denganmu.',
    },
  ],
  memories: [],
  videoNote: undefined,
  closing: {
    headline: 'Sampai jumpa di bab berikutnya.',
    message: 'Terus bertumbuh dan berkarya.',
    sender: 'Tim Komnasinfo / Chronicle',
    period: 'Periode magang 2025',
  },
};

// ---------------------------------------------------------------------------
// Aggregated Datasets & Token Lookup Maps
// ---------------------------------------------------------------------------
export const RECIPIENTS: RecipientData[] = [
  RECIPIENT_SEBAS,
  RECIPIENT_KIA,
  RECIPIENT_HANIF,
  RECIPIENT_ADI,
  RECIPIENT_NITA,
  RECIPIENT_YOGA,
  RECIPIENT_WAH_ANGGA,
];

export const RECIPIENTS_BY_TOKEN = new Map<string, RecipientData>([
  ...RECIPIENTS.map((recipient): [string, RecipientData] => [recipient.token, recipient]),
  // Backward compatibility & test fixtures
  [RECIPIENT_NADYA.token, RECIPIENT_NADYA],
  [RECIPIENT_BUDI.token, RECIPIENT_BUDI],
  [RECIPIENT_SITI.token, RECIPIENT_SITI],
  [RECIPIENT_DEWI.token, RECIPIENT_DEWI],
  [RECIPIENT_AYA.token, RECIPIENT_AYA],
  ['tok_aya_chronicle', RECIPIENT_AYA],
]);

export const RECIPIENT_REGISTRY: Record<string, RecipientData> = Object.freeze(
  Object.fromEntries(RECIPIENTS_BY_TOKEN)
);
