# Capstone Project - Teori Bahasa dan Otomata

Aplikasi web simulator interaktif untuk empat topik inti mata kuliah Teori Bahasa
dan Otomata: Finite State Automata, Regular Expression, Pushdown Automata &
Context-Free Grammar, serta Hierarki Chomsky & Chomsky Normal Form.

Dibuat sebagai Capstone Project Individu - Semester IV, Tahun Akademik 2025/2026 Genap.

## Identitas

- Nama: Selsa Shafana Alfiyani
- NIM: 301240041
- Mata Kuliah: Teori Bahasa dan Otomata

## Fitur per modul

### 1. Finite State Automata (FSA)
- Definisikan DFA/NFA lewat tabel transisi δ (state × alfabet)
- Tentukan state awal (S) dan state akhir (F) lewat dropdown dan checkbox
- Jalankan simulasi string, hasil langsung terlihat: diterima/ditolak
- Jejak transisi ditampilkan selangkah demi selangkah
- Visualisasi state diagram otomatis (lingkaran dan panah), dilengkapi zoom in/out
- Menampilkan definisi formal lengkap M = (Q, Σ, δ, S, F)

### 2. Regular Expression
- Input pola regex dengan dukungan operator union (|), kleene star (*), grouping (())
- Konversi otomatis pola ke NFA menggunakan Thompson's Construction
- Uji kecocokan string terhadap NFA hasil konversi
- Tabel transisi dan diagram state NFA ditampilkan lengkap
- Aturan produksi grammar reguler setara diturunkan otomatis dari struktur NFA

### 3. Pushdown Automata & Context-Free Grammar
- Input aturan produksi CFG bebas (mendukung produksi ε)
- Uji apakah string dapat diturunkan dari grammar (parsing dengan backtracking)
- Tampilkan proses derivasi leftmost selangkah demi selangkah
- Visualisasi kondisi stack PDA
- Pohon penurunan (parse tree) digambar sebagai diagram grafis, dilengkapi zoom

### 4. Hierarki Chomsky & Bentuk Normal Chomsky
- Klasifikasi otomatis grammar ke dalam tingkat Hierarki Chomsky (Tipe 2/3)
- Konversi grammar ke Bentuk Normal Chomsky (CNF) secara bertahap:
  - Eliminasi produksi ε (nullable)
  - Eliminasi produksi unit
  - Pemisahan simbol terminal pada produksi panjang
  - Pemecahan produksi menjadi bentuk biner (CNF akhir)
- Setiap tahap konversi ditampilkan terpisah agar proses dapat dipelajari

## Tech stack

HTML, CSS, dan JavaScript murni (vanilla), tanpa framework atau library eksternal.
Semua logika (simulasi automata, parsing, konversi CNF, penggambaran diagram SVG)
ditulis sendiri agar aplikasi tidak bergantung pada koneksi internet saat dijalankan.

## Struktur folder

tbo-capstone/
├── src/            → kode utama aplikasi
│   ├── index.html, fsa.html, regex.html, pda.html, chomsky.html
│   ├── css/style.css
│   └── js/          → satu file JS per modul + diagram.js (utilitas gambar bersama)
├── docs/           → proposal mini dan draft laporan
├── tests/          → daftar test case per modul
└── README.md

## Cara menjalankan secara lokal

1. Clone repositori ini:
git clone  https://github.com/SelsaShaf/tbo-capstone.git
2. Buka folder `src/` di VS Code
3. Jalankan `index.html` menggunakan ekstensi Live Server, atau buka langsung file tersebut di browser

Tidak memerlukan instalasi dependency apa pun.

## Live demo

Domain: https://301240041-selsa.my.id/

## Video demo

YouTube:  https://youtu.be/FEqfJNyqTic
