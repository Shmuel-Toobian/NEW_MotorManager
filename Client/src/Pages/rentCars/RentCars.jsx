import { useState, useEffect } from 'react';
import styles from './rentCars.module.css';

const RentCars = () => {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    size: '',
    startDate: '',
    endDate: '',
    company: '',
    year: '',
    color: ''
  });
  const [filteredCars, setFilteredCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookedCar, setBookedCar] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 9;
  const [rentedCarIndex, setRentedCarIndex] = useState(null);
  const [rentedCarInfo, setRentedCarInfo] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch('/Car.json');
      const data = await response.json();
      console.log('Car data from JSON:', data);
      
      const carsWithImages = data.map(car => ({
        ...car,
        category: car.category || '',
        price: car.price || 0,
        color: car.color || '',
        img_url: car.image || 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg'
      }));
      
      console.log('Processed cars:', carsWithImages);
      
      setCars(carsWithImages);
      setFilteredCars(carsWithImages);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setCars([]);
      setFilteredCars([]);
    }
  };

  const validateDates = (startDate, endDate) => {
    if (!startDate || !endDate) {
      alert('נא לבחור תאריכי השכרה');
      return false;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      alert('לא ניתן להזמין רכב בתאריך שעבר');
      return false;
    }

    if (end <= start) {
      alert('תאריך הסיום חייב להיות אחרי תאריך ההתחלה');
      return false;
    }

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      alert('לא ניתן להזמין רכב לפחות מיום שלם');
      return false;
    }

    return true;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'startDate' || name === 'endDate') {
      const newFilters = {
        ...filters,
        [name]: value
      };
      
      if (newFilters.startDate && newFilters.endDate) {
        if (!validateDates(newFilters.startDate, newFilters.endDate)) {
          return;
        }
      }
    }

    setFilters(prev => ({
      ...prev,
      [name]: value
    }));

    filterCars({
      ...filters,
      [name]: value
    });
  };

  const filterCars = (currentFilters) => {
    let filtered = [...cars];
    console.log('Before filtering:', filtered);
    
    if (currentFilters.type) {
      filtered = filtered.filter(car => car.category.toLowerCase() === currentFilters.type.toLowerCase());
    }
    if (currentFilters.size) {
      switch(currentFilters.size) {
        case 'small':
          filtered = filtered.filter(car => car.price < 100000);
          break;
        case 'medium':
          filtered = filtered.filter(car => car.price >= 100000 && car.price < 500000);
          break;
        case 'large':
          filtered = filtered.filter(car => car.price >= 500000);
          break;
      }
    }
    if (currentFilters.company) {
      filtered = filtered.filter(car => 
        car.company.toLowerCase().includes(currentFilters.company.toLowerCase())
      );
    }
    if (currentFilters.year) {
      const [startYear, endYear] = currentFilters.year.split('-').map(Number);
      filtered = filtered.filter(car => {
        const carYear = Number(car.year);
        return carYear >= startYear && carYear <= endYear;
      });
    }
    if (currentFilters.color) {
      filtered = filtered.filter(car => 
        car.color.toLowerCase().includes(currentFilters.color.toLowerCase())
      );
    }

    console.log('After filtering:', filtered);
    setFilteredCars(filtered);
  };

  const isCarBooked = (carId) => {
    return bookedCar === carId;
  };

  const handleBooking = (car) => {
    if (!validateDates(filters.startDate, filters.endDate)) {
      return;
    }
    
    const carIndex = cars.findIndex(c => c.model === car.model);
    if (isCarRentedForDates(carIndex, filters.startDate, filters.endDate)) {
      alert('הרכב כבר מושכר בתאריכים אלו');
      return;
    }
    
    setSelectedCar(car);
    setShowBookingModal(true);
  };

  const confirmBooking = () => {
    const carIndex = cars.findIndex(car => car.model === selectedCar.model);
    setRentedCarInfo({
      index: carIndex,
      startDate: filters.startDate,
      endDate: filters.endDate
    });
    alert('ההזמנה בוצעה בהצלחה!');
    setShowBookingModal(false);
  };

  const calculateTotalDays = () => {
    if (!filters.startDate || !filters.endDate) return 0;
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = (carPrice) => {
    const days = calculateTotalDays();
    const dailyRate = carPrice / 100; // נניח שהמחיר היומי הוא 1% ממחיר הרכב
    return dailyRate * days;
  };

  const getCurrentCars = () => {
    const indexOfLastCar = currentPage * carsPerPage;
    const indexOfFirstCar = indexOfLastCar - carsPerPage;
    return filteredCars.slice(indexOfFirstCar, indexOfLastCar);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  useEffect(() => {
    console.log("rentedCarIndex changed to:", rentedCarIndex);
  }, [rentedCarIndex]);

  const isDateRangeOverlapping = (start1, end1, start2, end2) => {
    const d1 = new Date(start1);
    const d2 = new Date(end1);
    const d3 = new Date(start2);
    const d4 = new Date(end2);
    return d1 <= d4 && d3 <= d2;
  };

  const isCarRentedForDates = (index, startDate, endDate) => {
    if (!rentedCarInfo || rentedCarInfo.index !== index) return false;
    
    return isDateRangeOverlapping(
      startDate,
      endDate,
      rentedCarInfo.startDate,
      rentedCarInfo.endDate
    );
  };

  const isCarCurrentlyRented = (index) => {
    if (!rentedCarInfo || rentedCarInfo.index !== index) return false;
    
    const today = new Date();
    const rentStart = new Date(rentedCarInfo.startDate);
    const rentEnd = new Date(rentedCarInfo.endDate);
    
    return today >= rentStart && today <= rentEnd;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>השכרת רכבים</h1>
      
      <div className={styles.filters}>
        <div className={styles.dateFilters}>
          <div className={styles.dateInput}>
            <label>מתאריך:</label>
            <input 
              type="date" 
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className={styles.input}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className={styles.dateInput}>
            <label>עד תאריך:</label>
            <input 
              type="date" 
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className={styles.input}
              min={filters.startDate || new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className={styles.filterSection}>
          <h3>סינון לפי מאפיינים</h3>
          <div className={styles.selectFilters}>
            <div className={styles.selectWrapper}>
              <label>חברה:</label>
              <select 
                name="company" 
                value={filters.company} 
                onChange={handleFilterChange}
                className={styles.select}
              >
                <option value="">כל החברות</option>
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
                <option value="Volkswagen">Volkswagen</option>
                <option value="Subaru">Subaru</option>
                <option value="Mazda">Mazda</option>
                <option value="Buick">Buick</option>
                <option value="Chrysler">Chrysler</option>
                <option value="GMC">GMC</option>
                <option value="Jeep">Jeep</option>
                <option value="Land Rover">Land Rover</option>
                <option value="Ferrari">Ferrari</option>
                <option value="Tesla">Tesla</option>
              </select>
            </div>

            <div className={styles.selectWrapper}>
              <label>שנה:</label>
              <select 
                name="year" 
                value={filters.year} 
                onChange={handleFilterChange}
                className={styles.select}
              >
                <option value="">כל השנים</option>
                <option value="2023-2024">2023-2024</option>
                <option value="2021-2022">2021-2022</option>
                <option value="2000-2020">2000-2020</option>
                <option value="1900-1999">רכב קלאסי (לפני שנת 2000)</option>
              </select>
            </div>

            <div className={styles.selectWrapper}>
              <label>צבע:</label>
              <select 
                name="color" 
                value={filters.color} 
                onChange={handleFilterChange}
                className={styles.select}
              >
                <option value="">כל הצבעים</option>
                {[...new Set(cars.map(car => car.color))].sort().map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>

            <div className={styles.selectWrapper}>
              <label>טווח מחירים:</label>
              <select 
                name="size" 
                value={filters.size} 
                onChange={handleFilterChange}
                className={styles.select}
              >
                <option value="">כל המחירים</option>
                <option value="small">עד 1,000 ₪ ליום</option>
                <option value="medium">1,000 - 5,000 ₪ ליום</option>
                <option value="large">מעל 5,000 ₪ ליום</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.carsGrid}>
        {getCurrentCars().map((car, index) => {
          const isRented = filters.startDate && filters.endDate ? 
            isCarRentedForDates(index, filters.startDate, filters.endDate) : 
            false;
          
          return (
            <div 
              key={index} 
              className={`${styles.carCard} ${isRented ? styles.booked : ''}`}
            >
              <img src={car.img_url} alt={car.model} className={styles.carImage} />
              <h3>{car.company} {car.model}</h3>
              <p>שנה: {car.year}</p>
              <p>צבע: {car.color}</p>
              <p>מחיר ליום: ₪{(car.price / 100).toLocaleString()}</p>
              {calculateTotalDays() > 0 && (
                <p className={styles.totalPrice}>
                  סה"כ ל-{calculateTotalDays()} ימים: ₪{calculateTotalPrice(car.price).toLocaleString()}
                </p>
              )}
              {!isRented ? (
                <button 
                  className={styles.rentButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBooking(car);
                  }}
                >
                  הזמן עכשיו
                </button>
              ) : (
                <p className={styles.rentedDates}>
                  מושכר מ-{new Date(rentedCarInfo.startDate).toLocaleDateString('he-IL')} 
                  עד-{new Date(rentedCarInfo.endDate).toLocaleDateString('he-IL')}
                </p>
              )}
              <p className={styles.companyName}>חברה: {car.company}</p>
            </div>
          );
        })}
      </div>

      <div className={styles.pagination}>
        <button 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={styles.pageButton}
        >
          הבא
        </button>
        
        {[...Array(totalPages)].reverse().map((_, index) => {
          const pageNumber = totalPages - index;
          return (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`${styles.pageButton} ${currentPage === pageNumber ? styles.activePage : ''}`}
            >
              {pageNumber}
            </button>
          );
        })}
        
        <button 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
          הקודם
        </button>
      </div>

      {showBookingModal && selectedCar && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>אישור הזמנה</h2>
            <p>רכב: {selectedCar.company} {selectedCar.model}</p>
            <p>תאריך התחלה: {filters.startDate}</p>
            <p>תאריך סיום: {filters.endDate}</p>
            <p>מספר ימים: {calculateTotalDays()}</p>
            <p>סה"כ לתשלום: ₪{calculateTotalPrice(selectedCar.price).toLocaleString()}</p>
            <div className={styles.modalButtons}>
              <button 
                className={styles.confirmButton}
                onClick={confirmBooking}
              >
                אשר הזמנה
              </button>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowBookingModal(false)}
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentCars;