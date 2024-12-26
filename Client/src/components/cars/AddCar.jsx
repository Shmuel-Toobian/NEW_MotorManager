// AddCar.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import style from "./addCar.module.css";

const AddCar = () => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    picture: "",
    typeCar: "",
    model: "",
    color: "",
    carNumber: "",
    kilometer: "",
    test: false,
    dateTest: "",
    MOT: false,
    dateMOT: "",
    location: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/cars", formData);
      navigate("/cars");
    } catch (error) {
      console.error("Error adding car:", error.response?.data);
    }
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  return (
    <div className={style.addCarContainer}>
      <div className={style.progressBar}>
        <div 
          className={style.progress} 
          style={{ width: `${(currentStep / 3) * 100}%` }}
        ></div>
        <div className={style.steps}>
          {[1, 2, 3].map(step => (
            <div 
              key={step} 
              className={`${style.step} ${currentStep >= step ? style.active : ''}`}
            >
              {step}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className={style.addCarForm}>
        {currentStep === 1 && (
          <div className={style.formStep}>
            <h2>Basic Information</h2>
            <div className={style.inputGroup}>
              <input
                type="text"
                name="picture"
                value={formData.picture}
                onChange={handleChange}
                placeholder="Car Image URL"
                className={style.formInput}
              />
              {formData.picture && (
                <div className={style.imagePreview}>
                  <img src={formData.picture} alt="Car preview" />
                </div>
              )}
            </div>

            <div className={style.inputGroup}>
              <select
                name="typeCar"
                value={formData.typeCar}
                onChange={handleChange}
                className={style.formInput}
              >
                <option value="">Select Car Type</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Coupe">Coupe</option>
                <option value="Convertible">Convertible</option>
              </select>
            </div>

            <div className={style.inputGroup}>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Car Model"
                className={style.formInput}
              />
            </div>

            <button type="button" onClick={nextStep} className={style.nextBtn}>
              Next <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className={style.formStep}>
            <h2>Car Details</h2>
            <div className={style.inputGroup}>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="Car Color"
                className={style.formInput}
              />
              {formData.color && (
                <div 
                  className={style.colorPreview}
                  style={{ backgroundColor: formData.color }}
                ></div>
              )}
            </div>

            <div className={style.inputGroup}>
              <input
                type="text"
                name="carNumber"
                value={formData.carNumber}
                onChange={handleChange}
                placeholder="Car Number"
                className={style.formInput}
              />
            </div>

            <div className={style.inputGroup}>
              <input
                type="number"
                name="kilometer"
                value={formData.kilometer}
                onChange={handleChange}
                placeholder="Kilometers"
                className={style.formInput}
              />
            </div>

            <div className={style.buttonGroup}>
              <button type="button" onClick={prevStep} className={style.prevBtn}>
                <i className="bi bi-arrow-left"></i> Back
              </button>
              <button type="button" onClick={nextStep} className={style.nextBtn}>
                Next <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className={style.formStep}>
            <h2>Additional Information</h2>
            <div className={style.checkboxGroup}>
              <label className={style.checkboxLabel}>
                <input
                  type="checkbox"
                  name="test"
                  checked={formData.test}
                  onChange={handleChange}
                />
                <span>Technical Inspection</span>
              </label>
              {formData.test && (
                <input
                  type="date"
                  name="dateTest"
                  value={formData.dateTest}
                  onChange={handleChange}
                  className={`${style.formInput} ${style.dateInput}`}
                />
              )}
            </div>

            <div className={style.checkboxGroup}>
              <label className={style.checkboxLabel}>
                <input
                  type="checkbox"
                  name="MOT"
                  checked={formData.MOT}
                  onChange={handleChange}
                />
                <span>MOT</span>
              </label>
              {formData.MOT && (
                <input
                  type="date"
                  name="dateMOT"
                  value={formData.dateMOT}
                  onChange={handleChange}
                  className={`${style.formInput} ${style.dateInput}`}
                />
              )}
            </div>
            <div className={style.inputGroup}>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                className={style.formInput}
              />
            </div>

            <div className={style.buttonGroup}>
              <button type="button" onClick={prevStep} className={style.prevBtn}>
                <i className="bi bi-arrow-left"></i> Back
              </button>
              <button type="submit" className={style.submitBtn}>
                Add Car <i className="bi bi-check-lg"></i>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddCar;
