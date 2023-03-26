invalidatedQuery sedikit berbeda dengan refetchQuery
-> invalidate hanya akan menstale data yang memiliki active observer (active)
-> stale data tersebut otomatis akan di fetching
-> refetch akan me-refetch query baik yang sedang active/inactive
-> refetch itu methodnya query yang terkait, sedangkan invalidateQuery itu methodnya QueryClient (jadi bisa dari mana aja selama import useQueryClient)

defaultnya kedua fn tersebut akan berdampak pada key yang memiliki awalan sama,
contoh ["issues"] => jika query key tersebut di invalidate/refetch maka semua key yang berawalan "issues" akan stale datanya/refetched, hal tersebut dapat diantisipasi jika dengan options {exact: true}
