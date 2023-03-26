ada dua method untuk menentukan preload data / data sementara ketika query sedang memfetch data aslinya

1. Placeholder Data (fake it till you make it)
   placeholder berjalan pada observer level yang artinya menempel pada komponen yang mensubscribe query tersebut, dengan begitu tiap komponen dapat memiliki placeholder berbeda walaupun query yang digunakan sama.
   placeholder juga tidak ditempatkan pada cache sehingga begitu komponen pertama kali di mount maka query akan menjalankan Fn segera setalah itu, placeholder hanya akan ditampilkan sampai data aslinya berhasil di terima.

2. InitialData
   initialData berjalan pada cache level, sehingga data yang ditentukan pada initialData dianggap sebagai data asli seolah dari hasil query, oleh karena itu data tersebut juga respect dengan rules "staleTime".

   initialData dapat bergantung / menarik dari cache query lain, misal saat berada di halaman issue list (tiap issue di list memuat beberapa data/keseluruhan data yang berguna bagi halaman issue detail).

   pada halaman issue detail, initialData dapat mengambil dari cache/data yang sudah di fetch pada issue list, karena sifatnya yang respect thdp staleTime maka ketika sudah waktunya akan stale dimulai dari data tersebut digunakan / komponen di mounts

   namun ada opsi lain yaitu initialDataUpdatedAt, menerima JS Timestamp (milisecond), value dari opsi tersebut dapat di derived dari dataUpdatedAt yang dimiliki oleh data/cache yang kita ambil (issue list dalam contoh ini)

# IMPORTANT NOTES

penggunaan initialData tidak disarankan apabila data yang direturn incomplete / partial, kalo hanya parsial disarankan menggunakan placeholder, incomplete dapat bermaksud datanya kurang secara jumlah atau fieldnya ada yang missing
