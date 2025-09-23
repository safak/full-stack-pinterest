import React, { useState } from "react";
import "./userButton.css";
import { icons } from "../../general/assets";

const UserButton = () => {
  const currentUser = true; // placeholder for authentication state
  const [open, setOpen] = useState(false);

  return currentUser ? (
    <div className="userButton">
      <img src={icons.noAvatarIcon} alt="User avatar" />
      <img
        src={icons.arrowIcon}
        onClick={() => setOpen((prev) => !prev)}
        className="arrow"
        alt="Toggle menu"
      />
      {open && (
        <div className="userOptions">
          <button className="userOption">Profile</button>
          <button className="userOption">Settings</button>
          <button className="userOption">Logout</button>
        </div>
      )}
    </div>
  ) : (
    <a href="/" className="loginLink">
      Login / Sign Up
    </a>
  );
};

export default UserButton;
