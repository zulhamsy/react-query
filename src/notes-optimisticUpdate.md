# BEST PRACTICE

- buat best practice, queryFn sebaiknya mereturn data dari async operationnya (fetch / axios), bukan mereturn fetch/axios itu sendiri, tujuannya untuk memastikan data tersebut dapat digunakan sebagai parameter pada callback method lainnya, selain itu beberapa mekanisme melihat returned data sebagai indikasi query tsb gagal/berhasil.

contoh
useMutation(
() => {
return fetch('..').then((res) => res.json()) <- karena ada then..json() maka yang direturn adalah nilainya
}
)

contoh
useMutation(
async () => {
const res = await fetch('...')
return res.json()
}
)

useMutation salah satunya, kalo cuma return fetch function, kemungkinan query optimistic updates berjalan tidak sesuai yang diharapkan, misal UI sudah terupdate secara lokal (B), tapi invalidate (onSettled) selesai lebih dahulu dibanding Update, akibatnya, UI kembali ke state sebelum diupdate (A), padahal di server data terkait sudah diupdate (B)

untuk mengatasinya, queryFn perlu mereturn data real dari async operation, karena ketika data berhasil dibaca oleh onSettled, maka akan dipastikan update function berjalan terlebih dahulu baru invalidation pada onSettled

# Logic Optimistic Update

- onMutate

  - cancel ongoing query pada query terkait (cancelQueries)
  - ambil current state (getQuery) dan return tersebut ke dalam context return {prevState}
  - ubah local cache dengan (setQueryData)

- onError

  - setQueryData ke prevState yang direturn dari context (context.prevState)

- onSettled
  - invalidate query itu sendiri dan query lainnya yang terkait
