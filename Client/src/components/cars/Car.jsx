import React, { useState } from "react";
import style from "./car.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Car = ({
  picture,
  typeCar,
  model,
  color,
  carNumber,
  kilometer,
  test,
  MOT,
  location,
  dateTest,
  dateMOT,
  getCars,
}) => {
  console.log("Car props:", { location, dateTest, dateMOT });
  axios.defaults.withCredentials = true;

  const navigete = useNavigate()

  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    picture: "",
    typeCar: "",
    model: "",
    color: "",
    kilometer: "",
    test: null,
    MOT: null,
    location: ""
  });

  // פונקציה לשינוי הערכים
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdatedData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // פונקציה לעדכון רכב
  const handleUpdate = async () => {
    const finalData = {
      picture: updatedData.picture || picture,
      typeCar: updatedData.typeCar || typeCar,
      model: updatedData.model || model,
      color: updatedData.color || color,
      kilometer: updatedData.kilometer || kilometer,
      test: updatedData.test === null ? test : updatedData.test,
      MOT: updatedData.MOT === null ? MOT : updatedData.MOT,
      location: updatedData.location || location,
    };

    try {
      await axios.put(`http://localhost:3000/cars/${carNumber}`, finalData);
      getCars(); // עדכון הרשימה בקומפוננטת Cars
      setIsEditing(false); // סיום מצב עריכה
    } catch (error) {
      console.error(
        "Error updating car:",
        error.response?.data || error.message
      );
    }
  };


  const goMap = (e) => {
    e.stopPropagation();
    navigete("/map", { 
      state: { 
        location: location 
      }
    });
  }
  

  // פונקציה למחיקת רכב

  const handleDelete = async () => {
    try {
      console.log("Attempting to delete car with number:", carNumber);
      await axios.delete(`http://localhost:3000/cars/${carNumber}`);
      getCars();
    } catch (error) {
      console.error(
        "Error deleting car:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div
      className={`${style.carItem} ${isExpanded ? style.expanded : ""}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <img
        src={picture}
        alt={`${typeCar} ${model}`}
        className={style.carImage}
      />
      <div>
        <h3>
          {typeCar} - {model}
        </h3>
        <p>Car Number: {carNumber}</p>
        {isExpanded && (
          <>
            <p>Color: {color}</p>
            <p>Kilometers: {kilometer}</p>
            <p>Technical Inspection: {test ? "Passed" : "Not Passed"}</p>
            <p>MOT: {MOT ? "Passed" : "Not Passed"}</p>
            <p>Location: {location || "No location specified"}</p>
            {dateTest && <p>Test Date: {new Date(dateTest).toLocaleDateString()}</p>}
            {dateMOT && <p>MOT Date: {new Date(dateMOT).toLocaleDateString()}</p>}
            <button
              className={style.delete}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              Delete
            </button>
            <button
              className={style.edit}
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(!isEditing);
              }}
            >
              {isEditing ? "Cancel Edit" : "Edit Car"}
            </button>

                <button onClick={(e) => goMap(e)} className={style.addButton}>
                  <i className="bi bi-geo-alt-fill"></i>
                </button>

            {isEditing && (
              <form className={style.form} onClick={(e) => e.stopPropagation()}>
                <input
                  name="picture"
                  value={updatedData.picture}
                  onChange={handleChange}
                  placeholder="Picture URL"
                />
                <input
                  name="typeCar"
                  value={updatedData.typeCar}
                  onChange={handleChange}
                  placeholder="Type"
                />
                <input
                  name="model"
                  value={updatedData.model}
                  onChange={handleChange}
                  placeholder="Model"
                />
                <input
                  name="color"
                  value={updatedData.color}
                  onChange={handleChange}
                  placeholder="Color"
                />
                <input
                  name="kilometer"
                  value={updatedData.kilometer}
                  onChange={handleChange}
                  placeholder="Kilometer"
                />
                <label>
                  <input
                    type="checkbox"
                    name="test"
                    checked={
                      updatedData.test === null ? test : updatedData.test
                    }
                    onChange={handleChange}
                  />
                  Test Passed
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="MOT"
                    checked={updatedData.MOT === null ? MOT : updatedData.MOT}
                    onChange={handleChange}
                  />
                  MOT Passed
                </label>

                <input
                  name="location"
                  value={updatedData.location}
                  onChange={handleChange}
                  placeholder="location"
                />

                <button type="button" onClick={handleUpdate}>
                  Save
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Car;