// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./store/authProvider";
import { ThemeProvider } from './context/ThemeContext';
import Footer from "./components/footer/Footer";
import Home from "./Pages/Home/Home";
import SignUp from "./components/signUp/SignUp"
import Cars from "./components/cars/Cars";
import Header from "./components/header/Header";
import Login from "./components/login/Login";
import AddCar from "./components/cars/AddCar";
import Map from "./components/map/Map";
import RentCars from "./Pages/rentCars/RentCars";
import Payment from "./Pages/payment/Payment";
import { AuthProvider } from "./store/authProvider";


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Header/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rentcars" element={<RentCars/>} />
            <Route path="/payment" element={<Payment/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/addcar" element={<AddCar />} />
            <Route path="/map" element={<Map />} />
          </Routes>
          <Footer/>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
