import { useQuery, useQueryClient } from "react-query";
import modFetch from "../helpers/modifiedFetch";
import { IssueItem } from "./IssueItem";
import Loader from "./Loader";

export default function IssuesList({
  selectedLabels = [],
  selectedStatus,
  searchKey,
  onChangeSearchKey,
}) {
  const queryClient = useQueryClient();
  const issuesQuery = useQuery(
    ["issues", { labels: selectedLabels, status: selectedStatus }],
    () => {
      const labelsUrl = selectedLabels
        .map((label) => `labels[]=${label}`)
        .join("&");
      const statusUrl = selectedStatus ? `&status=${selectedStatus}` : "";
      return modFetch(`/api/issues?${labelsUrl}${statusUrl}`, {
        headers: {
          "x-error": true,
        },
      });
    },
    { retry: false, staleTime: 1000 * 30 },
  );
  const searchQuery = useQuery(
    ["issues", "search", searchKey],
    () => fetch(`/api/search/issues?q=${searchKey}`).then((res) => res.json()),
    { enabled: searchKey.length > 0, staleTime: Infinity },
  );
  return (
    <div>
      <h2>Issues List {issuesQuery.isFetching ? <Loader /> : null}</h2>
      <form
        style={{ marginBottom: "1rem" }}
        onSubmit={(e) => {
          e.preventDefault();
          onChangeSearchKey(e.target.elements.search.value);
        }}
      >
        <label htmlFor="search">Search</label>
        <input
          type="search"
          name="search"
          id="search"
          onChange={(e) => {
            if (e.target.value.length === 0) onChangeSearchKey("");
          }}
        />
      </form>

      {/* Tombol get updated data kalo issueQuery udah stale */}
      {issuesQuery.isStale ? (
        <button
          onClick={() => {
            queryClient.invalidateQueries(["issues"]);
          }}
        >
          Get Updated Issues
        </button>
      ) : null}

      {/* query keadaan normal / tanpa search key */}
      {/* pesan error kalo gagal fetch pertama kali */}
      {issuesQuery.isError && !issuesQuery.data ? (
        <p>Error Fetching Data</p>
      ) : null}
      {/* pesan error kalo gagal di re-fetch / fetch kedua dst */}
      {issuesQuery.isRefetchError ? (
        <p>Gagal mendapatkan update data : {issuesQuery.error.message}</p>
      ) : null}
      {/* selama tidak ada data dan masih fetching, pesan ini muncul */}
      {issuesQuery.isLoading ? <p>Loading...</p> : null}
      {issuesQuery.data && !searchKey.length ? (
        <ul className="issues-list">
          {issuesQuery.data.map((issue) => (
            <IssueItem
              key={issue.id}
              title={issue.title}
              labels={issue.labels}
              number={issue.number}
              status={issue.status}
              assignee={issue.assignee}
              createdBy={issue.createdBy}
              createdDate={issue.createdDate}
              commentCount={issue.comments.length}
            />
          ))}
        </ul>
      ) : null}

      {/* query saat ada search key */}
      {searchQuery.isLoading && searchQuery.isFetching ? (
        <p>Searching Issue...</p>
      ) : null}
      {searchQuery.isSuccess && searchKey.length ? (
        <>
          <p>{searchQuery.data.count} issues found</p>
          <ul className="issues-list">
            {searchQuery.data.items.map((issue) => (
              <IssueItem
                key={issue.id}
                title={issue.title}
                labels={issue.labels}
                number={issue.number}
                status={issue.status}
                assignee={issue.assignee}
                createdBy={issue.createdBy}
                createdDate={issue.createdDate}
                commentCount={issue.comments.length}
              />
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
