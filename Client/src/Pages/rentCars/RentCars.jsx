import { useState, useEffect, createContext, useContext } from 'react';
import styles from './rentCars.module.css';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Payment from '../payment/Payment';
import { useAppContext } from '../../components/global';

const RentCars = () => {

  const { setSharedValue } = useAppContext();
  const navigate = useNavigate();
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
  const [rentedCarsInfo, setRentedCarsInfo] = useState([]);
  const [isRentingDetails, setIsRentingDetails] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    marketingConsent: false,
    termsConsent: false
  });
  const [selectedAddons, setSelectedAddons] = useState({});
  const [searchParams] = useSearchParams();
  const [formErrors, setFormErrors] = useState({});

  const addons = [
    {
      id: 'additional_driver',
      title: "Additional Driver",
      image: 'https://rent.eldan.co.il/media/1239/additional-driver_AdditionIconReservationProcess.jpg',
      pricePerDay: 40
    },
    {
      id: 'baby_seat',
      title: "Child Seat",
      image: 'https://rent.eldan.co.il/media/1237/baby-seat-small_AdditionIconReservationProcess.jpg',
      pricePerDay: 30
    },
    {
      id: 'insurance_waiver',
      title: "Cancel Participation",
      image: 'https://rent.eldan.co.il/media/1241/excess-waiver_AdditionIconReservationProcess.jpg',
      pricePerDay: 50
    },
    {
      id: 'young_driver',
      title: "Young Driver",
      image: 'https://rent.eldan.co.il/media/1239/additional-driver_AdditionIconReservationProcess.jpg',
      pricePerDay: 60
    }
  ];

  useEffect(() => {
    const loadCarsAndApplyFilters = async () => {
      try {
        console.log('Starting to fetch cars...');
        const response = await axios.get("http://localhost:3000/cars");
        console.log('Car data received:', response.data);
        
        const carsWithImages = response.data.map(car => ({
          ...car,
          category: car.category || '',
          price: car.price || 0,
          color: car.color || '',
          img_url: car.image || 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg'
          
        }));
        
        setCars(carsWithImages);
        
        const params = Object.fromEntries(searchParams.entries());
        console.log('URL params:', params);
        
        if (Object.keys(params).length > 0) {
          setFilters(prev => ({
            ...prev,
            company: params.company || '',
            type: params.type || '',
            size: params.size || '',
            year: params.year || '',
            color: params.color || '',
            location: params.location || ''
          }));
          
          let filtered = [...carsWithImages];
          
          if (params.company) {
            filtered = filtered.filter(car => 
              car.company.toLowerCase() === params.company.toLowerCase()
            );
          }
          if (params.type) {
            filtered = filtered.filter(car => 
              car.category.toLowerCase() === params.type.toLowerCase()
            );
          }
          if (params.size) {
            switch(params.size) {
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
          if (params.year) {
            const [startYear, endYear] = params.year.split('-').map(Number);
            filtered = filtered.filter(car => {
              const carYear = Number(car.year);
              return carYear >= startYear && carYear <= endYear;
            });
          }
          if (params.color) {
            filtered = filtered.filter(car => {
              const carColor = car.color.toLowerCase().trim();
              const searchColor = params.color.toLowerCase().trim();
              return carColor === searchColor;
            });
          }
          if (params.location) {
            filtered = filtered.filter(car => 
              car.location && car.location.toLowerCase().includes(params.location.toLowerCase())
            );
          }

          console.log('Filtered results:', filtered);
          setFilteredCars(filtered);
        } else {
          setFilteredCars(carsWithImages);
        }
      } catch (error) {
        console.error('Error in loadCarsAndApplyFilters:', error);
      }
    };

    loadCarsAndApplyFilters();
  }, [searchParams]);

  axios.defaults.withCredentials = true

  const validateDates = (startDate, endDate) => {
    if (!startDate || !endDate) {
      alert("Please enter rental Dates");
      return false;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      alert("Cannot book a car for a past date");
      return false;
    }

    if (end <= start) {
      alert("The end date must be after the start date");
      return false;
    }

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      alert("Cannot book a car for less than a full day");
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
    console.log('Filtering cars with filters:', currentFilters);
    console.log('Available cars:', cars);
    
    let filtered = [...cars];
    
    if (currentFilters.company) {
      console.log('Filtering by company:', currentFilters.company);
      filtered = filtered.filter(car => 
        car.company.toLowerCase() === currentFilters.company.toLowerCase()
      );
    }
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

    console.log('Filtered results:', filtered);
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
      alert("The vehicle is already rented for these dates");
      return;
    }
    
    setSelectedCar(car);
    setIsRentingDetails(true);
  };

  const confirmBooking = () => {
    const carIndex = cars.findIndex(car => car.model === selectedCar.model);
    setRentedCarsInfo(prev => [...prev, {
      index: carIndex,
      startDate: filters.startDate,
      endDate: filters.endDate
    }]);
    alert("The order was successfully completed!");
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
    
    // Filter out all rented cars before slicing for pagination
    const availableCars = filteredCars.filter((car, index) => {
      return !(filters.startDate && filters.endDate && 
        isCarRentedForDates(index, filters.startDate, filters.endDate));
    });
    
    return availableCars.slice(indexOfFirstCar, indexOfLastCar);
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
    return rentedCarsInfo.some(rental => {
      if (rental.index !== index) return false;
      
      return isDateRangeOverlapping(
        startDate,
        endDate,
        rental.startDate,
        rental.endDate
      );
    });
  };

  const isCarCurrentlyRented = (index) => {
    if (!rentedCarsInfo || rentedCarsInfo.index !== index) return false;
    
    const today = new Date();
    const rentStart = new Date(rentedCarsInfo.startDate);
    const rentEnd = new Date(rentedCarsInfo.endDate);
    
    return today >= rentStart && today <= rentEnd;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    };
    setFormData(newFormData);

    // Clear error when user starts typing
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const toggleAddon = (addonId) => {
    setSelectedAddons(prev => ({
      ...prev,
      [addonId]: !prev[addonId]
    }));
  };

  const calculateAddonsTotal = () => {
    return addons.reduce((total, addon) => {
      return total + (selectedAddons[addon.id] ? addon.pricePerDay * calculateTotalDays() : 0);
    }, 0);
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Please enter a first name";
      isValid = false;
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Please enter a first last name";
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Please enter a email";
      isValid = false;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter a phone number";
      isValid = false;
    }
    if (!formData.address.trim()) {
      newErrors.address = "Please enter a address";
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const isFormComplete = () => {
    return Boolean(
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phone &&
      formData.address

    );
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }
    if (!selectedCar) {
      alert("Please select car first");
      return;
    }
    // חישוב הסכום הסופי
    const finalPrice = calculateTotalPrice(selectedCar.price) + calculateAddonsTotal();
    setSharedValue(finalPrice)
    
    // מספר הרכב מהרכב שנבחר
    const carNumber = selectedCar.carNumber;
    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        address: formData.address,
        phone: Number(formData.phone),
        password: "1234",
        rentalDetails: {
          carNumber: carNumber,
          totalDays: calculateTotalDays(),
          totalPrice: finalPrice,
          startDate: filters.startDate,
          endDate: filters.endDate
        }
      };
      const response = await axios.post('http://localhost:3000/user/signup', userData);
      if (response.data.userId) 
        {
        localStorage.setItem('userId', response.data.userId);
        navigate('/payment', { 
          state: { 
            amount: finalPrice,
            orderId: response.data.userId,
            orderDetails: userData
          } 
        });
      }
    } catch (error) {
      console.error('Payment Error:', error);
      alert('Order error: ' + (error.response?.data?.message || error.message));
    }
  };


  const changeCarWashStatus = async (carNumber) => {
    try {
      const response = await axios.put(`http://localhost:3000/cars/${carNumber}`, { isWashed: false , isMoved: false, isReadyForRent: false});
      console.log('Car wash status updated:', response.data);
    } catch (error) {
      console.error('Error updating car wash status:', error);
    }
  };

  return (
    <div className={styles.container}>
      {!isRentingDetails ? (
        <>
          <h1 className={styles.title}>Our Cars</h1>
          
          <div className={styles.filters}>
            <div className={styles.dateFilters}>
              <div className={styles.dateInput}>
                <label>From Date:</label>
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
                <label>To Date:</label>
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
              <h3>Filter by attributes</h3>
              <div className={styles.selectFilters}>
                <div className={styles.selectWrapper}>
                  <label>Company:</label>
                  <select 
                    name="company" 
                    value={filters.company} 
                    onChange={handleFilterChange}
                    className={styles.select}
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
                  <label>Year:</label>
                  <select 
                    name="year" 
                    value={filters.year} 
                    onChange={handleFilterChange}
                    className={styles.select}
                  >
                    <option value="">All Years</option>
                    <option value="2023-2024">2023-2024</option>
                    <option value="2021-2022">2021-2022</option>
                    <option value="2000-2020">2000-2020</option>
                    <option value="1900-1999">רכב קלאסי (לפני שנת 2000)</option>
                  </select>
                </div>

                <div className={styles.selectWrapper}>
                  <label>Color:</label>
                  <select 
                    name="color" 
                    value={filters.color} 
                    onChange={handleFilterChange}
                    className={styles.select}
                  >
                    <option value="">All Colors</option>
                    <option value="black">Black</option>
                    <option value="white">White</option>
                    <option value="red">Red</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="yellow">Yellow</option>
                    <option value="orange">Orange</option>
                    <option value="purple">Purple</option>
                  </select>
                </div>

                <div className={styles.selectWrapper}>
                  <label>Price Range:</label>
                  <select 
                    name="size" 
                    value={filters.size} 
                    onChange={handleFilterChange}
                    className={styles.select}
                  >
                    <option value="">All Prices</option>
                    <option value="small">Up to 1,000 $ per day</option>
                    <option value="medium">1,000 - 5,000 $ per day</option>
                    <option value="large">Over 5,000 $ per day</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.carsGrid}>
            {getCurrentCars().map((car, index) => (
              car.isReadyForRent === true &&  car.MOT === true &&  car.test === true &&
              <div key={index} className={styles.carCard}>
                <img src={car.img_url} alt={car.model} className={styles.carImage} />
                <h3>{car.company} {car.model}</h3>
                <p>Year: {car.year}</p>
                <p>Color: {car.color}</p>
                <p>Price per day: ${(car.price / 100).toLocaleString()}</p>

                <p className={styles.carNumber}>Car number: {car.carNumber}</p>
                {calculateTotalDays() > 0 && (
                  <p className={styles.totalPrice}>
                    Total for {calculateTotalDays()} days: ${calculateTotalPrice(car.price).toLocaleString()}
                  </p>
                )}
                <button 
                  className={styles.rentButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBooking(car);
                  }}
                >
                  Book Now
                </button>
                <p className={styles.companyName}>Company: {car.company}</p>
              </div>
            ))}
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
                <h2>Confirm Booking</h2>
                <p>Car: {selectedCar.company} {selectedCar.model}</p>
                <p>Start Date: {filters.startDate}</p>
                <p>End Date: {filters.endDate}</p>
                <p>Number of days: {calculateTotalDays()}</p>
                <p>Total to pay: ${calculateTotalPrice(selectedCar.price).toLocaleString()}</p>
                <div className={styles.modalButtons}>
                  <button 
                    className={styles.confirmButton}
                    onClick={confirmBooking}
                  >
                    Confirm Booking
                  </button>
                  <button 
                    className={styles.cancelButton}
                    onClick={() => setShowBookingModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className={styles.rentalContainer}>
          <div className={styles.sideCard}>
            <div className={styles.selectedCarSummary}>
              <h2>Booking Details</h2>
              <div className={styles.carDetails}>
                <img src={selectedCar.img_url} alt={selectedCar.model} />
                <h3>{selectedCar.company} {selectedCar.model}</h3>
                <p>Year: {selectedCar.year}</p>
              </div>
              
              <div className={styles.priceDetails}>
                <p>
                  <span>Rental Period:</span>
                  <span>{calculateTotalDays()} days</span>
                </p>
                <p>
                  <span>Price per day:</span>
                  <span>${(selectedCar.price / 100).toLocaleString()}</span>
                </p>
                <p>
                  <span>Extra</span>
                  <span>${calculateAddonsTotal().toLocaleString()}</span>
                </p>
                <div className={styles.totalPrice}>
                  <span>Total price</span>
                  <span>${(calculateTotalPrice(selectedCar.price) + calculateAddonsTotal()).toLocaleString()}</span>
                </div>
              </div>

              <div className={styles.actionButtons}>
                <button 
                  className={styles.updateButton} 
                  onClick={() => {
                    changeCarWashStatus(selectedCar.carNumber);
                    handlePayment();
                  }}
                >
                  To payment
                </button>
                <button 
                  className={styles.backButton}
                  onClick={() => setIsRentingDetails(false)}
                >
                  Back to Search
                </button>
              </div>
            </div>
          </div>

          <div className={styles.mainContent}>
            <div className={styles.formSection}>
              <h2>Renter Details</h2>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter First Name"
                    className={`${formErrors.firstName ? styles.inputError : ''}`}
                  />
                  {formErrors.firstName && (
                    <span className={styles.errorMessage}>{formErrors.firstName}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter Last Name"
                    className={`${formErrors.lastName ? styles.inputError : ''}`}
                  />
                  {formErrors.lastName && (
                    <span className={styles.errorMessage}>{formErrors.lastName}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
                    className={`${formErrors.email ? styles.inputError : ''}`}
                  />
                  {formErrors.email && (
                    <span className={styles.errorMessage}>{formErrors.email}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="050-0000000"
                    className={`${formErrors.phone ? styles.inputError : ''}`}
                  />
                  {formErrors.phone && (
                    <span className={styles.errorMessage}>{formErrors.phone}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your full address"
                    className={`${formErrors.address ? styles.inputError : ''}`}
                  />
                  {formErrors.address && (
                    <span className={styles.errorMessage}>{formErrors.address}</span>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.addonsSection}>
              <h2>Addons</h2>
              <div className={styles.addonsGrid}>
                {addons.map(addon => (
                  <div 
                    key={addon.id} 
                    className={`${styles.addonCard} ${selectedAddons[addon.id] ? styles.selected : ''}`}
                  >
                    <img src={addon.image} alt={addon.title} className={styles.addonImage} />
                    <h3>{addon.title}</h3>
                    <div className={styles.addonPricing}>
                      <p className={styles.dailyPrice}>${addon.pricePerDay} Per day</p>
                      <p className={styles.totalDaysPrice}>
                        Total for {calculateTotalDays()} days: ${addon.pricePerDay * calculateTotalDays()}
                      </p>
                    </div>
                    <button 
                      className={`${styles.addButton} ${selectedAddons[addon.id] ? styles.selected : ''}`}
                      onClick={() => toggleAddon(addon.id)}
                    >
                      {selectedAddons[addon.id] ? "Remove extra" : "Add extra"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentCars;