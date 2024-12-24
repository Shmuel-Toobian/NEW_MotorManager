import React, { useContext, useState } from "react";
import style from "./form.module.css";
import axios from "axios";
import { userContext } from "../../Context/userContext";
import { useNavigate } from "react-router-dom";

const Form = ({ userName }) => {

  const {user, setUser} = useContext(userContext)



  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();
  const userData = { name, email, password };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:3000/user/${userName ? "signup" : "login"}`,
        userData,
        { withCredentials: true }
      );

      if(response.data.user){
        setUser(response.data.user)
      }

      console.log( 'responsssssss', response);
      
      setIsError(false);
      setErrorMessage("");
      if (userName) navigate("/login");
      else navigate("/cars");
    } catch (error) {
      setIsError(true);
      setErrorMessage(error.response?.data?.message || "An unknown error occurred");
    }
  };

  return (
    <div className={style.container}>
      <form className={style.form} onSubmit={handleSubmit}>
        <h1>{userName ? "Sign Up" : "Login"}</h1>
        {userName && (
          <div>
            <label className={style.label}>Name</label>
            <input className={style.input} type="text" onChange={(e) => setName(e.target.value)} />
          </div>
        )}
        <div>
          <label className={style.label}>Email</label>
          <input className={style.input} type="email" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className={style.label}>Password</label>
          <input className={style.input} type="password" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className={style.formSendButton}>
          {userName ? "Sign Up" : "Login"}
        </button>
        {userName && (
          <p className={style.linkText}>
            Have an account?{" "}
            <span className={style.link} onClick={() => navigate("/login")}>
              Login
            </span>
          </p>
        )}
        {!userName && (
          <p className={style.linkText}>
            Don't have an account?{" "}
            <span className={style.link} onClick={() => navigate("/signup")}>
              Sign Up
            </span>
          </p>
        )}
        {isError && <p className={style.error}>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Form;
