# Test Case - Capstone Project Teori Bahasa dan Otomata

Total 40 test case, 10 per modul.

## Modul 1: Finite State Automata

Mesin uji: DFA pengenal string dengan jumlah simbol '1' genap.
Q={q0,q1}, Σ={0,1}, δ(q0,0)=q0, δ(q0,1)=q1, δ(q1,0)=q1, δ(q1,1)=q0, S=q0, F={q0}

| No | Input String | Hasil Diharapkan | Hasil Aktual | Status |
|---|---|---|---|---|
| 1 | (string kosong) | Diterima | Diterima | Sesuai |
| 2 | 0 | Diterima | Diterima | Sesuai |
| 3 | 1 | Ditolak | Ditolak | Sesuai |
| 4 | 11 | Diterima | Diterima | Sesuai |
| 5 | 111 | Ditolak |Ditolak | Sesuai |
| 6 | 1010 | Diterima | Diterima | Sesuai |
| 7 | 10 | Ditolak | Ditolak | Sesuai |
| 8 | 0000 | Diterima | Diterima | Sesuai |
| 9 | 1001011 | Diterima | Diterima | Sesuai |
| 10 | 12a (simbol tidak valid) | Pesan error, bukan diterima/ditolak | Pesan error Simbol "2" bukan bagian dari alfabet| Sesuai |

## Modul 2: Regular Expression

Pola uji utama: `(a|b)*abb`

| No | Pola | Teks Uji | Hasil Diharapkan | Hasil Aktual | Status |
|---|---|---|---|---|---|
| 11 | (a\|b)*abb | abb | Cocok | Cocok | Sesuai |
| 12 | (a\|b)*abb | aabb | Cocok | Cocok | Sesuai |
| 13 | (a\|b)*abb | babb | Cocok | Cocok | Sesuai |
| 14 | (a\|b)*abb | ab | Tidak cocok | Tidak cocok | Sesuai |
| 15 | (a\|b)*abb | abab | Tidak cocok | Tidak cocok | Sesuai |
| 16 | (a\|b)*abb | (kosong) | Tidak cocok | Tidak cocok | Sesuai |
| 17 | (a\|b)*abb | aabba | Tidak cocok | Tidak cocok | Sesuai |
| 18 | a*b* | aaabb | Cocok | Tidak cocok | Tidak sesuai|
| 19 | a*b* | bbaa | Tidak cocok | Tidak cocok | Sesuai |
| 20 | a( (pola tidak valid) | Pesan error | Pesan error | Sesuai |

## Modul 3: Pushdown Automata dan CFG

Grammar uji utama: `S -> aSb | ab`

| No | Grammar | String Uji | Hasil Diharapkan | Hasil Aktual | Status |
|---|---|---|---|---|---|
| 21 | S->aSb\|ab | ab | Diterima | Diterima | Sesuai |
| 22 | S->aSb\|ab | aabb | Diterima | Diterima | Sesuai |
| 23 | S->aSb\|ab | aaabbb | Diterima | Diterima | Sesuai |
| 24 | S->aSb\|ab | a | Ditolak | Ditolak | Sesuai |
| 25 | S->aSb\|ab | abb | Ditolak | Ditolak | Sesuai |
| 26 | S->aSb\|ab | ba | Ditolak | Ditolak | Sesuai |
| 27 | S->aSb\|ab | (kosong) | Ditolak (tidak ada produksi ε) |Ditolak | Sesuai |
| 28 | S->AB, A->a, B->b | ab | Diterima | Ditolak | Tidak Sesuai |
| 29 | S->aSb\|ab | aaaabbbb | Diterima | Diterima | Sesuai |
| 30 | S->aSb\|ab | ac | Ditolak (simbol tidak sesuai grammar) | Ditolak | Sesuai |

## Modul 4: Hierarki Chomsky dan CNF

| No | Grammar | Hal yang Diuji | Hasil Diharapkan | Hasil Aktual | Status |
|---|---|---|---|---|---|
| 31 | S->aAb, A->aA\|ε | Klasifikasi tipe | Tipe 2 (Bebas Konteks) | Grammar diklasifikasikan sebagai Tipe 2 (Context-Free) | Sesuai |
| 32 | S->aAb, A->aA\|ε | Eliminasi produksi ε | A menghilang dari sisi kanan yang nullable | Produksi A->ε dihapus; A tidak lagi muncul sebagai nullable setelah tahap eliminasi ε | Sesuai |
| 33 | S->0S\|1S\|0\|1 | Klasifikasi tipe | Tipe 3 (Reguler) | Grammar diklasifikasikan sebagai Tipe 3 (Regular) | Sesuai |
| 34 | S->A, A->a | Eliminasi produksi unit | S langsung menghasilkan a | Produksi unit S->A dihapus, diganti langsung menjadi S->a | Sesuai |
| 35 | S->aAB | Pemisahan simbol terminal | Muncul non-terminal baru pengganti simbol 'a' | Simbol terminal a pada produksi digantikan non-terminal bantu baru | Sesuai |
| 36 | S->aA, A->ε | Penghilangan nullable bukan simbol awal | Produksi tetap konsisten, ε tidak muncul di luar S | Setelah eliminasi ε, tidak ada produksi ε tersisa pada simbol non-terminal selain kemungkinan S | Sesuai |
| 37 | S->AB, A->a, B->b | Grammar sudah CNF | Tidak ada perubahan signifikan pada hasil akhir | Grammar tetap dalam struktur yang sama karena sudah memenuhi bentuk CNF sejak awal | Sesuai |
| 38 | S->A, A->B, B->C, C->c | Eliminasi unit berantai | S akhirnya langsung menghasilkan c | Rantai unit production disederhanakan bertahap hingga S terhubung langsung ke simbol akhir rantai | Sesuai |
| 39 | S->aAB, A->a, B->bb | Pemecahan produksi panjang | Muncul non-terminal bantu agar tiap produksi maksimal 2 simbol | Produksi dengan ruas kanan lebih dari dua simbol dipecah menjadi rangkaian produksi biner dengan non-terminal bantu | Sesuai |
| 40 | S->aA, A->aA\|b | Hasil akhir bentuk CNF | Semua produksi berbentuk A→BC atau A→a | Seluruh produksi pada grammar akhir berbentuk A->BC (dua non-terminal) atau A->a (satu terminal) | Sesuai |
