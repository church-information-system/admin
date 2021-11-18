import SidebarItem from "./sidebar-item";
import "./sidebar.scss";
import death from "../../assets/death.svg";
import marriage from "../../assets/marriage.svg";
import donation from "../../assets/donation.svg";
import password from "../../assets/password.svg";
import logout from "../../assets/logout.svg";
import post from "../../assets/post.svg";
import records from "../../assets/records.svg";
import requests from "../../assets/request.svg";
import Swal from "sweetalert2";
import { customAlert, getById, getCookie, inputGetter } from "../../helpers";
import { changePassword } from "../../api/FirebaseHelper";
import { useState } from "react";

export default function SideBar({ selected, select, hideSidebar }) {
  function logoutDialog() {
    Swal.fire({
      title: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
    }).then((value) => {
      if (value.isConfirmed) {
        document.cookie = `admin=; expires=${new Date()}`;
        window.location.reload();
      }
    });
  }

  function passwordDialog() {
    Swal.fire({
      title: "Change Your Password",
      showCancelButton: true,
      html:
        '<span class="swal2-input-label">Old Password</span>' +
        '<input id="oldPassword" class="swal2-input" type="password">' +
        '<span class="swal2-input-label">New Password</span>' +
        '<input id="newPassword" class="swal2-input" type="password">' +
        '<span class="swal2-input-label">Re-Enter New Password</span>' +
        '<input id="newPassword1" class="swal2-input" type="password">' +
        '<div id="empty" class="error-text"> </div>' +
        '<div id="notMatched" class="error-text"> </div>',
      preConfirm: () => {
        let oldPassword = inputGetter("oldPassword");
        let newPassword = inputGetter("newPassword");
        let newPassword1 = inputGetter("newPassword1");

        let noempty =
          oldPassword.length > 0 &&
          newPassword.length > 0 &&
          newPassword1.length > 0;

        if (!noempty) getById("empty").innerHTML = "Complete all fields";

        let matched = newPassword === newPassword1;

        if (!matched)
          getById("notMatched").innerHTML = "New Password doesn't match";

        return noempty && matched;
      },
    }).then(async (value) => {
      if (value.isConfirmed) {
        let changeResult = await changePassword(
          getCookie("admin"),
          inputGetter("oldPassword"),
          inputGetter("newPassword")
        );
        if (changeResult.success) {
          await customAlert(changeResult.message, "success");
          document.cookie = `admin=; expires=${new Date()}`;
          window.location.reload();
        } else {
          customAlert(changeResult.message, "error");
        }
      }
    });
  }

  function _hideSidebar() {
    try {
      hideSidebar();
    } catch {}
  }
  const [recordsShown, setRecordsShown] = useState(false);

  return (
    <div id="sidebar">
      <span
        onClick={() => setRecordsShown((currentValue) => !currentValue)}
        className="sidebar-item-container"
      >
        <SidebarItem
          label="Toggle Records"
          imagesrc={records}
          isSelected={recordsShown}
        />
      </span>
      {recordsShown ? (
        <div className="records-container">
          <span
            onClick={() => {
              select("marriage");
              _hideSidebar();
            }}
            className="sidebar-item-container"
          >
            <SidebarItem
              label="Marriage"
              imagesrc={marriage}
              isSelected={selected === "marriage"}
            />
          </span>
          <span
            onClick={() => {
              select("death");
              _hideSidebar();
            }}
            className="sidebar-item-container"
          >
            <SidebarItem
              label="Death"
              imagesrc={death}
              isSelected={selected === "death"}
            />
          </span>
          <span
            onClick={() => {
              select("donation");
              _hideSidebar();
            }}
            className="sidebar-item-container"
          >
            <SidebarItem
              label="Donation"
              imagesrc={donation}
              isSelected={selected === "donation"}
            />
          </span>
        </div>
      ) : (
        ""
      )}
      <span
        onClick={() => {
          select("post");
          _hideSidebar();
        }}
        className="sidebar-item-container"
      >
        <SidebarItem
          label="Post"
          imagesrc={post}
          isSelected={selected === "post"}
        />
      </span>
      <span
        onClick={() => {
          select("requests");
          _hideSidebar();
        }}
        className="sidebar-item-container"
      >
        <SidebarItem
          label="Requests"
          imagesrc={requests}
          isSelected={selected === "requests"}
        />
      </span>
      <span onClick={() => passwordDialog()}>
        <SidebarItem label="Change Password" imagesrc={password} />
      </span>
      <span onClick={() => logoutDialog()}>
        <SidebarItem label="Logout" imagesrc={logout} />
      </span>
    </div>
  );
}
