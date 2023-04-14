import { useInfiniteQuery, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import useUserData from "../helpers/useUserData";
import IssueHeader from "./IssueHeader";
import { relativeDate } from "../helpers/relativeDate";
import { IssueStatus } from "./IssueStatus";
import { IssueAssignment } from "./IssueAssignment";
import { IssueLables } from "./IssueLables";
import React from "react";

export default function IssueDetails() {
  const { number } = useParams();
  const queryClient = useQueryClient();
  const issuesQueryCache = queryClient.getQueryCache().findAll(["issues"]);
  let resultData, resultState;
  const issueQuery = useQuery(
    ["issue", number],
    () => fetch(`/api/issues/${number}`).then((res) => res.json()),
    {
      staleTime: 1000 * 60,
      initialData: () => {
        for (let i = 0; i < issuesQueryCache.length; i++) {
          const data = issuesQueryCache[i].state.data;
          if (!data) continue;
          for (let j = 0; j < data.length; j++) {
            if (data[j].number.toString() === number) {
              resultData = data[j];
              resultState = issuesQueryCache[i].state;
              console.log(resultState);
              break;
            }
          }
          if (resultData) break;
        }
        return resultData;
      },
      initialDataUpdatedAt: () => {
        return resultState?.dataUpdatedAt;
      },
    },
  );

  // const commentsQuery = useQuery(
  //   ["issue", number, "comments"],
  //   () => fetch(`/api/issues/${number}/comments`).then((res) => res.json()),
  //   { staleTime: Infinity },
  // );

  const infiniteCommentQuery = useInfiniteQuery({
    queryKey: ["issue", number, "inf-comments"],
    queryFn: ({ pageParam = 2 }) => {
      return fetch(`/api/issues/${number}/comments?page=${pageParam}`).then(
        (res) => res.json(),
      );
    },
    staleTime: Infinity,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 10) return undefined;
      return allPages.length + 1;
    },
  });

  return (
    <div className="issue-details">
      {issueQuery.isLoading ? <p>Fetching Issue Detail</p> : null}
      {issueQuery.isSuccess ? <IssueHeader {...issueQuery.data} /> : null}
      <main>
        {infiniteCommentQuery.isLoading ? (
          <section>
            <p>Fetching Comments</p>
          </section>
        ) : null}
        {/* Comments */}
        {infiniteCommentQuery.isSuccess ? (
          <section>
            {/* {commentsQuery.data.map((comment) => (
              <Comments key={comment.id} {...comment} />
            ))} */}
            {infiniteCommentQuery.data.pages.map((page, index) => (
              <React.Fragment key={index}>
                {page.map((comment) => (
                  <Comments key={comment.id} {...comment} />
                ))}
              </React.Fragment>
            ))}
            <button
              onClick={() => infiniteCommentQuery.fetchNextPage()}
              disabled={infiniteCommentQuery.isFetchingNextPage}
            >
              Load More
            </button>
          </section>
        ) : null}
        {/* Aside */}
        <aside>
          {/* Status */}
          <IssueStatus issue={issueQuery.data} />
          {/* Assignment */}
          <IssueAssignment
            assignee={issueQuery.data?.assignee || issueQuery.data?.createdBy}
            issueNumber={issueQuery.data?.number}
          />
          {/* Labels */}
          <IssueLables
            labelsId={issueQuery.data?.labels}
            issueNumber={issueQuery.data?.number}
          />
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
