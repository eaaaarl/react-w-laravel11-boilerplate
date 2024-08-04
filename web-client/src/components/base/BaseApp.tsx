import React from "react";
import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";
import Sidebar from "../ui/Sidebar";
import { Outlet } from "react-router-dom";

const BaseApp: React.FC = () => {
  return (
    <div className="hold-transition sidebar-mini">
      <div className="wrapper">
        <Navbar />
        <Sidebar />
        <div className="content-wrapper">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default BaseApp;
