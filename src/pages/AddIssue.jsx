import { useRef } from "react";
import { useMutation, useQueryClient } from "react-query";

export default function AddIssue() {
  const queryClient = useQueryClient();
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const issueMutation = useMutation(
    () =>
      fetch("api/issues", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          title: titleRef.current.value,
          content: contentRef.current.value,
        }),
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["issues"]);
      },
    },
  );
  function handleSubmit(e) {
    e.preventDefault();
    issueMutation.mutate();
  }
  return (
    <div className="add-issue">
      <h2>Add Issue</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input ref={titleRef} type="text" id="title" />
        <label htmlFor="content">Content</label>
        <textarea ref={contentRef} id="content" />
        <button type="submit">Add Issue</button>
      </form>
    </div>
  );
}
