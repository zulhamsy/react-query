import { useMutation, useQueryClient } from "react-query";
import StatusSelect from "./StatusSelect";

export function IssueStatus({ issue }) {
  const queryClient = useQueryClient();
  const statusMutation = useMutation(
    async (status) => {
      const res = await fetch(`/api/issues/${issue.number}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      return res.json();
    },
    {
      onMutate: async (newStatus) => {
        // cancel ongoing query / fetches
        await queryClient.cancelQueries(["issue", issue.number.toString()]);
        // snapshot previous value
        const previousValue = queryClient.getQueryData([
          "issue",
          issue.number.toString(),
        ]);
        // optimistically update cache data
        queryClient.setQueryData(["issue", issue.number.toString()], (old) => {
          return { ...old, status: newStatus };
        });
        // return old Data for context use, harus dibalikin ke dalam Object context
        return { previousValue };
      },
      onError: (_err, _newStatus, context) => {
        // kalo error balikin data ke previousValue
        queryClient.setQueryData(
          ["issue", issue.number.toString()],
          context.previousValue,
        );
      },
      onSettled: (data, error, variable) => {
        // invalidate issue itu sendiri
        queryClient.invalidateQueries(["issue", issue.number.toString()], {
          exact: true,
        });
        // invalidate list of issue karena kalo user ganti status, di home juga perlu update
        queryClient.invalidateQueries(["issues"]);
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
