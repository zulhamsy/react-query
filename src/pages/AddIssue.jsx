import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router";

export default function AddIssue() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const issueMutation = useMutation(
    (payload) =>
      fetch("api/issues", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      }).then((res) => res.json()),
    {
      onSuccess: (data) => {
        // invalidate query issues agar pas nanti di home, issuesnya refetching walau < staleTime
        queryClient.invalidateQueries(["issues"]);
        // set data dari respon server ke issue terkait
        queryClient.setQueryData(["issue", data.number.toString()], data);
        // arahkan ke halaman issue yang baru aja dibuat
        navigate(`/issue/${data.number}`);
      },
    },
  );
  function handleSubmit(e) {
    e.preventDefault();
    // kalo lagi submitting biar ga dobel
    if (issueMutation.isLoading) return;
    issueMutation.mutate({
      // dapet dari name props yang ada di form
      title: e.target.title.value,
      comment: e.target.comment.value,
    });
  }
  return (
    <div className="add-issue">
      <h2>Add Issue</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" />
        <label htmlFor="comment">Comment</label>
        <textarea id="comment" name="comment" />
        <button type="submit" disabled={issueMutation.isLoading}>
          {issueMutation.isLoading ? "Adding..." : "Add Issue"}
        </button>
      </form>
    </div>
  );
}
