import { useState } from "react";
import { Link } from "react-router-dom";
import IssuesList from "../components/IssuesList";
import LabelList from "../components/LabelList";
import StatusSelect from "../components/StatusSelect";
export default function Issues() {
  const [selectedLabelId, setSelectedLabelId] = useState([]);
  const [selectedStatusId, setSelectedStatusId] = useState("");
  const [searchKey, setSearchKey] = useState("");

  const handleChangeSelectedLabel = (label) => {
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
              onChange={setSelectedStatusId}
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
