import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/footer/Footer";
import Home from "./Pages/Home/Home";
import SignUp from "./components/signUp/SignUp";
import Cars from "./components/cars/Cars";
import Header from "./components/header/Header";
import Login from "./components/login/Login";
import AddCar from "./components/cars/AddCar";
import Map from "./components/map/Map";
import RentCars from "./Pages/rentCars/RentCars";
import Payment from "./Pages/payment/Payment";
import { useAuth } from "./store/authProvider";
import { NotFound } from "./Pages/notFound/notFound";
import { AdminPanel } from "./Pages/admin/adminPanel";

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rentcars" element={<RentCars />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {user?.role === "admin" && <Route path="/admin" element={<AdminPanel/>} />}
        {user?.role === "admin" && <Route path="/cars" element={<Cars />} />}
        {user?.role === "admin" && <Route path="/addcar" element={<AddCar />} />}
        {user?.role === "admin" && <Route path="/map" element={<Map />} />}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default AppRoutes;
