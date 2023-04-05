# BEST PRACTICE

- buat best practice, queryFn sebaiknya mereturn data dari async operationnya (fetch / axios), bukan mereturn fetch/axios itu sendiri, tujuannya untuk memastikan data tersebut dapat digunakan sebagai parameter pada callback method lainnya, selain itu beberapa mekanisme melihat returned data sebagai indikasi query tsb gagal/berhasil.

## contoh

useMutation(
() => {
return fetch('..').then((res) => {
return res.json()
}) <- karena queryFn mereturn fetch yang mereturn res.json() / real data
}
)

## contoh

useMutation(
async () => {
const res = await fetch('...')
return res.json()
}
) <- async function yang mereturn res.json()

## bad contoh

useMutation(
fetch(...).then((res) => res.json())
) <- ini bakal undefined datanya karena yang dipass bukan function tapi call function / yang mereturn Promise

jadi queryFn parameter harus lah function yang mereturn data bukan sekedar calling data tanpa return atau hanya return Promise saja

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
