import React from 'react';
import './galleryItems.css';
// import {icons} from "../../assets/icons/assets.js";
import {icons} from '../../assets/assets.js';
import {Link} from 'react-router-dom';


const GalleryItems = ({item}) => {
  return (
    <div className='galleryItem' style={{gridRowEnd: `span ${Math.ceil(item.height/100)}`}}>
      <img src={item.media} className="image"  alt="" />
      <Link to={`/pin/${item.id}`} className="overlay"></Link>
      <button className='saveButton'>
        Save
      </button>
      <div className='overlayIcons'>
        <button>
          <img src={icons.shareIcon} alt="" />
        </button>
        <button>
          <img src={icons.moreIcon} alt="" />
        </button>
      </div>
    </div>
  )
}

export default GalleryItems
