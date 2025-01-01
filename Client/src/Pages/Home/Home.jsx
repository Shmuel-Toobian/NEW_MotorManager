import React, { useState, useEffect } from 'react';
import style from './home.module.css';
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

    navigate({
      pathname: '/rentcars',
      search: new URLSearchParams(filteredParams).toString()
    });
  };

  return (
    <div className={style.home}>
      <button 
        className={style.darkModeToggle}
        onClick={toggleDarkMode}
      >
      </button>
      <br />
      <br />
      <div className={style.homeTop}>
        <h1 className={style.title}>WheelWay</h1>
        <p className={style.p}>Experience the freedom of the road with WheelWay - your trusted partner for car rentals</p>
        
        <form className={style.searchForm} onSubmit={handleSearch}>
          <div className={style.searchContainer}>
          

            <div className={style.inputGroup}>
              <label>חברה</label>
              <select 
                value={searchParams.company}
                onChange={(e) => setSearchParams(prev => ({...prev, company: e.target.value}))}
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

            <div className={style.inputGroup}>
              <label>שנה</label>
              <select 
                value={searchParams.year}
                onChange={(e) => setSearchParams(prev => ({...prev, year: e.target.value}))}
              >
                <option value="">כל השנים</option>
                <option value="2023-2024">2023-2024</option>
                <option value="2021-2022">2021-2022</option>
                <option value="2000-2020">2000-2020</option>
                <option value="1900-1999">רכב קלאסי</option>
              </select>
            </div>

            <div className={style.inputGroup}>
              <label>טווח מחירים</label>
              <select 
                value={searchParams.priceRange}
                onChange={(e) => setSearchParams(prev => ({...prev, priceRange: e.target.value}))}
              >
                <option value="">כל המחירים</option>
                <option value="small">עד 1,000 ₪ ליום</option>
                <option value="medium">1,000 - 5,000 ₪ ליום</option>
                <option value="large">מעל 5,000 ₪ ליום</option>
              </select>
            </div>

            <div className={style.inputGroup}>
              <label>צבע</label>
              <select 
                value={searchParams.color}
                onChange={(e) => setSearchParams(prev => ({...prev, color: e.target.value}))}
              >
                <option value="color">כל הצבעים</option>
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

            <button type="submit" className={style.searchButton}>
              חפש רכב
            </button>
          </div>
        </form>
      </div>
      <section className={style.about}>
        <div className={style.features}>
          <div className={style.feature}>
            <i className="fas fa-car"></i>
            <h3>Wide Selection</h3>
            <p>Choose from hundreds of quality vehicles</p>
          </div>
          <div className={style.feature}>
            <i className="fas fa-shield-alt"></i>
            <h3>Safe & Secure</h3>
            <p>All vehicles are fully insured and maintained</p>
          </div>
          <div className={style.feature}>
            <i className="fas fa-dollar-sign"></i>
            <h3>Best Prices</h3>
            <p>Competitive rates and special offers</p>
          </div>
        </div>
      </section>

      <section className={style.showcase}>
        <h2>Featured Vehicles</h2>
        <div className={style.carousel}>
          <div 
            className={style.carouselTrack} 
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={index} className={style.carouselSlide}>
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className={style.carouselImage}
                />
              </div>
            ))}
          </div>
          <button 
            className={`${style.carouselButton} ${style.carouselButtonLeft}`} 
            onClick={prevSlide}
          >
            &#8592;
          </button>
          <button 
            className={`${style.carouselButton} ${style.carouselButtonRight}`} 
            onClick={nextSlide}
          >
            &#8594;
          </button>
        </div>
      </section>

      <section className={style.cta}>
        <h2>Ready to Hit the Road?</h2>
        <p>Find your perfect rental car today</p>
        <button onClick={() => navigate('/rentcars')}>See our cars</button>
      </section>
    </div>
  );
}

export default Home;
