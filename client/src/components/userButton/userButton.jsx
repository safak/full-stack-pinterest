import { useState } from "react";
import "./userButton.css";
import Image from "../image/image";
import apiRequest from "../../utils/apiRequest";
import { Link, useNavigate } from "react-router";
import useAuthStore from "../../utils/authStore";

const UserButton = () => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  // TEMP
  // const currentUser = true;

  const { currentUser, removeCurrentUser } = useAuthStore();
  console.log("User Avatar:", currentUser?.img);

  console.log(currentUser);
  if (!currentUser) {
      return (
        <Link to="/auth" className="loginLink">
          Login / Sign Up
        </Link>
      );
    }
  
  const resolvedAvatar = currentUser.img?.trim() ? currentUser.img : "/general/noAvatar.png";
  const handleLogout = async () => {
    try {
      await apiRequest.post("/users/auth/logout", {});
      removeCurrentUser();
      navigate("/auth");
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
  <div className="userButton">
    <Image path={resolvedAvatar} alt="User Avatar" />

    <div onClick={() => setOpen((prev) => !prev)}>
      <Image path={resolvedAvatar} alt="Arrow" className="arrow" />
    </div>

    {open && (
      <div className="userOptions">
      <Link to={`/profile/${currentUser?.username}`} className="userOption">
          Profile
        </Link>
        <div className="userOption">Setting</div>
        <div className="userOption" onClick={handleLogout}>
          Logout
        </div>
      </div>
    )}
  </div>
);
};

export default UserButton;
