import { possibleStatus } from "../helpers/defaultData";

export default function StatusSelect({ selectedStatusId, onChange }) {
  return (
    <select
      name="status"
      id="status"
      className="status-select"
      onChange={(e) => onChange(e.target.value)}
      defaultValue="default"
    >
      <option disabled value="default">
        Select a status
      </option>
      {possibleStatus.map((status) => (
        <option key={status.id} value={status.id}>
          {status.label}
        </option>
      ))}
    </select>
  );
}
