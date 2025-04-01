import React from 'react'
import './TopBar.css'
import UserButton from '../UserButton/UserButton'

function TopBar() {
  return (
    <div className="topBar">
      {/* SEARCH */}
      <div className="search">
        <img src="/general/search.svg" alt="" />
        <input type="text" placeholder='Search' />
      </div>
      {/* USER */}
      <UserButton/>
    </div>
  )
}
export default TopBar