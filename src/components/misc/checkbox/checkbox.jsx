import "./checkbox.scss";

export default function CheckBox() {
  return (
    <div className="checkbox-container">
      <input
        className="checkbox"
        type="checkbox"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
