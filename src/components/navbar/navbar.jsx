import "./navbar.scss"
import settings from "../../assets/settings.svg"
import Swal from "sweetalert2"

export default function NavBar() {
    return (
        <div id="navbar">
            <h2>National Shrine of Our Lady of sorrows</h2>
            <img src={settings} alt="Settings" className="icon clickable" onClick={() =>
                Swal.fire({ title: "Settings" })
            } />
        </div>
    )
}