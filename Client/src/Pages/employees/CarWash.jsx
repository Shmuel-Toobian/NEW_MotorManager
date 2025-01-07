import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './CarWash.module.css';

const CarWash = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      // מביא את כל השוכרים
      const response = await axios.get('http://localhost:3000/user/renters');
      console.log('Raw response:', response.data);

      const users = Array.isArray(response.data) ? response.data : 
                   Array.isArray(response.data.users) ? response.data.users : [];

      // מביא את כל הרכבים
      const carsResponse = await axios.get('http://localhost:3000/cars');
      const cars = Array.isArray(carsResponse.data) ? carsResponse.data : [];

      // סינון משתמשים שיש להם פרטי השכרה תקינים
      const filteredUsers = users.filter(user => 
        user && 
        user.rentalDetails && 
        user.rentalDetails.carNumber && // בדיקה לפי מספר רכב במקום carId
        cars.some(car => car.carNumber === user.rentalDetails.carNumber   && 
          !car.isWashed  // מציג רק רכבים שלא נשטפו)
        )
      );


      console.log('Filtered users:', filteredUsers);
      setRentals(filteredUsers);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching rentals:', err);
      console.log('Error details:', err.response?.data);
      setError('שגיאה בטעינת הנתונים');
      setLoading(false);
    }
  };

  const handleCarWashed = async (rental) => {
    try {
      
      // שליחת בקשת PUT לעדכון סטטוס השטיפה
      await axios.put(`http://localhost:3000/cars/${rental.rentalDetails.carNumber}`, {
        isWashed: true
      });

      // רענון הנתונים אחרי העדכון
      fetchRentals();
      
      // הודעת הצלחה למשתמש
      alert('סטטוס השטיפה עודכן בהצלחה');
    } catch (error) {
      console.error('Error updating car wash status:', error);
      alert('שגיאה בעדכון סטטוס השטיפה');
    }
  };

  if (loading) return <div className={styles.container}>טוען...</div>;
  if (error) return <div className={styles.container}>{error}</div>;
  if (!rentals.length) return <div className={styles.container}>אין רכבים לשטיפה</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>רכבים לשטיפה</h1>
      <div className={styles.cardsGrid}>
        {rentals.map((rental) => (
          rental.rentalDetails && (
            <div key={rental._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>רכב מספר: {rental.rentalDetails.carNumber}</h3>
                <span className={styles.status}>
                  {rental.isWashed ? '✅ נשטף' : '🚿 ממתין לשטיפה'}
                </span>
              </div>
              
              <div className={styles.cardContent}>
                <div className={styles.infoItem}>
                  <span className={styles.icon}>📅</span>
                  תאריך השכרה: {new Date(rental.rentalDetails.startDate).toLocaleDateString()}
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.icon}>📅</span>
                  תאריך החזרה: {new Date(rental.rentalDetails.endDate).toLocaleDateString()}
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.icon}>💰</span>
                  מחיר: ₪{rental.rentalDetails.totalPrice}
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.icon}>⏱️</span>
                  מספר ימים: {rental.rentalDetails.totalDays}
                </div>
              </div>

              {!rental.isWashed && (
                <button 
                  className={styles.washButton}
                  onClick={() => handleCarWashed(rental)}
                >
                  סמן כנשטף
                </button>
              )}
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default CarWash;

