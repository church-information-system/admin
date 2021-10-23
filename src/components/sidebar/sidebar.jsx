import SidebarItem from "./sidebar-item";
import "./sidebar.scss";
import death from "../../assets/death.svg";
import marriage from "../../assets/marriage.svg";
import donation from "../../assets/donation.svg";
import settings from "../../assets/settings.svg";
import logout from "../../assets/logout.svg";
import post from "../../assets/post.svg";
import { customAlert } from "../../helpers";
import Swal from "sweetalert2";

export default function SideBar({ selected, select }) {
  function logoutDialog() {
    Swal.fire({
      title: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,

    }).then(value => {
      if (value.isConfirmed) {
        document.cookie = `authenticated=; expires=${new Date()}`;
        window.location.reload()
      }
    });
  }

  return (
    <div id="sidebar">
      <span onClick={() => select("marriage")} className="sidebar-item-container">
        <SidebarItem
          label="Marriage"
          imagesrc={marriage}
          isSelected={selected === "marriage"}
        />
      </span>
      <span onClick={() => select("death")} className="sidebar-item-container">
        <SidebarItem
          label="Death"
          imagesrc={death}
          isSelected={selected === "death"}
        />
      </span>
      <span onClick={() => select("donation")} className="sidebar-item-container">
        <SidebarItem
          label="Donation"
          imagesrc={donation}
          isSelected={selected === "donation"}
        />
      </span>
      <span onClick={() => select("post")} className="sidebar-item-container">
        <SidebarItem
          label="Post"
          imagesrc={post}
          isSelected={selected === "post"}
        />
      </span>
      <span onClick={() => customAlert("Settings")}>
        <SidebarItem
          label="Settings"
          imagesrc={settings}
        />
      </span>
      <span onClick={() => logoutDialog()}>
        <SidebarItem
          label="Logout"
          imagesrc={logout}
        />
      </span>
    </div>
  );
}