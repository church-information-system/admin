import "./checkbox.scss";

export default function CheckBox({ onChange, isChecked }) {
  return (
    <div className="checkbox-container">
      <input
        className="checkbox"
        type="checkbox"
        value={isChecked}
        onChange={(e) => {
          e.stopPropagation();
          onChange(e.target.checked);
        }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
