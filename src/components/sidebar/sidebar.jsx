import SidebarItem from "./sidebar-item"
import "./sidebar.scss"
import death from "../../assets/death.svg";
import marriage from "../../assets/marriage.svg";
import donation from "../../assets/donation.svg";

export default function SideBar({ selected, select }) {
    return (
        <div id="sidebar">
            <h2>Records</h2>
            <span onClick={() => select("marriage")}>
                <SidebarItem label="Marriage Record" imagesrc={marriage} isSelected={selected === "marriage"} />
            </span>
            <span onClick={() => select("death")}>
                <SidebarItem label="Death Record" imagesrc={death} isSelected={selected === "death"} />
            </span>
            <span onClick={() => select("donation")}>
                <SidebarItem label="Donation Record" imagesrc={donation} isSelected={selected === "donation"} />
            </span>
        </div>
    )
}