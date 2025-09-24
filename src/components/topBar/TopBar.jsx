import React from 'react';
import "./topBar.css";
import {icons} from "../../assets/assets.js";
import UserButton from '../userButton/UserButton.jsx';

const TopBar = () => {
  return (
    <div className="topBar">
      {/* search */}
      <div className="search">
        <input type="text" placeholder='search' />
        <img src={icons.searchIcon} alt="" />
      </div>

      {/* userButton */}
      <UserButton/>
    </div>
  )
}

export default TopBar
