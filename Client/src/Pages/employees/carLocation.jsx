import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './carLocation.module.css';

const CarLocation = () => {
  const [users, setUsers] = useState([]);
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState(null);
  const [editingCar, setEditingCar] = useState(null); // מזהה רכב לעריכה
  const [newLocation, setNewLocation] = useState(''); // מיקום חדש

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rentersResponse = await axios.get('http://localhost:3000/user/renters');
        const carsResponse = await axios.get('http://localhost:3000/cars');

        if (rentersResponse.data.users && Array.isArray(rentersResponse.data.users)) {
          const filteredUsers = rentersResponse.data.users.filter((user) => user.role !== 'admin');
          setUsers(filteredUsers);
        } else {
          throw new Error('המידע על השוכרים אינו בפורמט הנכון');
        }

        setCars(carsResponse.data);
      } catch (err) {
        console.error('שגיאה בטעינת נתונים:', err);
        setError('שגיאה בטעינת הנתונים');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleCard = (userId) => {
    setExpandedCard(expandedCard === userId ? null : userId);
  };

  const handleLocationUpdate = async (carNumber) => {
    try {
      const response = await axios.put(`http://localhost:3000/cars/${carNumber}`, {
        location: newLocation,
      });
      setCars((prevCars) =>
        prevCars.map((car) =>
          car.carNumber === carNumber ? { ...car, location: newLocation } : car
        )
      );
      setEditingCar(null); // סיום מצב עריכה
      setNewLocation(''); // איפוס שדה המיקום
      console.log('המיקום עודכן בהצלחה');
    } catch (err) {
      console.error('שגיאה בעדכון המיקום:', err);
      setError('שגיאה בעדכון המיקום');
    }
  };

  if (loading) return <div className={styles.container}>טוען...</div>;
  if (error) return <div className={styles.container}>שגיאה: {error}</div>;
  if (!users.length) return <div className={styles.container}>אין שוכרים להצגה</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>מיקומי רכבים</h1>
      <div className={styles.cardsGrid}>
        {users.map((user) => {
          const car = cars.find((c) => c.carNumber === user.rentalDetails?.carNumber);
          return (
            <div key={user._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.userName}>{user.firstName} {user.lastName}</h3>
                <p className={styles.carNumber}>מספר רכב: {user.rentalDetails?.carNumber || 'לא צוין'}</p>
              </div>
              <div className={styles.basicInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.icon}>📞</span>
                  טלפון: {user.phone || 'לא צוין'}
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.icon}>📍</span>
                  כתובת: {user.address || 'לא צוין'}
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.icon}>📅</span>
                  תאריך השכרה: {user.rentalDetails?.startDate ? new Date(user.rentalDetails.startDate).toLocaleDateString() : 'לא צוין'}
                </div>
              </div>
              <button 
                className={styles.expandButton} 
                onClick={() => toggleCard(user._id)}
              >
                {expandedCard === user._id ? 'הסתר פרטים' : 'הצג עוד'}
              </button>
              {expandedCard === user._id && car && (
                <div className={styles.expandedInfo}>
                  <h4>פרטי רכב</h4>
                  <div className={styles.infoItem}>
                    <span className={styles.icon}>🚗</span>
                    מספר רכב: {car.carNumber}
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.icon}>📍</span>
                    מיקום נוכחי: {car.location || 'לא צוין'}
                  </div>
                  {editingCar === car.carNumber ? (
                    <div className={styles.editLocation}>
                      <input
                        type="text"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        placeholder="הזן מיקום חדש"
                      />
                      <button onClick={() => handleLocationUpdate(car.carNumber)}>שמור</button>
                      <button onClick={() => setEditingCar(null)}>ביטול</button>
                    </div>
                  ) : (
                    <button onClick={() => setEditingCar(car.carNumber)}>
                      עדכן מיקום
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CarLocation;
