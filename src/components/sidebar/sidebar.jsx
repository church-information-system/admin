import SidebarItem from "./sidebar-item";
import "./sidebar.scss";
import death from "../../assets/death.svg";
import marriage from "../../assets/marriage.svg";
import donation from "../../assets/donation.svg";
import settings from "../../assets/settings.svg";
import logout from "../../assets/logout.svg";
import { customAlert } from "../../helpers";

export default function SideBar({ selected, select }) {
  return (
    <div id="sidebar">
      <h2>Records</h2>
      <span onClick={() => select("marriage")} className="sidebar-item-container">
        <SidebarItem
          label="Marriage Record"
          imagesrc={marriage}
          isSelected={selected === "marriage"}
        />
      </span>
      <span onClick={() => select("death")} className="sidebar-item-container">
        <SidebarItem
          label="Death Record"
          imagesrc={death}
          isSelected={selected === "death"}
        />
      </span>
      <span onClick={() => select("donation")} className="sidebar-item-container">
        <SidebarItem
          label="Donation Record"
          imagesrc={donation}
          isSelected={selected === "donation"}
        />
      </span>
      <span onClick={() => customAlert("Settings")}>
        <SidebarItem
          label="Settings"
          imagesrc={settings}
        />
      </span>
      <span onClick={() => customAlert("Are you sure you want to Logout?", "Question")}>
        <SidebarItem
          label="Logout"
          imagesrc={logout}
        />
      </span>
    </div>
  );
}
