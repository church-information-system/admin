import "./content-table.scss";

export default function ContentTable({ columns, data }) {
  return (
    <table>
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
