import React, { useState } from 'react'
import './UserButton.css'

function UserButton() {
  
    const [open , setOpen] = useState(false);

    //TEMP
    const currentUser = true;

    return currentUser ?  (
        <div className="userButton">
            <img src="/general/noAvatar.png" alt="" />
            <img 
                onClick={() => setOpen((prev) => !prev)}
                src="/general/arrow.svg"
                alt="" 
             className='arrow'/>
        {open &&
            <div className="userOptions">
                <div className="userOption">Profile</div>
                <div className="userOption">Setting</div>
                <div className="userOption">Logout</div>
            </div>
        }
        </div>

    ) : (
        <a href="/" className='loginLink'>
          Login / Sign Up
        </a>

    );
  
}

export default UserButton