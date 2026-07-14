# Proposal Mini — Capstone Project Teori Bahasa dan Otomata

Nama: Selsa Shafana Alfiyani
NIM: 301240041

## 1. Rancangan Sistem

Aplikasi web ini terdiri atas empat modul yang saling terpisah namun terintegrasi
dalam satu antarmuka navigasi. Setiap modul mengikuti pola yang sama: pengguna
memasukkan definisi mesin/grammar, sistem memproses input tersebut, lalu
menampilkan hasil beserta proses bertahap (trace, derivasi, atau tahapan konversi)
secara visual.

Alur umum aplikasi:

```
Input pengguna (definisi mesin/grammar + string uji)
        ↓
Validasi input (cek kelengkapan dan kesesuaian alfabet/simbol)
        ↓
Proses inti (simulasi FSA / konversi regex / parsing CFG / konversi CNF)
        ↓
Output: status hasil + visualisasi proses (diagram/tabel/pohon)
```

## 2. Diagram State dan Grammar

### Modul FSA
Contoh mesin uji: DFA pengenal string dengan jumlah simbol '1' genap.

```
M = (Q, Σ, δ, S, F)
Q = {q0, q1}
Σ = {0, 1}
δ(q0, 0) = q0     δ(q0, 1) = q1
δ(q1, 0) = q1     δ(q1, 1) = q0
S = q0
F = {q0}
```

### Modul PDA/CFG
Contoh grammar uji: bahasa a^n b^n (jumlah 'a' sama dengan jumlah 'b' berurutan).

```
S → aSb | ab
```

### Modul Chomsky/CNF
Contoh grammar uji sebelum konversi:

```
S → aAb
A → aA | ε
```

## 3. Tech Stack

| Komponen | Pilihan | Alasan |
|---|---|---|
| Bahasa | HTML, CSS, JavaScript (vanilla) | Tidak butuh instalasi dependency, ringan, dapat diakses langsung dari browser tanpa server |
| Visualisasi diagram | SVG dibuat manual dengan JavaScript | Tidak bergantung pada library eksternal/CDN, sehingga tetap berfungsi walau tanpa koneksi internet saat demo |
| Hosting | Vercel / Netlify (gratis) | Mendukung custom domain dan HTTPS otomatis |
| Domain | .my.id via is.my.id | Sesuai ketentuan tugas, gratis |

## 4. Rencana Deploy

1. Push kode ke repositori GitHub publik dengan commit bertahap per modul
2. Hubungkan repositori ke Vercel/Netlify untuk mendapatkan hosting otomatis
3. Daftarkan domain gratis di is.my.id
4. Hubungkan domain .my.id sebagai custom domain di dashboard hosting
5. Verifikasi HTTPS aktif dan aplikasi dapat diakses tanpa login
