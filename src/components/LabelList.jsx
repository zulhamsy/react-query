import { useQueryClient } from "react-query";
import modFetch from "../helpers/modifiedFetch";
import useLabelsData from "../helpers/useLabelsData";

export default function LabelList({
  selectedLabels = [],
  changeSelectedLabels,
}) {
  const queryClient = useQueryClient();
  const labelsQuery = useLabelsData();
  const classObj = (labelId) => {
    if (selectedLabels.find((label) => label.id === labelId)) {
      return "selected";
    }
  };
  const prefetchIssues = async (labelId) => {
    await queryClient.prefetchQuery(
      ["issues", { labels: [labelId], status: "" }],
      () => {
        return modFetch(`/api/issues?labels[]=${labelId}`);
      },
      { staleTime: 1000 * 60 * 5 },
    );
  };
  return (
    <>
      <h3>Labels</h3>
      <div className="labels">
        {labelsQuery.isError ? (
          <p>Error - {labelsQuery.error.message}</p>
        ) : null}
        {/* isLoading elsenya langsung data, karena kalo isSuccess cuma true ketika berhasil fetch/refetch, jadi ketika gagal untuk refetch misalnya maka isSuccess akan false dan data cache tidak akan ditampilkan meskipun ada */}
        {labelsQuery.isLoading ? (
          <p>Loading Labels...</p>
        ) : labelsQuery.data ? (
          <ul>
            {labelsQuery.data.map((label) => (
              <li key={label.id}>
                <button
                  onClick={() => changeSelectedLabels(label)}
                  onMouseEnter={() => prefetchIssues(label.id)}
                  className={`label ${label.color} ${classObj(label.id)}`}
                >
                  {label.name}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </>
  );
}
