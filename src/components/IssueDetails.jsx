import { useInfiniteQuery, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import useUserData from "../helpers/useUserData";
import IssueHeader from "./IssueHeader";
import { relativeDate } from "../helpers/relativeDate";
import { IssueStatus } from "./IssueStatus";
import { IssueAssignment } from "./IssueAssignment";
import { IssueLables } from "./IssueLables";
import React from "react";
// import useTriggerScroll from "../helpers/useTriggerScroll";
import useInfiniteScroll from "react-infinite-scroll-hook";

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
        // optimized using chatGPT
        issuesQueryCache.find((obj) => {
          const data = obj.state.data;
          if (!data) return false;
          const foundData = data.find((d) => d.number.toString() === number);
          if (foundData) {
            resultData = foundData;
            resultState = obj.state;
            return true;
          }
          return false;
        });
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
    queryFn: ({ pageParam = 1 }) => {
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

  // useTriggerScroll(document, () => infiniteCommentQuery.fetchNextPage(), 100);
  const [sentryRef] = useInfiniteScroll({
    loading: infiniteCommentQuery.isFetchingNextPage,
    hasNextPage: infiniteCommentQuery.hasNextPage,
    onLoadMore: infiniteCommentQuery.fetchNextPage,
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
            <div ref={sentryRef} />
            {infiniteCommentQuery.isFetchingNextPage ? (
              <span>Loading more comments....</span>
            ) : null}
            {!infiniteCommentQuery.hasNextPage ? (
              <span>You've reached the end</span>
            ) : null}
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
