import { useQuery } from "react-query";
import { defaultLabels } from "./defaultData";

export default function useLabelsData() {
  const labelsQuery = useQuery(
    ["labels"],
    async () => {
      const response = await fetch("/api/labels", {
        headers: { "x-error": true },
      });
      const result = await response.json();
      if (response.status >= 400)
        throw new Error(
          `There is an error! - and its a good thing - ${result.error}`,
        );
      if (!result)
        throw new Error("Server Error - Unexpected response from server");
      return result;
    },
    { placeholderData: defaultLabels, staleTime: Infinity },
  );

  return labelsQuery;
}
