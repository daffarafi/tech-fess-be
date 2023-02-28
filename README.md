1. Untuk menjalankan proyek, silahkan clone atau download zip repo ini.
2. Setelah itu, jalankan perintah "yarn" pada terminal root proyek. Tunggu hingga installasi selesai.
3. Pastikan Docker sudah terinstall pada Perangkat anda. (https://www.docker.com/)
4. Jalankan docker, setelah docker berhasil dijalankan, jalankan perintah "docker ps" pada terminal untuk memastikan apakah docker sudah berjalan atau belum.
5. Jalankan perintah "docker compose up techfess" untuk membuat container baru pada Docker. Tunggu sampai selesai.
6. Buat file baru bernama ".env", copy paste isi yang ada pada .env.example kedalam .env
7. Masukan nilai DATABASE_URL sesuai dengan link Postgres. (https://www.prisma.io/docs/reference/database-reference/connection-urls).
8. Masukan nilai JWT_SECRET dan PORT.
9. Jalankan perintah "yarn prisma migrate dev" untuk membuat table database menggunakan Prisma.
10. Jalankan perintah "yarn start:dev", tunggu hingga selesai.
