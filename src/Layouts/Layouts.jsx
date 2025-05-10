import React, { useState, useEffect } from "react";
import SideMenu from "../components/SideMenu";

export const Layout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="d-flex min-vh-100">
      <SideMenu />
      <main
        className={`flex-grow-1 content-with-sidebar ${
          isMobile && sidebarOpen ? "overlay" : ""
        }`}
      >
        <div className="container-fluid py-4 px-4">{children}</div>
      </main>
    </div>
  );
};
