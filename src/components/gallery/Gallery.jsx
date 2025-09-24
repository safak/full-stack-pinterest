import React from "react";
import GalleryItems from "../galleryItems/GalleryItems.jsx";
import { items } from "../../assets/assets.js";
import "./gallery.css";

const Gallery = () => {
  return (
    <div className="gallery">
      {items.map((item) => (
        <GalleryItems item={item} key={item.id} />
      ))}
    </div>
  );
};

export default Gallery;
