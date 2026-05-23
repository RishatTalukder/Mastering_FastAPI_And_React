import React from "react";
import Navbar from "../components/Navbar";
import "./MainLayout.css";

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Navbar />
      <div className="layout-content">{children}</div>
    </div>
  );
};

export default MainLayout;
