export default function SidebarItem(props) {
    return (
        <div className="sidebar-item">
            <img src={props.imagesrc} alt="icon" className="icon" />
            <div >{props.label}</div>
        </div>
    )
}