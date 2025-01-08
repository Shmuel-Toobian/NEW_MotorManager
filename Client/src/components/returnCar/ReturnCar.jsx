import React, { useState, useEffect } from 'react';
import styles from './returnCar.module.css';
import { useAuth } from '../../store/authProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReturnCar = () => {
  const { user } = useAuth();
  const [isReadyToReturn, setIsReadyToReturn] = useState(false);
  const navigate = useNavigate();


  const handleReturnCar = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/cars/${user.rentalDetails.carNumber}`, {
        isReturn: false,
      });

        alert('החזרת הרכב בוצעה בהצלחה');
        setIsReadyToReturn(true);


        setTimeout(() => {
            navigate("/"); // ניווט לאחר 5 שניות
          }, 3000);
      
    } catch (error) {
      alert('שגיאה בחיבור לשרת');
    }
  };



  if (!user) {
    return <div>Loading...</div>; // Show a loading message or spinner until user data is available
  }

  return (
    <div className={styles.container}>
        {isReadyToReturn && <p className={styles.description}> החזרת הרכב בוצעה בהצלחה שמחנו לתת שרות!</p>}
        {!isReadyToReturn && <div> <h1 className={styles.title}>החזרת רכב</h1>
      <p className={styles.description}>שלום {user.firstName + " " + user.lastName},</p>
      <p className={styles.description}>
        נהנית בשימוש ברכב {user.rentalDetails.carModel}, מספר רכב: {user.rentalDetails.carNumber}.
      </p>
      <p className={styles.description}>האם הרכב מוכן להחזרה?</p>
      <button
        className={`${styles.button} ${isReadyToReturn ? styles.disabled : ''}`}
        onClick={() => handleReturnCar()}
        disabled={isReadyToReturn}
      >
        {!isReadyToReturn && 'החזר את הרכב'}
      </button> </div>}
     
    </div>
  );
};

export default ReturnCar;
