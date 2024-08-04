import { Outlet } from "react-router-dom";

export function BaseAuth() {
  return (
    <div className="hold-transition login-page">
      <div className="login-box">
        <Outlet />
      </div>
    </div>
  );
}
