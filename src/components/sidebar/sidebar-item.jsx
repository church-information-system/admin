import { useEffect, useState } from "react";
import { recordCounter } from "../../api/FirebaseHelper";

export default function SidebarItem({ imagesrc, label, isSelected }) {
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    async function countRecords() {
      console.log(label);
      recordCounter(label.toLowerCase(), function (data) {
        setNotifCount(() => data.size);
      });
    }

    if (["requests", "donation"].includes(label.toLowerCase())) {
      countRecords();
    }
  }, [label]);

  return (
    <div className={`sidebar-item ${isSelected ? "active" : ""}`}>
      {notifCount > 0 ? <span className="badge">{notifCount}</span> : ""}
      <img src={imagesrc} alt="icon" className="icon" />
      <div>{label}</div>
    </div>
  );
}
