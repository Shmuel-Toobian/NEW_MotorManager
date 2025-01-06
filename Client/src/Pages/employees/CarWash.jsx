import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './CarWash.module.css';

const CarWash = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [washedCars, setWashedCars] = useState(new Set());

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const response = await axios.get('http://localhost:3000/cars');
      setRentals(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching rentals:', err);
      setError('שגיאה בטעינת הנתונים');
      setLoading(false);
    }
  };

  const handleCarWashed = (rentalId) => {
    setWashedCars(prev => new Set([...prev, rentalId]));
    localStorage.setItem('washedCars', JSON.stringify([...washedCars, rentalId]));
  };

  if (loading) return <div className={styles.container}>טוען...</div>;
  if (error) return <div className={styles.container}>{error}</div>;
  if (!rentals.length) return <div className={styles.container}>אין רכבים להצגה</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>רכבים לשטיפה</h1>
      <div className={styles.cardsGrid}>
        {rentals.map((rental) => (
          <div key={rental._id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>רכב מספר: {rental.carNumber}</h3>
              <span className={styles.status}>
                {washedCars.has(rental._id) ? '✅ נשטף' : '🚿 ממתין לשטיפה'}
              </span>
            </div>
            
            <div className={styles.cardContent}>
              <div className={styles.infoItem}>
                <span className={styles.icon}>📅</span>
                תאריך השכרה: {new Date(rental.startDate).toLocaleDateString()}
              </div>
              <div className={styles.infoItem}>
                <span className={styles.icon}>📅</span>
                תאריך החזרה: {new Date(rental.endDate).toLocaleDateString()}
              </div>
              <div className={styles.infoItem}>
                <span className={styles.icon}>💰</span>
                מחיר: ₪{rental.totalPrice}
              </div>
              <div className={styles.infoItem}>
                <span className={styles.icon}>⏱️</span>
                מספר ימים: {rental.totalDays}
              </div>
            </div>

            {!washedCars.has(rental._id) && (
              <button 
                className={styles.washButton}
                onClick={() => handleCarWashed(rental._id)}
              >
                סמן כנשטף
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarWash;