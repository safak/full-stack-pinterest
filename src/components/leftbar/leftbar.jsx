import styles from "./leftbar.module.css";

const Leftbar = () => {
  return (
    <div className={styles["leftBar"]}>
      <div className={styles["menuIcons"]}>
        <a href="/" className={styles["menuIcon"]}>
          <img src="/general/logo.png" alt="" className={styles["logo"]} />
        </a>
        <a href="/" className={styles["menuIcon"]}>
          <img src="/general/home.svg" alt="" />
        </a>
        <a href="/" className={styles["menuIcon"]}>
          <img src="/general/create.svg" alt="" />
        </a>
        <a href="/" className={styles["menuIcon"]}>
          <img src="/general/updates.svg" alt="" />
        </a>
        <a href="/" className={styles["menuIcon"]}>
          <img src="/general/messages.svg" alt="" />
        </a>
      </div>
      <a href="/" className={styles["menuIcon"]}>
        <img src="/general/settings.svg" alt="" />
      </a>
    </div>
  );
};

export default Leftbar;
