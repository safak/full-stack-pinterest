import React from 'react';
import './galleryItems.css';
// import {icons} from "../../assets/icons/assets.js";
import { icons } from '../../assets/assets.js';
import { Link } from 'react-router-dom';
import PinImage from '../image/PinImage.jsx';


const GalleryItems = ({ item }) => {
  const optimizedHeight = 372 * item.height / item.width

  return (
    <div className='galleryItem' style={{ gridRowEnd: `span ${Math.ceil(item.height / 100)}` }}>
      <PinImage src={item.media} w={372} h={optimizedHeight}/>
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
