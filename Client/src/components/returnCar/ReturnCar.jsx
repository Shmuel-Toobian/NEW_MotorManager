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
        isReadyToReturn: true
      });

        alert("The vehicle has been successfully returned");
        setIsReadyToReturn(true);


        setTimeout(() => {
            navigate("/"); // ניווט לאחר 5 שניות
          }, 3000);
      
    } catch (error) {
      alert("Connection error to the server")
    }
  };



  if (!user) {
    return <div>Loading...</div>; // Show a loading message or spinner until user data is available
  }

  return (
    <div className={styles.container}>
        {isReadyToReturn && <p className={styles.description}> The vehicle has been successfully returned. We were happy to serve you!</p>}
        {!isReadyToReturn && <div> <h1 className={styles.title}>Vehicle Return</h1>
      <p className={styles.description}>Hello {user.firstName + " " + user.lastName},</p>
      <p className={styles.description}>
      Did you enjoy using the vehicle? {user.rentalDetails.carModel},  Car number: {user.rentalDetails.carNumber}.
      </p>
      <p className={styles.description}>Is the vehicle ready for return?</p>
      <button
        className={`${styles.button} ${isReadyToReturn ? styles.disabled : ''}`}
        onClick={() => handleReturnCar()}
        disabled={isReadyToReturn}
      >
        {!isReadyToReturn && "Return the vehicle"}
      </button> </div>}
     
    </div>
  );
};

export default ReturnCar;
