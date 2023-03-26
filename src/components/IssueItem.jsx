import { Link } from "react-router-dom";
import { GoIssueOpened, GoIssueClosed, GoComment } from "react-icons/go";
import { relativeDate } from "../helpers/relativeDate";
import useUserData from "../helpers/useUserData";
import useLabelsData from "../helpers/useLabelsData";

export function IssueItem({
  title,
  labels,
  number,
  status,
  assignee,
  createdBy,
  createdDate,
  commentCount,
}) {
  const createdByUser = useUserData(createdBy);
  const assigneeUser = useUserData(assignee);
  const labelQuery = useLabelsData();
  return (
    <li>
      {/* status icon */}
      <div>
        {status === "done" || status === "cancelled" ? (
          <GoIssueClosed style={{ color: "red" }} />
        ) : (
          <GoIssueOpened style={{ color: "green" }} />
        )}
      </div>
      {/* content */}
      <div className="issue-content">
        <span>
          <Link to={`/issue/${number}`}>{title}</Link>
          {labelQuery.data &&
            labels.map((label) => (
              <span
                key={label}
                className={`label ${
                  labelQuery.data.find((el) => el.id === label)?.color
                }`}
              >
                {label}
              </span>
            ))}
        </span>
        <small>
          #{number} opened {relativeDate(createdDate)} by{" "}
          {createdByUser.isSuccess ? `${createdByUser.data.name}` : null}
        </small>
      </div>
      {/* asignee */}
      {assigneeUser.isSuccess ? (
        <img
          src={assigneeUser.data.profilePictureUrl}
          className="assigned-to"
        />
      ) : null}
      {/* comments */}
      <span className="comment-count">
        <GoComment />
        {commentCount}
      </span>
    </li>
  );
}
