import { chunkArray } from "../../../helpers";
import "./content-table.scss";

export default function ContentTable({ columns, data }) {
  console.log(chunkArray(columns));

  return (
    <div className="table-container">
      <Table columns={columns} data={data} />
    </div>
  );
}

function Table({ columns, data }) {
  return (
    <table onClick={(event) => event.stopPropagation()}>
      <tr>
        {columns.map((key) => (
          <th>{key}</th>
        ))}
      </tr>
      <tr>
        {columns.map((key) => (
          <td>{data[key]}</td>
        ))}
      </tr>
    </table>
  );
}
