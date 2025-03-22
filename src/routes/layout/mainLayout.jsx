import React from "react";
import styles from "./mainLayout.module.css";
import { Outlet } from "react-router";
import Leftbar from "../../components/leftbar/leftbar";
import Topbar from "../../components/topbar/topbar";
const MainLayout = () => {
  return (
    <div className={styles["app"]}>
      <Leftbar />
      <div className={styles["content"]}>
        <Topbar />
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
