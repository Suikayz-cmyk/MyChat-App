# MyChatApp

## Informasi Mahasiswa 
- Nama: Muhammad Prayogo Pangestu
- Nim : 2410501046
- Program Studi: D3 Sistem Informasi

## Deskripsi App
MyChatApp merupakan aplikasi chat mobile sederhana berbasis React Native dan Firebase yang mendukung fitur realtime chat antar user.

Aplikasi ini memungkinkan user untuk:
- registrasi akun
- login/logout
- melihat daftar user
- mengirim pesan realtime
- melihat status online/offline user
- menggunakan avatar profile otomatis

## Fitur Aplikasi

### Authentication
- Register akun
- Login akun
- Logout akun
- Session login Firebase

### Realtime Chat
- Kirim pesan realtime
- Update chat otomatis tanpa refresh
- Bubble chat kanan/kiri
- Timestamp chat

### User System
- Daftar user realtime
- Status online/offline basic
- Header profile user

### Avatar Profile
- Avatar otomatis menggunakan DiceBear API
- Nama profile otomatis dari email jika nama tidak diisi
- User dapat mengisi nama custom saat register

### Upload Foto Profile
Fitur upload foto profile diimplementasikan menggunakan Firebase Storage.
Namun pada Firebase Spark Plan (free), Firebase Storage membutuhkan upgrade ke Blaze Plan sehingga upload foto belum dapat digunakan sepenuhnya.
Flow upload tetap tersedia dan siap digunakan kalau Firebase Storage diaktifkan.

## Tech Stack

### Frontend
- React Native
- Expo

### Backend / Cloud
- Firebase Authentication
- Firebase Firestore
- Firebase Storage

### Library
- React Navigation
- Expo Image Picker
- date-fns

## Screenshot

### Register Screen
<img width="200"  alt="WhatsApp Image 2026-05-21 at 21 11 33" src="https://github.com/user-attachments/assets/15d526f9-85c6-40fa-9c20-4ffe73f5f5d2" />

## Login Screen
<img width="200"  alt="WhatsApp Image 2026-05-21 at 21 11 34" src="https://github.com/user-attachments/assets/dbffbb24-ee7e-44bb-8231-25ec8cf24a54" />

### User List Screen
<img width="200" alt="WhatsApp Image 2026-05-21 at 21 11 34 (1)" src="https://github.com/user-attachments/assets/479abf83-b210-40d6-8595-240b2a545b51" />

### Chat Screen
<img width="200" alt="WhatsApp Image 2026-05-21 at 21 11 35" src="https://github.com/user-attachments/assets/bf4afc5f-e325-44ef-8b77-ef2901c233c2" />

## Cara Menjalankan

1. Clone Repository
git clone <repository-url>

2. Install Dependency
npm install

3. Setup Firebase

Buat file .env lalu isi konfigurasi Firebase:

- EXPO_PUBLIC_FIREBASE_API_KEY=
- EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
- EXPO_PUBLIC_FIREBASE_PROJECT_ID=
- EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
- EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
- EXPO_PUBLIC_FIREBASE_APP_ID=
  
4. Jalankan Expo
- npx expo start


