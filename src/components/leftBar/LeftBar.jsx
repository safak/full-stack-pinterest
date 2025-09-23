import React from "react";
import "./leftBar.css";
import { icons } from "../../general/assets.js";

const LeftBar = () => {
  return (
    <div className="leftBar">
      <div className="menuIcons">
        <a href="/">
          <img src={icons.logoIcon} className="logo" alt="" />
        </a>
        <a href="/">
          <img src={icons.homeIcon} className="menuIcon" alt="" />
        </a>
        <a href="/">
          <img src={icons.createIcon} className="menuIcon" alt="" />
        </a>
        <a href="/">
          <img src={icons.updatesIcon} className="menuIcon" alt="" />
        </a>
        <a href="/">
          <img src={icons.messageIcon} className="menuIcon" alt="" />
        </a>
      </div>
      <a href="/">
        <img src={icons.settingIcon} className="menuIcon" alt="" />
      </a>
    </div>
  );
};

export default LeftBar;
