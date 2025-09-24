import React from 'react';
import './galleryItems.css';


const GalleryItems = ({item}) => {
  return (
    <div className='galleryItems' style={{gridRowEnd: `span ${Math.ceil(item.height/100)}`}}>
      <img src={item.media} className="image"  alt="" />
    </div>
  )
}

export default GalleryItems
