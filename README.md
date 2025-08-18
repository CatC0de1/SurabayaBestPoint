# Directory Listing App, Surabaya BestPoint

Website SSR (Server Side Rendering) menggunakan Express.js dan EJS (Embedded JavaScript). Website ini dibuat atas latihan studi kasus Directory Listing App dengan Express.js di bootcamp Codepolitan Devhandal. Fitur-fitur website ini meliputi:
- Autentikasi (login, register, logout) dan session dengan passport.js
- Operasi CRUD file images dengan multer.js
- Validasi di sisi client dan server
- Fitur memosting place sebagai BestPoint
- Fitur memberi review pada suatu place
- Fitur mengedit dan menghapus place, account, atau review untuk pemilik
- Query param pagination, sorting berdasarkan urutan waktu, sorting berdasarkan rating, serta searching.
- Penggunaan UI dinamis dan responsive dengan Bootstrap 5

---

## Pengenalan per Branch

1. **[simple](https://github.com/CatC0de1/SurabayaBestPoint/tree/simple)**<br/>
    Versi project yang hanya memiliki fitur CRUD pada place dan auth basic secara hardcoded. Ditunjukkan kepada tugas akhir Basis Data di Universitas Negeri Surabaya 

2. **[advance](https://github.com/CatC0de1/SurabayaBestPoint/tree/advance)**<br/>
    Versi project yang hanya memiliki fitur lengkap sesuai dengan fitur yang dijelaskan dan memiliki versi paling mutakhir

3. **[main](https://github.com/CatC0de1/SurabayaBestPoint/tree/main)**<br/>
    Versi project yang up to date terhadap branch advance serta di deploy pada render dengan url berikut, https://surabayabestpoint.onrender.com/ 

## Tools yang Dibutuhkan

1. [Node.js](https://nodejs.org/) (disarankan versi 18+) sebagai runtime environment
2. [npm](https://www.npmjs.com/) atau [yarn](https://yarnpkg.com/) sebagai package manager
3. [nodemon](https://nodemon.io/) sebagai hot reload

---

## Instalasi

1. **Clone repository**
    ```bash
    git clone https://github.com/CatC0de1/SurabayaBestPoint.git
    cd nama-project
    ```

2. **Instal dependencies**
    Jika menggunakan npm:
    ```bash
    npm install
    ```

    Atau jika menggunakan yarn:
    ```bash
    yarn install
    ```
    
3. **Konfigurasi environment**
    Buat file `.env` dengan nama variable seperti pada contoh `.env.example`
    ```env
    DATABASE="DATABASE_NAME"
    SESSION="SESSION_SECRET"
    RECAPTCHA_SECRET_KEY="RECAPTCHA_SECRET_KEY"
    PORT=3000
    ```
    Isi variable `.env` sesuai dengan kebutuhan.

---

## Menjalankan Project

1. **Mode development**
    Jika menggunakan npm:
    ```bash
    npm run dev
    ```

    Atau jika menggunakan yarn:
    ```bash
    yarn dev
    ```

2. **Mode build**
    Jika menggunakan npm:
    ```bash
    npm run start
    ```

    Atau jika menggunakan yarn:
    ```bash
    yarn start
    ```

---

## Note

Project ini dibawah lisensi MIT untuk Brand Surabaya BestPoint dari Iyan Zuli pada tahun 2025.
