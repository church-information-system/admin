import Divider from "./divider"
import SidebarItem from "./sidebar-item"
import "./sidebar.scss"
import death from "../../assets/death.svg";
import marriage from "../../assets/marriage.svg";
import donation from "../../assets/donation.svg";

export default function SideBar() {
    return (
        <div id="sidebar">

            <h2>Records</h2>
            <SidebarItem label="Marriage Record" imagesrc={marriage} />
            <Divider />
            <SidebarItem label="Death Record" imagesrc={death} />
            <Divider />
            <SidebarItem label="Donation Record" imagesrc={donation} />
        </div>
    )
}