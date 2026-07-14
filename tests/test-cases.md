# Test Case - Capstone Project Teori Bahasa dan Otomata

Total 40 test case, 10 per modul.

## Modul 1: Finite State Automata

Mesin uji: DFA pengenal string dengan jumlah simbol '1' genap.
Q={q0,q1}, Σ={0,1}, δ(q0,0)=q0, δ(q0,1)=q1, δ(q1,0)=q1, δ(q1,1)=q0, S=q0, F={q0}

| No | Input String | Hasil Diharapkan | Hasil Aktual | Status |
|---|---|---|---|---|
| 1 | (string kosong) | Diterima | (isi setelah pengujian) | |
| 2 | 0 | Diterima | (isi setelah pengujian) | |
| 3 | 1 | Ditolak | (isi setelah pengujian) | |
| 4 | 11 | Diterima | (isi setelah pengujian) | |
| 5 | 111 | Ditolak | (isi setelah pengujian) | |
| 6 | 1010 | Diterima | (isi setelah pengujian) | |
| 7 | 10 | Ditolak | (isi setelah pengujian) | |
| 8 | 0000 | Diterima | (isi setelah pengujian) | |
| 9 | 1001011 | Diterima | (isi setelah pengujian) | |
| 10 | 12a (simbol tidak valid) | Pesan error, bukan diterima/ditolak | (isi setelah pengujian) | |

## Modul 2: Regular Expression

Pola uji utama: `(a|b)*abb`

| No | Pola | Teks Uji | Hasil Diharapkan | Hasil Aktual | Status |
|---|---|---|---|---|---|
| 11 | (a\|b)*abb | abb | Cocok | (isi setelah pengujian) | |
| 12 | (a\|b)*abb | aabb | Cocok | (isi setelah pengujian) | |
| 13 | (a\|b)*abb | babb | Cocok | (isi setelah pengujian) | |
| 14 | (a\|b)*abb | ab | Tidak cocok | (isi setelah pengujian) | |
| 15 | (a\|b)*abb | abab | Tidak cocok | (isi setelah pengujian) | |
| 16 | (a\|b)*abb | (kosong) | Tidak cocok | (isi setelah pengujian) | |
| 17 | (a\|b)*abb | aabba | Tidak cocok | (isi setelah pengujian) | |
| 18 | a*b* | aaabb | Cocok | (isi setelah pengujian) | |
| 19 | a*b* | bbaa | Tidak cocok | (isi setelah pengujian) | |
| 20 | a (pola tidak valid) | apa saja | Pesan error pola tidak valid | (isi setelah pengujian) | |

## Modul 3: Pushdown Automata dan CFG

Grammar uji utama: `S -> aSb | ab`

| No | Grammar | String Uji | Hasil Diharapkan | Hasil Aktual | Status |
|---|---|---|---|---|---|
| 21 | S->aSb\|ab | ab | Diterima | (isi setelah pengujian) | |
| 22 | S->aSb\|ab | aabb | Diterima | (isi setelah pengujian) | |
| 23 | S->aSb\|ab | aaabbb | Diterima | (isi setelah pengujian) | |
| 24 | S->aSb\|ab | a | Ditolak | (isi setelah pengujian) | |
| 25 | S->aSb\|ab | abb | Ditolak | (isi setelah pengujian) | |
| 26 | S->aSb\|ab | ba | Ditolak | (isi setelah pengujian) | |
| 27 | S->aSb\|ab | (kosong) | Ditolak (tidak ada produksi ε) | (isi setelah pengujian) | |
| 28 | S->AB, A->a, B->b | ab | Diterima | (isi setelah pengujian) | |
| 29 | S->aSb\|ab | aaaabbbb | Diterima | (isi setelah pengujian) | |
| 30 | S->aSb\|ab | ac | Ditolak (simbol tidak sesuai grammar) | (isi setelah pengujian) | |

## Modul 4: Hierarki Chomsky dan CNF

| No | Grammar | Hal yang Diuji | Hasil Diharapkan | Hasil Aktual | Status |
|---|---|---|---|---|---|
| 31 | S->aAb, A->aA\|ε | Klasifikasi tipe | Tipe 2 (Bebas Konteks) | (isi setelah pengujian) | |
| 32 | S->aAb, A->aA\|ε | Eliminasi produksi ε | A menghilang dari sisi kanan yang nullable | (isi setelah pengujian) | |
| 33 | S->0S\|1S\|0\|1 | Klasifikasi tipe | Tipe 3 (Reguler) | (isi setelah pengujian) | |
| 34 | S->A, A->a | Eliminasi produksi unit | S langsung menghasilkan a | (isi setelah pengujian) | |
| 35 | S->aAB | Pemisahan simbol terminal | Muncul non-terminal baru pengganti simbol 'a' | (isi setelah pengujian) | |
| 36 | S->aA, A->ε | Penghilangan nullable bukan simbol awal | Produksi tetap konsisten, ε tidak muncul di luar S | (isi setelah pengujian) | |
| 37 | S->AB, A->a, B->b | Grammar sudah CNF | Tidak ada perubahan signifikan pada hasil akhir | (isi setelah pengujian) | |
| 38 | S->A, A->B, B->C, C->c | Eliminasi unit berantai | S akhirnya langsung menghasilkan c | (isi setelah pengujian) | |
| 39 | S->aAB, A->a, B->bb | Pemecahan produksi panjang | Muncul non-terminal bantu agar tiap produksi maksimal 2 simbol | (isi setelah pengujian) | |
| 40 | S->aA, A->aA\|b | Hasil akhir bentuk CNF | Semua produksi berbentuk A→BC atau A→a | (isi setelah pengujian) | |
