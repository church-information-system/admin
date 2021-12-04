export default function SidebarItem({ imagesrc, label, isSelected }) {
  return (
    <div className={`sidebar-item ${isSelected ? "active" : ""}`}>
      {label === "Requests" ? <span className="badge">2</span> : ""}
      <img src={imagesrc} alt="icon" className="icon" />
      <div>{label}</div>
    </div>
  );
}
