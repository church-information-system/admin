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
          {columns.map((key, index) => {
            let text = data[key].toString();
            if (key === "receivedSacrament") {
              if (text === "false") text = "no";
              if (text === "on") text = "yes";
            }

            return <td key={data[key] + index}>{text}</td>;
          })}
        </tr>
      </tbody>
    </table>
  );
}
