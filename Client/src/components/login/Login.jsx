import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../store/authProvider";
import style from "./login.module.css";  // ייבוא ה-CSS מודול

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log({ email, password });

      const response = await axios.post(
        "http://localhost:3000/user/login",
        { email, password },
        { withCredentials: true }
      );
      setUser(response.data.user);
      if(response.data.user.role === "user"){
        navigate("/returncar");
      }
      else{
        navigate("/");
      }
      
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className={style.login}>
    <form onSubmit={handleSubmit} className={style.loginForm}>
      <h2 className={style.loginHeading}>Login</h2>
      {error && <p className={style.loginError}>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={style.loginInput}
      />
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={style.loginInput}
        />
      </div>
      <button type="submit" className={style.loginButton}>
        Login
      </button>
    </form>
    </div>
  );
};

export default Login;
