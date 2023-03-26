import useLabelsData from "../helpers/useLabelsData";

export default function LabelList({
  selectedLabels = [],
  changeSelectedLabels,
}) {
  const labelsQuery = useLabelsData();
  const classObj = (labelId) => {
    if (selectedLabels.find((label) => label.id === labelId)) {
      return "selected";
    }
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
