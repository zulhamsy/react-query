import { BsFillGearFill } from "react-icons/bs";
import useLabelsData from "../helpers/useLabelsData";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";

export function IssueLables({ labelsId = [], issueNumber }) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const labelQuery = useLabelsData();
  const queryClient = useQueryClient();
  const findLabelObject = (labelId) => {
    return labelQuery.data.find((label) => label.id === labelId);
  };
  const labelsUpdate = useMutation(
    async (newLabelId) => {
      // cek apakah tambah label baru / hapus label yang sudah ada
      const newLabels = labelsId.includes(newLabelId)
        ? labelsId.filter((label) => label !== newLabelId)
        : [...labelsId, newLabelId];

      const res = await fetch(`/api/issues/${issueNumber}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ labels: newLabels }),
      });

      return res.json();
    },
    {
      onMutate: (newLabelId) => {
        // cancel ongoing queries
        queryClient.cancelQueries(["issue", issueNumber.toString()], {
          exact: true,
        });
        // get current issue data
        const prevData = queryClient.getQueryData([
          "issue",
          issueNumber.toString(),
        ]);
        // mutate local data
        queryClient.setQueryData(["issue", issueNumber.toString()], (data) => {
          const newLabels = labelsId.includes(newLabelId)
            ? labelsId.filter((label) => label !== newLabelId)
            : [...labelsId, newLabelId];
          return {
            ...data,
            labels: newLabels,
          };
        });
        // return context
        return { prevData };
      },
      onError: (_error, _var, context) =>
        queryClient.setQueryData(
          ["issue", issueNumber.toString()],
          context.prevData,
        ),
      onSettled: () => {
        // invalidate issue queries
        queryClient.invalidateQueries(["issue", issueNumber.toString()], {
          exact: true,
        });
        // invalidate issues queries
        queryClient.invalidateQueries(["issues"]);
      },
    },
  );

  return (
    <div className="issue-options">
      <div>
        <span>Labels</span>
        {labelQuery.data?.length
          ? labelsId.map((labelId) => (
              <span
                key={labelId}
                className="label"
                style={{ color: findLabelObject(labelId)?.color }}
              >
                {findLabelObject(labelId)?.name}
              </span>
            ))
          : null}
      </div>
      {/* svg */}
      <BsFillGearFill onClick={() => setIsPickerOpen(!isPickerOpen)} />
      {/* picker menu */}
      {isPickerOpen ? (
        <div className="picker-menu labels">
          {labelQuery.data?.map((label) => (
            <div
              key={label.id}
              className={labelsId.includes(label.id) ? "selected" : ""}
              onClick={() => labelsUpdate.mutate(label.id)}
            >
              <span
                className="label-dot"
                style={{ backgroundColor: label.color }}
              ></span>
              {label.name}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
