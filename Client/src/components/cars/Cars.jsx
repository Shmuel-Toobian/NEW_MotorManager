// Cars.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // עבור הניווט
import axios from "axios";
import Car from "./Car";
import style from "./cars.module.css";

const Cars = () => {
  axios.defaults.withCredentials = true

  const [cars, setCars] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const getCars = async () => {
    try {
      const response = await axios.get("http://localhost:3000/cars");
      setCars(response.data);
      setErrorMessage("");
      setIsError(false);
    } catch (error) {
      setIsError(true);
      setErrorMessage(error.response?.data?.message || "An unknown error occurred");
    }
  };

  useEffect(() => {
    getCars();
  }, []);

  return (
    <div className={style.container}>
      <h1>Your Cars</h1>
      {isError && <p className={style.error}>{errorMessage}</p>}
      <div className={style.searchContainer}>
        <input type="text" placeholder="Search for a car..." className={style.input} />
        <i className={`bi bi-search ${style.searchIcon}`}></i>
      </div>
      <Link to="/addcar">
        <button className={style.addButton}>Add a Car</button>
      </Link>
      <div className={style.carsList}>
        {cars.map((car, index) => (
          <Car
            key={index}
            picture={car.picture}
            typeCar={car.typeCar}
            model={car.model}
            color={car.color}
            carNumber={car.carNumber}
            kilometer={car.kilometer}
            test={car.test}
            MOT={car.MOT}
            location={car.location}
            dateTest={car.dateTest}
            dateMOT={car.dateMOT}
            getCars={getCars}
          />
        ))}
      </div>
    </div>
  );
};

export default Cars;
