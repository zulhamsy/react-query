import { useState } from "react";
import { Link } from "react-router-dom";
import IssuesList from "../components/IssuesList";
import LabelList from "../components/LabelList";
import StatusSelect from "../components/StatusSelect";
export default function Issues() {
  const [selectedLabelId, setSelectedLabelId] = useState([]);
  const [selectedStatusId, setSelectedStatusId] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [searchKey, setSearchKey] = useState("");

  const handleChangeSelectedLabel = (label) => {
    // ubah ke halaman awal
    setPageNum(1);
    if (selectedLabelId.includes(label)) {
      let newSelectedLabels = [];
      newSelectedLabels = selectedLabelId.filter(
        (item) => item.id !== label.id,
      );
      setSelectedLabelId(newSelectedLabels);
    } else {
      setSelectedLabelId([...selectedLabelId, label]);
    }
  };
  return (
    <div>
      <main>
        <section>
          <IssuesList
            selectedLabels={selectedLabelId.map((label) => label.id)}
            selectedStatus={selectedStatusId}
            searchKey={searchKey}
            onChangeSearchKey={setSearchKey}
            page={pageNum}
            onChangePageNum={setPageNum}
          />
        </section>
        {!searchKey.length ? (
          <aside>
            <LabelList
              selectedLabels={selectedLabelId}
              changeSelectedLabels={handleChangeSelectedLabel}
            />
            <h3>Status</h3>
            <StatusSelect
              selectedStatusId={selectedStatusId}
              onChange={(statusId) => {
                setPageNum(1);
                setSelectedStatusId(statusId);
              }}
            />
            <Link to="/add" className="button">
              Add Issue
            </Link>
          </aside>
        ) : null}
      </main>
    </div>
  );
}
