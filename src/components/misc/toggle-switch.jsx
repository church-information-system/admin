import "./toggle-switch.scss";

export default function ToggleSwitch({ toggle, label }) {
  return (
    <div className="switch-container">
      <label className="switch">
        <input
          type="checkbox"
          onChange={(value) => {
            toggle(value.target.checked);
          }}
        />
        <span className="slider round"></span>
      </label>
      <h4>{label}</h4>
    </div>
  );
}
