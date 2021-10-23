import { useState } from "react"
import "./misc.scss"

export default function Login() {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div id="login">
            <div className="login-form">
                <h1 className="login-title">Login</h1>
                <div className="form">
                    <h4 className="label">Username</h4>
                    <input type="text" className="swal2-input input" />
                    <h4 className="label">Password</h4>
                    <input className="swal2-input input" type={showPassword ? "text" : "password"} />

                    <div className="checkbox">
                        <strong className="label">Show Password</strong>
                        <input className="input" type="checkbox" onChange={(value) => {
                            console.log(value.target.checked)
                            setShowPassword(() => value.target.checked)
                        }} />
                    </div>

                    <div className="checkbox">
                        <strong className="label">Remember Me</strong>
                        <input className="input" type="checkbox" />
                    </div>

                    <div className="login-button">
                        <h3>LOGIN</h3>
                    </div>
                </div>
            </div>
        </div >
    )
}