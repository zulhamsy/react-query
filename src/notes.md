<!-- IMPORTANT NOTES -->

ketika baru fetch pertama
-> isLoading true, menandakan data belom ada dan status sedang loading

ketika success dengan data sesuai ekpektasi
-> isLoading false dan isSuccess true dengan data ada

ketika success dengan data tidak sesuai (misal JSON parsing error karena tidak ada return dari server sebenarnya)
-> isLoading false, isSuccess true namun data akan null dan bisa jadi ada error/isError jadi penting untuk cek query.data dulu bukan isSuccess

ketika error
-> otomatis isLoading false, isError dan error akan ada valuenya, isSuccess false dan data null

ketika refetching / background fetch
-> maka isFetching akan true, tapi isLoading tergantung apakah ada data atau tidak di fetch pertama/sebelumnya, kalo datanya masih ada/cache maka isLoading tetap false, makanya isLoading cocok untuk mengecek loading status saat pertama kali fetching. Sementara isFetching akan menunjukkan apakah queryFn dijalankan atau tidak terlepas dari ada/tidaknya data.

<!-- Rule of Thumb -->

fetchStatus -> fetching, idle, paused menunjukkan queryFn sedang jalan atau tidak
status -> loading, error, success menunjukkan ada data atau tidak, lebih tepatnya response dari server

sekali dapat data / success maka selanjutnya status tidak akan pernah === 'loading' karena 'loading' hanya akan terjadi ketika tidak ada data dan queryFn melakukan fetching, tapi kalo sudah ada data maka status akan berubah ke error/success tanpa melalui 'loading'
