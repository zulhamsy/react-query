# Stale Time Options

pengaturan staleTime pada prefetchQuery bertujuan seberapa lama data hasil prefetch tersebut dikatakan STALE.
tapi opsi staleTime tersebut tidak mengoverride staleTime yang ditentukan pada useQuery untuk query key yang sama.

## Contoh Stale Time

queryKey: "todos"
staleTime: 2 menit
staleTime prefetch: 10 detik / not specified / instant / less than original staleTime
prefetch condition: mouse enter specific link (misal Todos Menu)

ketika mouse hover di Todos Menu, maka data "todos" akan terisi dengan staleTime 10 detik, asumsi user sedang berada di halaman selain Todos Page (jadi query "todos" akan inactive) maka ketika user meng-hover menu Todos lagi setelah 10 detik, prefetch akan berjalan kembali untuk mengambil data fresh.

tapi ketika user masuk ke Todos Page, data akan terisi dengan staleTime 2 menit, karena pada halaman tersebut staleTime yang aktif (dari useQuery) adalah 2 menit, meskipun ketika user menghover Todos Menu akan tetap fetching data fresh karena query dari prefetch tersebut sudah stale.

jadi staleTime pada prefetch jika querynya menempel pada trigger action tertentu, seperti mendikte kapan fetch akan dilakukan jika query tertrigger kembali, kalo misal staleTime prefetch onHover dibuat Infinity, maka setelah fetch pertama dan sukses, hover2 berikutnya tidak akan mentrigger fetching

### Important Notes

prefetch sebaiknya memang dipasang ketika user mentrigger suatu action yang kemungkinan setelah itu data dari query yang di prefetch akan dibutuhkan oleh app, misal ketika hover menu, hover button, bisa juga setelah memasuki suatu page dan ada kemungkinan user akan menuju page lainnya (yang membutuhkan data dari query baru), namun sebaiknya jika hal seperti itu, antara useQuery dengan prefetchQuery disamakan nilai staleTimenya atau prefetchQuery > useQuery atau dibuat Infinity
