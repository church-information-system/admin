import { useState } from "react";
import { login } from "../../api/FirebaseHelper";
import { customAlert, inputGetter } from "../../helpers";
import { MiniLoader } from "./loader";
import "./misc.scss";

export default function Login({ authenticate }) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submitLogin() {
    setSubmitting(() => true);
    let username = inputGetter("username");
    let password = inputGetter("password");

    let noempty = username.length > 0 && password.length > 0;

    if (noempty) {
      let loginResult = await login(username, password);
      if (loginResult) {
        setSubmitting(() => false);
        customAlert("Success", "success");
        if (rememberMe) {
          let expiry = new Date();
          expiry.setDate(expiry.getDate() + 3);
          document.cookie = `admin=${loginResult}; expires=${expiry}; SameSite=Lax`;
        }
        authenticate();
      } else {
        customAlert("Failed to sign in", "error");
        setSubmitting(() => false);
      }
    } else {
      customAlert("Please Fill All Fields", "info");
      setSubmitting(() => false);
    }
  }

  return (
    <div id="login">
      <div className="login-form">
        <h1 className="login-title">Admin Login</h1>
        <div className="form">
          <h4 className="label">Username</h4>
          <input id="username" type="text" className="swal2-input input" />
          <h4 className="label">Password</h4>
          <input
            id="password"
            className="swal2-input input"
            type={showPassword ? "text" : "password"}
          />

          <div className="checkbox">
            <strong className="label">Show Password</strong>
            <input
              className="input"
              type="checkbox"
              onChange={(value) => {
                setShowPassword(() => value.target.checked);
              }}
            />
          </div>

          <div className="checkbox">
            <strong className="label">Remember Me</strong>
            <input
              className="input"
              type="checkbox"
              onChange={(value) => setRememberMe(() => value.target.checked)}
            />
          </div>

          <div className="login-button" onClick={() => submitLogin()}>
            {submitting ? (
              <h3>
                <MiniLoader />
              </h3>
            ) : (
              <h3>LOGIN</h3>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
