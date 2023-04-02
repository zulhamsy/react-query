import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import useUserData from "../helpers/useUserData";
import IssueHeader from "./IssueHeader";
import { relativeDate } from "../helpers/relativeDate";
import { IssueStatus } from "./IssueStatus";

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
          ?.find((item) => item.number.toString() === number);
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
      <main>
        {commentsQuery.isLoading ? (
          <section>
            <p>Fetching Comments</p>
          </section>
        ) : null}
        {/* Comments */}
        {commentsQuery.isSuccess ? (
          <section>
            {commentsQuery.data.map((comment) => (
              <Comments key={comment.id} {...comment} />
            ))}
          </section>
        ) : null}
        {/* Aside */}
        <aside>
          {/* Status */}
          <IssueStatus issue={issueQuery.data} />
        </aside>
      </main>
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
