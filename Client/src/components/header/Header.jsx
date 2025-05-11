import React, { useState } from "react";
import style from "./header.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/authProvider";

const Header = () => {
  const { user } = useAuth();
  console.log("Current user:", user);

  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const deleteCookie = async () => {
    try {
      // הוסף את withCredentials: true כדי לשלוח את ה-cookie
      const response = await axios.post('http://localhost:3000/user/logout', {}, { withCredentials: true });
      console.log(response.data);  // הצגת התגובה שהתקבלה מהשרת
    } catch (error) {
      console.log('Error logging out:', error);
    }
  }
  
  return (
    <header className={style.header}>
      <div className={style.navs}>
        <img src="/logo.png" alt="WheelWay Logo" className={style.logo} onClick={() => navigate("/")}/>
        <div className={style.navLinks}>
          <nav className={style.nav} onClick={() => navigate("/about")}>
            About us
          </nav>
          <nav className={style.nav} onClick={() => navigate("/rentcars")}>
            Our cars
          </nav>
          {!user && <nav className={style.nav} onClick={() => navigate("/login")}>Login</nav>}
          {user?.role === "admin" && <nav className={style.nav} onClick={() => navigate("/admin")}>Admin</nav>}
          {user?.role === "carWasher" && <nav className={style.nav} onClick={() => navigate("/wash")}>Car Wash</nav>}
          {user?.role === "carMover" && <nav className={style.nav} onClick={() => navigate("/carlocation")}>Car Location</nav>}
        </div>
      </div>

      <div className={style.profileSection}>
        {user && (
          <div className={style.profileContainer}>
            <img
              src={`https://avatar.iran.liara.run/username?username=${user.firstName} ${user.lastName}`}
              alt="Profile"
              className={style.profileImage}
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown &&  (
              <div className={style.dropdown}>
                <div className={style.dropdownItem} onClick={() => {
                  navigate("/profile");
                  setShowDropdown(false);
                }}>
                  Profile
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
