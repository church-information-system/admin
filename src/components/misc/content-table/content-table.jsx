import { convertCamelCase } from "../../../helpers";
import "./content-table.scss";

export default function ContentTable({ columns, data }) {
  return (
    <div className="table-container">
      <Table columns={columns} data={data} />
    </div>
  );
}

function Table({ columns, data }) {
  return (
    <table onClick={(event) => event.stopPropagation()}>
      <thead>
        <tr>
          {columns.map((key, index) => (
            <th key={key + index}>{convertCamelCase(key)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {columns.map((key, index) => (
            <td key={data[key] + index}>{data[key].toString()}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}
