import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import useUserData from "../helpers/useUserData";
import IssueHeader from "./IssueHeader";
import { relativeDate } from "../helpers/relativeDate";

export default function IssueDetails() {
  const { number } = useParams();
  const queryClient = useQueryClient();
  const issueQuery = useQuery(
    ["issue", number],
    () => fetch(`/api/issues/${number}`).then((res) => res.json()),
    {
      staleTime: 1000 * 60,
      initialData: () => {
        return queryClient
          .getQueryData(["issues"], { exact: false })
          ?.find((item) => item.number === Number(number));
      },
      initialDataUpdatedAt: () => {
        return queryClient.getQueryState(["issues"], { exact: false })
          ?.dataUpdatedAt;
      },
    },
  );

  const commentsQuery = useQuery(
    ["issue", number, "comments"],
    () => fetch(`/api/issues/${number}/comments`).then((res) => res.json()),
    { staleTime: Infinity },
  );

  return (
    <div className="issue-details">
      {issueQuery.isLoading ? <p>Fetching Issue Detail</p> : null}
      {issueQuery.isSuccess ? <IssueHeader {...issueQuery.data} /> : null}
      {commentsQuery.isLoading ? <p>Fetching Comments</p> : null}
      {commentsQuery.isSuccess ? (
        <div>
          {commentsQuery.data.map((comment) => (
            <Comments key={comment.id} {...comment} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Comments({ createdBy, createdDate, comment }) {
  const user = useUserData(createdBy);
  const relDate = relativeDate(createdDate);
  return (
    <div className="comment">
      {/* Image */}
      {user.isSuccess ? (
        <img src={user.data.profilePictureUrl} alt={user.data.name} />
      ) : null}
      {/* Comments Wrapper */}
      <div>
        <div className="comment-header">
          <span>{user.isSuccess ? user.data.name : "..."}</span>
          <span> commented {relDate}</span>
        </div>
        <div className="comment-body">{comment}</div>
      </div>
    </div>
  );
}
