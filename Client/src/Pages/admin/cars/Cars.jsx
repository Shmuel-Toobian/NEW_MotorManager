// Cars.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import axios from "axios";
import Car from "./Car";
import style from "./cars.module.css";

const Cars = () => {
  axios.defaults.withCredentials = true

  const [cars, setCars] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [filters, setFilters] = useState({
    company: "",
    year: "",
    price: "",
    color: '',
  });

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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredCars = cars.filter((car) => {
    const colorMapping = {
      'color1': 'black',
      'color2': 'white',
      'color3': 'red',
      'color4': 'blue',
      'color5': 'green',
      'color6': 'yellow',
      'color7': 'orange',
      'color8': 'purple'
    };

    const selectedColor = colorMapping[filters.color] || '';

    const checkYearRange = () => {
      if (!filters.year) return true;
      
      const carYear = car.year;
      switch(filters.year) {
        case '2023-2024':
          return carYear >= 2023 && carYear <= 2024;
        case '2021-2022':
          return carYear >= 2021 && carYear <= 2022;
        case '2000-2020':
          return carYear >= 2000 && carYear <= 2020;
        case '1900-1999':
          return carYear >= 1900 && carYear <= 1999;
        default:
          return true;
      }
    };

    return (
      (!filters.company || car.company === filters.company) &&
      checkYearRange() &&
      (!filters.price || car.price <= parseInt(filters.price)) &&
      (!filters.color || car.color.toLowerCase() === selectedColor)
    );
  });

  return (
    <div className={style.container}>
      <h1>Admin panel</h1>
      {isError && <p className={style.error}>{errorMessage}</p>}
      
      <div className={style.filtersContainer}>
        <div className={style.filterGroup}>
          <label>Company</label>
          <select
            name="company"
            value={filters.company}
            onChange={handleFilterChange}
            className={style.filterSelect}
          >
            <option value="">All Companies</option>
            <option value="Toyota">Toyota</option>
            <option value="Honda">Honda</option>
            <option value="Ford">Ford</option>
            <option value="Chevrolet">Chevrolet</option>
            <option value="BMW">BMW</option>
            <option value="Audi">Audi</option>
            <option value="Mercedes-Benz">Mercedes-Benz</option>
            <option value="Hyundai">Hyundai</option>
            <option value="Kia">Kia</option>
            <option value="Nissan">Nissan</option>
          </select>
        </div>

        <div className={style.filterGroup}>
          <label>Year</label>
          <select
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
            className={style.filterSelect}
          >
            <option value="">All Years</option>
            <option value="2023-2024">2023-2024 (New)</option>
            <option value="2021-2022">2021-2022</option>
            <option value="2000-2020">2000-2020</option>
            <option value="1900-1999">Classic car before 2000</option>
          </select>
        </div>

        <div className={style.filterGroup}>
          <label>Price</label>
          <select
            name="price"
            value={filters.price}
            onChange={handleFilterChange}
            className={style.filterSelect}
          >
            <option value="">All Prices</option>
            <option value="1000">Up to 1,000 ₪ per day</option>
            <option value="5000">Up to 5,000 ₪ per day</option>
            <option value="10000">Up to 10,000 ₪ per day</option>
            <option value="15000">Up to 15,000 ₪ per day</option>
            <option value="20000">Up to 20,000 ₪ per day</option>
          </select>
        </div>

        <div className={style.filterGroup}>
          <label>Color</label>
          <select 
            name="color"
            value={filters.color}
            onChange={handleFilterChange}
            className={style.filterSelect}
          >
            <option value="">All Colors</option>
            <option value="color1">Black</option>
            <option value="color2">White</option>
            <option value="color3">Red</option>
            <option value="color4">Blue</option>
            <option value="color5">Green</option>
            <option value="color6">Yellow</option>
            <option value="color7">Orange</option>
            <option value="color8">Purple</option>
          </select>
        </div>
      </div>

      
        <button onClick={() => navigate('/addcar')} className={style.addButton}>Add a Car</button>
      
      <div className={style.carsList}>
        {filteredCars.map((car, index) => (
          <Car
            key={index}
            image={car.image}
            typeCar={car.typeCar}
            model={car.model}
            company={car.company}
            price={car.price}
            year={car.year}
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
