import { Link } from "react-router";
import React from "react";
import styles from "./galleryItem.module.css";

const GalleryItem = ({ item }) => {
  return (
    <div
      className={styles["galleryItem"]}
      style={{ gridRowEnd: `span ${Math.ceil(item.height / 100)}` }}
    >
      <img src={item.media} alt="" />
      <Link to={`/pin/${item.id}`} className={styles["overlay"]} />
      <button className={styles["saveButton"]}>Save</button>
      <div className={styles["overlayIcons"]}>
        <button>
          <img src="/general/share.svg" alt="" />
        </button>
        <button>
          <img src="/general/more.svg" alt="" />
        </button>
      </div>
    </div>
  );
};

export default GalleryItem;
