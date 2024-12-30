import React, { useEffect, useState } from 'react';
import style from '../Home/home.module.css';
import { useNavigate } from "react-router-dom";
const Home = () => {

  const navigate = useNavigate();

  const images = ["/car1.jpg", "/car2.jpg", "/car3.jpg"];
  const [currentIndex, setCurrentIndex] = useState(0);

  const moveSlide = (direction) => {
    setCurrentIndex((prevIndex) => {
      if (direction === "next") {
        return (prevIndex + 1) % images.length;
      }
      return (prevIndex - 1 + images.length) % images.length;
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      moveSlide("next");
    }, 3000);

    return () => clearInterval(interval); 
  }, []);

  return (
    <>
      <div className={style.home}>
        <main>
          <video className={style.video} autoPlay muted loop>
            <source src="video1.mp4" type="video/mp4" />
          </video>
          <div className={style.overlay}>
            <h1 className={style.title}>WheelWay</h1>
            <button onClick={() => navigate('/signup')}>get started and signup</button>
          </div>
          <div className={style.slider}>
            <img className={style.img} src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} />
              <nav className={style.nav}>
                <button className={style.arrow} onClick={() => moveSlide("prev")}>&#8592;</button>
                <button className={style.arrow} onClick={() => moveSlide("next")}>&#8594;</button>
              </nav>
          </div>
          
        </main>
      </div>
    </>
  );
};

export default Home;
