# 💰 Dompet Ku — Expense Tracker

Aplikasi pencatat transaksi keuangan pribadi berbasis **React Native (Expo)**.

---

## 📱 Demo & Screenshot

### 🔗 Expo Snack
> Tempel link Expo Snack kamu di sini:

**[▶ Buka di Expo Snack](https://snack.expo.dev/@gio122/pencatat-keuangan?platform=android)**

---

### 📸 Screenshot Aplikasi

| Tampilan Utama | Tambah Transaksi | Riwayat Transaksi |
|:-:|:-:|:-:|
| ![Tampilan Utama](./DompetKu/screenshots/home.jpeg) | ![Form Input](./DompetKu/screenshots/input.jpeg) | ![Riwayat](./DompetKu/screenshots/riwayat.jpeg) |

> 📁 Simpan screenshot kamu di folder `screenshots/` dengan nama `home.jpeg`, `input.jpeg`, dan `riwayat.jpeg`

---

## ✅ Fitur

- **Header Saldo** — Total saldo otomatis berubah saat transaksi ditambah
- **Ringkasan** — Total Pemasukan & Pengeluaran ditampilkan di kartu atas
- **Form Input** — Deskripsi + Nominal dengan 2 tombol (Pemasukan / Pengeluaran)
- **Riwayat Transaksi** — `FlatList` dengan kartu per transaksi
- **Warna Kondisional** — 🟢 Hijau untuk pemasukan, 🔴 Merah untuk pengeluaran
- **Hapus Transaksi** — Long press kartu untuk menghapus

---

## 🚀 Cara Menjalankan

### Prasyarat
Pastikan sudah terinstall:
- [Node.js](https://nodejs.org/) versi 18 atau lebih baru
- [npm](https://www.npmjs.com/) (sudah termasuk dalam Node.js)



Setelah muncul QR Code di terminal:

| Platform | Cara |
|----------|------|
| **Android (HP fisik)** | Install **Expo Go** di Play Store → Scan QR Code |
| **iOS (HP fisik)** | Install **Expo Go** di App Store → Scan QR Code |
| **Android Emulator** | Buka Android Studio → jalankan emulator → tekan `a` |
| **Browser (Web)** | Tekan `w` di terminal |

---



## 🧠 Logika State

```js
// State utama untuk menyimpan semua transaksi
const [transaksi, setTransaksi] = useState([
  { id: '1', ket: 'Uang Saku', nominal: 100000, tipe: 'masuk' },
  { id: '2', ket: 'Beli Cilok', nominal: 10000, tipe: 'keluar' },
]);

// Hitung total saldo dengan reduce
const totalSaldo = transaksi.reduce((acc, item) => {
  return item.tipe === 'masuk' ? acc + item.nominal : acc - item.nominal;
}, 0);

// Tambah transaksi baru (prepend supaya muncul di atas)
const tambahTransaksi = (tipe) => {
  const baru = { id: generateId(), ket: deskripsi, nominal, tipe };
  setTransaksi([baru, ...transaksi]);
};
```

---

## 🛠️ Troubleshooting

**`npx expo start` error "Unable to find expo"**
→ Jalankan `npm install` terlebih dahulu

**QR Code tidak bisa di-scan**
→ Pastikan HP dan laptop terhubung ke WiFi yang sama

**Metro bundler hang**
→ Tekan `r` untuk reload, atau `Ctrl+C` lalu `npx expo start` lagi

---

Dibuat dengan ❤️ menggunakan React Native + Expo
