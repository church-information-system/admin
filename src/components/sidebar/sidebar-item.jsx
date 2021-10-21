export default function SidebarItem({ imagesrc, label, isSelected }) {
  return (
    <div className={`sidebar-item ${isSelected ? "active" : ""}`}>
      <img src={imagesrc} alt="icon" className="icon" />
      <div>{label}</div>
    </div>
  );
}
