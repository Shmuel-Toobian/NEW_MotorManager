import React, { useState, useEffect } from 'react';
import styles from './home.module.css';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const images = [
  "car1.jpg",
  "car2.jpg",
  "car3.jpg",
];

const video = [
  "video1.mp4",
  "video2.mp4",
  "video3.mp4",
];

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(0);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    location: '',
    company: '',
    year: '',
    color: '',
    priceRange: ''
  });

  useEffect(() => {
    const videoInterval = setInterval(() => {
      setTimeout(() => {
        setCurrentVideo((prev) => (prev + 1) % video.length);
      }, 1000);
    }, 7000);

    return () => clearInterval(videoInterval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    const filteredParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => value !== '')
    );

    const rentCarsParams = {
      ...(filteredParams.company && { company: filteredParams.company }),
      ...(filteredParams.year && { year: filteredParams.year }),
      ...(filteredParams.color && { color: filteredParams.color.replace('color', '').trim() }),
      ...(filteredParams.priceRange && { size: filteredParams.priceRange }),
      ...(filteredParams.location && { location: filteredParams.location }),
      ...(filteredParams.type && { type: filteredParams.type })
    };

    navigate({
      pathname: '/rentcars',
      search: new URLSearchParams(rentCarsParams).toString()
    });
  };

  return (
    <div className={styles.home}>
      <button 
        className={styles.darkModeToggle}
        onClick={toggleDarkMode}
      >
      </button>
      <br />
      <br />
      <div className={styles.container}>
        <div className={styles.leftContent}>
          <h1 className={styles.title}>WheelWay</h1>
          <p className={styles.subtitle}>Experience the freedom of the road with WheelWay - your trusted partner for car rentals</p>
          <img 
            src="/carm.png" 
            alt="Car" 
            className={styles.carImage}
          />
        </div>
        <div className={styles.searchContainer}>
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <div className={styles.searchContainer}>
            

              <div className={styles.inputGroup}>
                <label>Company</label>
                <select 
                  value={searchParams.company}
                  onChange={(e) => setSearchParams(prev => ({...prev, company: e.target.value}))}
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

              <div className={styles.inputGroup}>
                <label>Year</label>
                <select 
                  value={searchParams.year}
                  onChange={(e) => setSearchParams(prev => ({...prev, year: e.target.value}))}
                >
                  <option value="">All Years</option>
                  <option value="2023-2024">2023-2024</option>
                  <option value="2021-2022">2021-2022</option>
                  <option value="2000-2020">2000-2020</option>
                  <option value="1900-1999">Classic Car</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>Price Range</label>
                <select 
                  value={searchParams.priceRange}
                  onChange={(e) => setSearchParams(prev => ({...prev, priceRange: e.target.value}))}
                >
                  <option value="">All Prices</option>
                  <option value="small">Up to 1,000 ₪ per day</option>
                  <option value="medium">1,000 - 5,000 ₪ per day</option>
                  <option value="large">Over 5,000 ₪ per day</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>Color</label>
                <select 
                  value={searchParams.color}
                  onChange={(e) => setSearchParams(prev => ({...prev, color: e.target.value}))}
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

              <button type="submit" className={styles.searchButton}>
                Get an offer
              </button>
            </div>
          </form>
        </div>
      </div>
      <section className={styles.about}>
        <div className={styles.features}>
          <div className={styles.feature}>
            <i className="fas fa-car"></i>
            <h3>Wide Selection</h3>
            <p>Choose from hundreds of quality vehicles</p>
          </div>
          <div className={styles.feature}>
            <i className="fas fa-shield-alt"></i>
            <h3>Safe & Secure</h3>
            <p>All vehicles are fully insured and maintained</p>
          </div>
          <div className={styles.feature}>
            <i className="fas fa-dollar-sign"></i>
            <h3>Best Prices</h3>
            <p>Competitive rates and special offers</p>
          </div>
        </div>
      </section>

      <section className={styles.showcase}>
        <h2>Featured Vehicles</h2>
        <div className={styles.carousel}>
          <div 
            className={styles.carouselTrack} 
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={index} className={styles.carouselSlide}>
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className={styles.carouselImage}
                />
              </div>
            ))}
          </div>
          <button 
            className={`${styles.carouselButton} ${styles.carouselButtonLeft}`} 
            onClick={prevSlide}
          >
            &#8592;
          </button>
          <button 
            className={`${styles.carouselButton} ${styles.carouselButtonRight}`} 
            onClick={nextSlide}
          >
            &#8594;
          </button>
        </div>
      </section>

      <section className={styles.cta}>
        <h2>Ready to Hit the Road?</h2>
        <p>Find your perfect rental car today</p>
        <button onClick={() => navigate('/rentcars')}>See our cars</button>
      </section>
    </div>
  );
}

export default Home;
