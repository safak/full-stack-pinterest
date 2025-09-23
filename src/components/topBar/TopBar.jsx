import React from 'react';
import "./topBar.css";
import { icons } from "../../general/assets";
import UserButton from '../userButton/userButton.jsx';

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
