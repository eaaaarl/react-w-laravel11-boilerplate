import { Logout } from "@/stores/slices/authSlice";
import { RootState } from "@/stores/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    const response = await dispatch<any>(Logout());
    if (Logout.fulfilled.match(response)) {
      navigate("/login");
    }
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="#" role="button">
            <i className="fas fa-bars"></i>
          </a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <a href="index3.html" className="nav-link">
            Home
          </a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <a href="#" className="nav-link">
            Contact
          </a>
        </li>
      </ul>

      <ul className="navbar-nav ml-auto">
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-secondary dropdown-toggle"
            data-toggle="dropdown"
            aria-expanded="false"
          >
            {user?.name || ""}
          </button>
          <div className="dropdown-menu dropdown-menu-right">
            <button className="dropdown-item" type="button">
              {user?.email || ""}
            </button>
            <button className="dropdown-item" type="button">
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="dropdown-item"
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
