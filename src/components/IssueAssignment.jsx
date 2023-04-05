import { useMutation, useQuery, useQueryClient } from "react-query";
import useUserData from "../helpers/useUserData";
import { BsFillGearFill } from "react-icons/bs";
import { useState } from "react";

export function IssueAssignment({ assignee, issueNumber }) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const queryClient = useQueryClient();
  const assigneeQuery = useUserData(assignee);
  const userQuery = useQuery(
    ["users"],
    async () => {
      const response = await fetch("/api/users");
      return response.json();
    },
    { staleTime: Infinity },
  );
  const assigneeUpdate = useMutation(
    async (assigneeId) => {
      const res = await fetch(`/api/issues/${issueNumber}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ assignee: assigneeId }),
      });

      return res.json();
    },
    {
      onMutate: (assigneeId) => {
        // cancel ongoing queries
        queryClient.cancelQueries(["issue", issueNumber.toString()]);
        // get current state
        const previousData = queryClient.getQueryData([
          "issue",
          issueNumber.toString(),
        ]);
        // mutate local cache
        queryClient.setQueryData(
          ["issue", issueNumber.toString()],
          (oldVal) => ({ ...oldVal, assignee: assigneeId }),
        );
        // return previous to context
        return { previousData };
      },
      onError: (_err, _var, context) =>
        queryClient.setQueryData(
          ["issue", issueNumber.toString()],
          context.previousData,
        ),
      onSettled: () => {
        // invalidate
        queryClient.invalidateQueries(["issue", issueNumber.toString()], {
          exact: true,
        });
        queryClient.invalidateQueries(["issues"]);
      },
    },
  );
  return (
    <div className="issue-options">
      <div>
        <span>Assignment</span>
        {/* avatar */}
        <div>
          <img
            src={assigneeQuery.data?.profilePictureUrl}
            alt={assigneeQuery.data?.name}
          />
          {assigneeQuery.data?.name}
        </div>
      </div>
      {/* svg */}
      <BsFillGearFill onClick={() => setIsPickerOpen(!isPickerOpen)} />
      {/* picker menu */}
      {isPickerOpen ? (
        <div className="picker-menu">
          {userQuery.data
            ? userQuery.data.map((user) => (
                <div
                  className={user.id === assignee ? "selected" : null}
                  onClick={() => assigneeUpdate.mutate(user.id)}
                  key={user.id}
                >
                  <img src={user.profilePictureUrl} alt={user.name} />
                  {user.name}
                </div>
              ))
            : null}
        </div>
      ) : null}
    </div>
  );
}
