// AddCar.jsx
import React, { useState } from "react";
import axios from "axios";
import style from "./cars.module.css";
import { useNavigate } from "react-router-dom";

const AddCar = () => {
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [picture, setPicture] = useState("");
  const [typeCar, setTypeCar] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [carNumber, setCarNumber] = useState("");
  const [kilometer, setKilometer] = useState("");
  const [test, setTest] = useState(false);
  const [dateTest, setDateTest] = useState("");
  const [MOT, setMOT] = useState(false);
  const [dateMOT, setDateMOT] = useState("");
  const [location, setLocation] = useState("");

  const handleTestChange = () => setTest((prevState) => !prevState);
  const handleMOTChange = () => setMOT((prevState) => !prevState);

  const carData = {
    picture,
    typeCar,
    model,
    color,
    carNumber,
    kilometer,
    test,
    dateTest,
    MOT,
    dateMOT,
    location,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("carrrrrr", carData);

    try {
      const response = await axios.post("http://localhost:3000/cars", carData);
      console.log("Car added:", response.data);
      navigate("/cars"); // אחרי שליחה מוצלח, נווט חזרה לעמוד הרכבים
    } catch (error) {
      console.error("Error adding car:", error.response?.data);
    }
  };

  return (
    <div className={style.container}>
      <h2>Add New Car</h2>
      <form className={style.form} onSubmit={handleSubmit}>
        <div className={style.inputGroup}>
          <input
            className={style.input}
            placeholder="Car picture URL"
            onChange={(e) => setPicture(e.target.value)}
          />
        </div>

        <div className={style.inputGroup}>
          <label htmlFor="carType" className={style.label}>
            Car Type
          </label>
          <select
            id="carType"
            className={style.input}
            value={typeCar}
            onChange={(e) => setTypeCar(e.target.value)}
          >
            <option value="">Select car type</option>
            <option value="SUV">SUV</option>
            <option value="Sedan">Sedan</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Coupe">Coupe</option>
            <option value="Convertible">Convertible</option>
            <option value="Truck">Truck</option>
            <option value="Van">Van</option>
          </select>
        </div>

        <div className={style.inputGroup}>
          <input
            className={style.input}
            placeholder="Car model"
            onChange={(e) => setModel(e.target.value)}
          />
        </div>

        <div className={style.inputGroup}>
          <input
            className={style.input}
            placeholder="Car color"
            onChange={(e) => setColor(e.target.value)}
          />
        </div>

        <div className={style.inputGroup}>
          <input
            className={style.input}
            placeholder="Car number"
            onChange={(e) => setCarNumber(e.target.value)}
          />
        </div>

        <div className={style.inputGroup}>
          <input
            className={style.input}
            placeholder="Kilometers"
            onChange={(e) => setKilometer(e.target.value)}
          />
        </div>

        <div className={style.checkboxGroup}>
          <label>
            <input type="checkbox" checked={test} onChange={handleTestChange} />
            Technical Inspection Passed
          </label>
          {test && (
            <input
              className={style.input}
              placeholder="Date of inspection"
              type="date"
              onChange={(e) => setDateTest(e.target.value)}
            />
          )}
        </div>

        <div className={style.checkboxGroup}>
          <label>
            <input type="checkbox" checked={MOT} onChange={handleMOTChange} />
            MOT Passed
          </label>
          {MOT && (
            <input
              className={style.input}
              placeholder="MOT Date"
              type="date"
              onChange={(e) => setDateMOT(e.target.value)}
            />
          )}

          <input
            className={style.input}
            placeholder="Location"
            type="text"
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <button type="submit" className={style.submitButton}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddCar;
