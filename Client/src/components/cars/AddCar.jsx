import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import style from "./addCar.module.css";

const AddCar = () => {
  // הגדרת state להעלאת תמונה
  const [uploading, setUploading] = useState(false);

  // הגדרת state למילוי הטופס
  const [formData, setFormData] = useState({
    image: "",
    company: "",
    year: "",
    price: "",
    typeCar: "",
    model: "",
    color: "",
    carNumber: "",
    kilometer: "",
    test: false,
    dateTest: "",
    MOT: false,
    dateMOT: "",
    location: "",
  });

  // ניווט לדף אחר אחרי הוספת רכב
  const navigate = useNavigate();

  // שלב הנוכחי בטופס
  const [currentStep, setCurrentStep] = useState(1);

  // פונקציה לעדכון ערכים בטופס
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // פונקציה להעלאת התמונה
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true); // סימן שההעלאה התחילה
    const formDataImg = new FormData();
    formDataImg.append("file", file);
    formDataImg.append("upload_preset", "carsProject");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dcro5sucx/image/upload",
        {
          method: "POST",
          body: formDataImg,
        }
      );

      const data = await response.json();
      console.log(data.secure_url);

      // עדכון ה-URL של התמונה ב-formData
      setFormData((prev) => ({ ...prev, image: data.secure_url }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image. Please try again.");
    } finally {
      setUploading(false); // סימן שההעלאה הסתיימה
    }
  };

  // פונקציה לשליחת הנתונים
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    // בדיקה אם כל השדות מלאים
    if (
      !formData.typeCar ||
      !formData.model ||
      !formData.color ||
      !formData.carNumber ||
      !formData.kilometer ||
      !formData.company ||
      !formData.year ||
      !formData.price ||
      !formData.location
    ) {
      alert("All fields are required!");
      return;
    }

    try {
      await axios.post("http://localhost:3000/cars", formData);
      navigate("/cars"); // ניווט לדף רכבים אחרי ההוספה
    } catch (error) {
      console.error("Error adding car:", error.response?.data);
      alert("Error adding car: " + error.response?.data?.message);
    }
  };

  // מעבר בין שלבים בטופס
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  return (
    <div className={style.addCarContainer}>
      <div className={style.progressBar}>
        <div
          className={style.progress}
          style={{ width: `${(currentStep / 3) * 100}%` }}
        ></div>
        <div className={style.steps}>
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`${style.step} ${
                currentStep >= step ? style.active : ""
              }`}
            >
              {step}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className={style.addCarForm}>
        {/* שלב 1 - פרטי רכב בסיסיים */}
        {currentStep === 1 && (
          <div className={style.formStep}>
            <h2>Basic Information</h2>
            <div className={style.inputGroup}>
              <input
                type="file"
                name="image"
                onChange={handleImageUpload}
                className={style.formInput}
              />
              {formData.image && (
                <div className={style.imagePreview}>
                  <img src={formData.image} alt="Car preview" />
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

            <div className={style.inputGroup}>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Car Company"
                className={style.formInput}
              />
            </div>

            <button type="button" onClick={nextStep} className={style.nextBtn}>
              Next <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        )}

        {/* שלב 2 - פרטי הרכב */}
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
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="year"
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
              <button
                type="button"
                onClick={prevStep}
                className={style.prevBtn}
              >
                <i className="bi bi-arrow-left"></i> Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className={style.nextBtn}
              >
                Next <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* שלב 3 - מידע נוסף */}
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
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price for day"
                className={style.formInput}
              />
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
              <button
                type="button"
                onClick={prevStep}
                className={style.prevBtn}
              >
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
