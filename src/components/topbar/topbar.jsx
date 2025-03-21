import React from "react";
import styles from "./topbar.module.css";
import UserButton from "../userButton/userButton";

const Topbar = () => {
  return (
    <div className={styles["topBar"]}>
      {/* search */}
      <div className={styles["search"]}>
        <img src="/general/search.svg" alt="" />
        <input type="text" placeholder="Search" />
      </div>

      {/* user */}
      <UserButton />
    </div>
  );
};

export default Topbar;
