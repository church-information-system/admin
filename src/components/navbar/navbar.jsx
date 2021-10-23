import "./navbar.scss";
import hamburger from "../../assets/hamburger.svg";
import SideBar from "../sidebar/sidebar";
import { getById } from "../../helpers";
import { useEffect } from "react";

export default function NavBar({ select, selected }) {
  function showSidebar() {
    getById("sidebar").style.width = "80vw";
    getById("overlay").style.width = "100vw";
  }

  function hideSidebar() {
    getById("sidebar").style.width = "0vw";
    getById("overlay").style.width = "0vw";
  }

  useEffect(
    () =>
      document
        .querySelectorAll(".sidebar-item-container")
        .forEach((element) => {
          element.addEventListener("click", () => {
            hideSidebar();
          });
        }),
    []
  );

  return (
    <div id="navbar">
      <h2>National Shrine of Our Lady of sorrows</h2>
      <img
        src={hamburger}
        title="nav"
        alt="nav"
        className="icon clickable hamburger"
        // onClick={() => Swal.fire({ title: "Settings" })}
        onClick={() => showSidebar()}
      />
      <div id="overlay" onClick={() => hideSidebar()}></div>
      <SideBar selected={selected} select={select} />
    </div>
  );
}
