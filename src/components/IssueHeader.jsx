import { GoIssueClosed, GoIssueOpened } from "react-icons/go";
import { useParams } from "react-router-dom";
import { possibleStatus } from "../helpers/defaultData";
import { relativeDate } from "../helpers/relativeDate";
import useUserData from "../helpers/useUserData";

export default function IssueHeader({
  title,
  status = "todo",
  createdBy,
  createdDate,
  comments,
}) {
  const { number } = useParams();
  const statusLabel = possibleStatus.find((val) => val.id === status);
  const createdByName = useUserData(createdBy);

  return (
    <header>
      <h2>
        {title} <span>#{number}</span>
      </h2>
      <div>
        {/* Status Pill */}
        <span
          className={
            status === "done" || status === "cancelled" ? "closed" : "open"
          }
        >
          {status === "done" || status === "cancelled" ? (
            <GoIssueClosed />
          ) : (
            <GoIssueOpened />
          )}

          {statusLabel.label}
        </span>
        {/* Created By */}
        <span className="created-by">
          {createdByName.isSuccess ? (
            <span>{createdByName.data.name}</span>
          ) : (
            "..."
          )}
        </span>
        {/* Info */}
        <span>
          opened this issue {relativeDate(createdDate)} · {comments.length}{" "}
          comments
        </span>
      </div>
    </header>
  );
}
