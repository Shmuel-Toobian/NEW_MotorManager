// FixCar.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./fixCar.module.css";

const FixCar = () => {
  const [cars, setCars] = useState([]);

  // Fetch cars with issues
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:3000/cars");

        const faultyCars = response.data.filter((car) => car.MOT === false || car.test === false);
        setCars(faultyCars);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchCars();
  }, []);

  // Mark car as fixed
  const markAsFixed = async (carNumber) => {
    try {
      await axios.put(`http://localhost:3000/cars/${carNumber}`, { MOT: true, test: true });
      setCars((prevCars) => prevCars.filter((car) => car.carNumber !== carNumber));
    } catch (error) {
      console.error("Error updating car:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cars with Issues</h1>
      {cars.length === 0 ? (
        <p className={styles.message}>All cars are in good condition!</p>
      ) : (
        <ul className={styles.carList}>
          {cars.map((car) => (
            <li key={car._id} className={styles.carItem}>
              <span>{car.carNumber}</span>
              <button
                className={styles.fixButton}
                onClick={() => markAsFixed(car.carNumber)}
              >
                Mark as Fixed
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FixCar;