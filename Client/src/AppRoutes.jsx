import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/footer/Footer";
import Home from "./Pages/Home/Home";
import SignUp from "./components/signUp/SignUp";
import Cars from "./Pages/admin/cars/Cars";
import Header from "./components/header/Header";
import Login from "./components/login/Login";
import AddCar from "./Pages/admin/cars/AddCar";
import Map from "./components/map/Map";
import RentCars from "./Pages/rentCars/RentCars";
import Payment from "./Pages/payment/Payment";
import About from "./Pages/about/About";
import { useAuth } from "./store/authProvider";
import { NotFound } from "./Pages/notFound/notFound";
import { AdminPanel } from "./Pages/admin/adminPanel";
import Renters from "./Pages/admin/renters/Renters";
import Profile from "./Pages/profile/Profile";
import CarWash from "./Pages/employees/CarWash";
import CarLocation from "./Pages/employees/carLocation";
import ReturnCar from "./components/returnCar/ReturnCar";
import FixCar from "./Pages/employees/FixCar";


function AppRoutes() {
  const { user } = useAuth();

  return (
    <Router>
      <Header />
      <Routes>
        {/* User */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/rentcars" element={<RentCars />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/returncar" element={<ReturnCar />} />
        <Route path="/fixcar" element={<FixCar />} />


        {/* Admin */}
        {user?.role === "admin" && <Route path="/admin" element={<AdminPanel/>} />}
        {user?.role === "admin" && <Route path="/cars" element={<Cars />} />}
        {user?.role === "admin" && <Route path="/addcar" element={<AddCar />} />}
        {user?.role === "admin" &&  <Route path="/renters" element={<Renters />} />}


        {/* Admin, CarWasher, CarMover */}
        {(user?.role === "admin" || user?.role === "carWasher" || user?.role === "carMover") &&  <Route path="/profile" element={<Profile />} />}
        {(user?.role === "admin" || user?.role === "carWasher") &&  <Route path="/carwash" element={<CarWash />} />}
        {(user?.role === "admin" || user?.role === "carMover") && <Route path="/carlocation" element={<CarLocation />} />}
        {(user?.role === "admin" || user?.role === "carMover") && <Route path="/map" element={<Map />} />}


        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default AppRoutes;
