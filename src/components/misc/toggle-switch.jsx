import "./toggle-switch.scss"

export default function ToggleSwitch({ toggleArchive }) {
    return (
        <label className="switch">
            <input type="checkbox" onChange={(value) => {
                toggleArchive(value.target.checked)
            }} />
            <span className="slider round"></span>
        </label>
    )
}