import { useMutation, useQueryClient } from "react-query";
import StatusSelect from "./StatusSelect";

export function IssueStatus({ issue }) {
  const queryClient = useQueryClient();
  const statusMutation = useMutation(
    (status) => {
      fetch(`/api/issues/${issue.number}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ status }),
      }).then((res) => res.json());
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(["issue", issue.number.toString()]);
      },
    },
  );
  return (
    <div className="issue-options">
      <div>
        <span>Status</span>
        <StatusSelect
          selectedStatusId={issue?.status || "todo"}
          onChange={(newStatus) => statusMutation.mutate(newStatus)}
        />
      </div>
    </div>
  );
}
