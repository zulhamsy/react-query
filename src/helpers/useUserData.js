import { useQuery } from "react-query";

export default function useUserData(userId) {
  const userData = useQuery(
    ["users", userId],
    () => fetch(`/api/users/${userId}`).then((res) => res.json()),
    { staleTime: 1000 * 60 * 5, enabled: userId !== null },
  );

  return userData;
}
