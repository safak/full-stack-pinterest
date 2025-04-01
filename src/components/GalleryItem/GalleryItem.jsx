import React from 'react'
import './GalleryItem.css'
import { Link } from 'react-router'

function GalleryItem({item}) {
  return (
    <div className='galleryItem' style={{gridRowEnd:`span ${Math.ceil(item.height/100)}`}}>
        <img src={item.media} alt="" />
        <Link to={`/pin/${item.id}`} className='"over'></Link>
    </div>
  )
}

export default GalleryItem