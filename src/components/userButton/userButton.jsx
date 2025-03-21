import React, { useState } from "react";
import styles from "./userButton.module.css";
const UserButton = () => {
  const [open, setOpen] = useState(false);
  const currentUser = true;

  return currentUser ? (
    <div className={styles["userButton"]}>
      <img src="/general/noAvatar.png" alt="" />
      <img
        onClick={() => setOpen((prev) => !prev)}
        src="/general/arrow.svg"
        alt=""
        className={styles["arrow"]}
      />

      {open && (
        <div className={styles["userOptions"]}>
          <div className={styles["userOption"]}>Profile</div>
          <div className={styles["userOption"]}>Settings</div>
          <div className={styles["userOption"]}>Logout</div>
        </div>
      )}
    </div>
  ) : (
    <a href="/loginlink" className={styles["loginLink"]}>
      login/signup
    </a>
  );
};

export default UserButton;
