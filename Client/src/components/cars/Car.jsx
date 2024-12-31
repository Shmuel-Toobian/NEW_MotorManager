import React, { useState } from "react";
import style from "./car.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Car = ({
  image,
  typeCar,
  model,
  company,
  year,
  price,
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
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    image: "",
    typeCar: "",
    model: "",
    company: "",
    price: "",
    year: "",
    color: "",
    kilometer: "",
    test: null,
    MOT: null,
    location: "",
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
      image: updatedData.image || image,
      typeCar: updatedData.typeCar || typeCar,
      model: updatedData.model || model,
      company: updatedData.company || company,
      price: updatedData.price || price,
      year: updatedData.year || year,
      color: updatedData.color || color,
      kilometer: updatedData.kilometer || kilometer,
      test: updatedData.test === null ? test : updatedData.test,
      MOT: updatedData.MOT === null ? MOT : updatedData.MOT,
      location: updatedData.location || location,
    };

    try {
      const encodedCarNumber = encodeURIComponent(carNumber);
      console.log("Updating car number:", encodedCarNumber);

      const response = await axios.put(
       ` http://localhost:3000/cars/${encodedCarNumber}`,
        finalData
      );

      console.log("Update response:", response.data);
      getCars(); // עדכון הרשימה
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating car:", error.response?.data || error.message);
      alert("שגיאה בעדכון הרכב. אנא בדוק את הנתונים ונסה שוב.");
    }
  };

  // ניווט למפה
  const goMap = (e) => {
    e.stopPropagation();
    navigate("/map", {
      state: { location },
    });
  };

  // פונקציה למחיקת רכב
  const handleDelete = async () => {
    try {
      console.log("Attempting to delete car with number:", carNumber);
      await axios.delete(`http://localhost:3000/cars/${carNumber}`);
      getCars();
    } catch (error) {
      console.error("Error deleting car:", error.response?.data || error.message);
    }
  };

  return (
    <div
      className={`${style.carItem} ${isExpanded ? style.expanded : ""}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <img
        src={image}
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
            <p>Price: {price}</p>
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
                  type="file"
                  name="image"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setUpdatedData((prev) => ({
                        ...prev,
                        image: URL.createObjectURL(file),
                      }));
                    }
                  }}
                  className={style.formInput}
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
                  name="company"
                  value={updatedData.company}
                  onChange={handleChange}
                  placeholder="Company"
                />
                <input
                  name="color"
                  value={updatedData.color}
                  onChange={handleChange}
                  placeholder="Color"
                />
                 <input
                  name="price"
                  value={updatedData.price}
                  onChange={handleChange}
                  placeholder="Price"
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
                    checked={updatedData.test === null ? test : updatedData.test}
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
                  placeholder="Location"
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
