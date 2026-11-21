# Cari Bedanya!

[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/luthiiiialvaro/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/luthiiiialvaro/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

Dua gambar hampir sama — temukan perbedaannya sebelum waktu habis! Sebuah game
spot-the-difference orisinal dengan 3 adegan yang digambar tangan sebagai SVG:
**Kebun Pagi** (6 perbedaan), **Kamar Kucing** (7 perbedaan), dan **Pantai Senja**
(7 perbedaan) — total 20 perbedaan tersembunyi.

## Cara main

- **Klik** perbedaan di gambar A atau B untuk menandainya — cincin hijau dan
  tanda centang muncul di kedua gambar.
- **Keyboard juga bisa**: tombol panah menggerakkan bidikan, Enter/Spasi
  menandai, H petunjuk, P jeda, R ulangi adegan, M bisu.
- Setiap temuan +100 poin (beruntun tanpa meleset menambah bonus), bonus waktu
  saat adegan selesai. Klik yang meleset −2 detik, petunjuk −5 detik (3× per
  adegan). Waktu tiap adegan makin ketat: 120 → 100 → 90 detik.

## Mainkan

Tidak perlu build: sajikan folder `game/` dengan server statis apa pun, lalu
buka `game/index.html` di Chrome desktop. Semua gambar, suara (WebAudio),
dan font berasal dari file di dalam `game/` — tanpa jaringan.

```sh
cd game && python3 -m http.server 8080
# buka http://localhost:8080
```

## Struktur

```
main.ts            # entrypoint: salin game/ + screenshots/ ke /output, tulis dossier.json
game/
  index.html       # halaman + HUD + layar judul/menang/kalah
  style.css        # tampilan, penanda, animasi
  src/
    scenes.js      # 3 adegan SVG orisinal + definisi 20 perbedaan
    render.js      # membangun dua panel + menggambar penanda/petunjuk/bidikan
    game.js        # state: adegan, timer, skor, petunjuk, layar
    input.js       # klik mouse + keyboard
    audio.js       # efek suara WebAudio (tanpa file audio)
    main.js        # bootstrap + mode demo untuk screenshot (?scene&found&demo)
vendor/
  makefun-game.ts  # salinan kit (tidak diubah) untuk menulis dossier.json
screenshots/        # 4 tangkapan layar asli dari game yang berjalan
```

Dibuat untuk [make.fun bounty best-spot-the-difference-game-20261121-0451](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451).
