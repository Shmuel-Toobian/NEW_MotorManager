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
          throw new Error('The renters information is not in the correct format');
        }

        setCars(carsResponse.data);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Error loading data');
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
     
      const carResponse = await axios.get(`http://localhost:3000/cars/${carNumber}`);
      const car = carResponse.data;

      if (!car.isWashed) {
        alert('Cannot update location - the car is still not washed!');
        return;
      }

        const response = await axios.put(`http://localhost:3000/cars/${carNumber}`, {
          location: newLocation,
          isMoved: true
        });
      setCars((prevCars) =>
        prevCars.map((car) =>
          car.carNumber === carNumber ? { ...car, location: newLocation } : car
        )
      );
      setEditingCar(null); // סיום מצב עריכה
      setNewLocation(''); // איפוס שדה המיקום
      console.log('Location updated successfully');
    } catch (err) {
      console.error('Error updating location:', err);
      setError('Error updating location');
    }
  };

  if (loading) return <div className={styles.container}>Loading...</div>;
  if (error) return <div className={styles.container}>Error: {error}</div>;
  if (!users.length) return <div className={styles.container}>No renters to display</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Car Locations</h1>
      <div className={styles.cardsGrid}>
        {users.map((user) => {
          const car = cars.find((c) => c.carNumber === user.rentalDetails?.carNumber);
          return (
            <div key={user._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.userName}>{user.firstName} {user.lastName}</h3>
                <p className={styles.carNumber}>Car number: {user.rentalDetails?.carNumber || 'Not specified'}</p>
              </div>
              <div className={styles.basicInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.icon}>📞</span>
                  Phone: {user.phone || 'Not specified'}
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.icon}>📍</span>
                  Address: {user.address || 'Not specified'}
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.icon}>📅</span>
                  Rent date: {user.rentalDetails?.startDate ? new Date(user.rentalDetails.startDate).toLocaleDateString() : 'Not specified'}
                </div>
              </div>
              <button 
                className={styles.expandButton} 
                onClick={() => toggleCard(user._id)}
              >
                {expandedCard === user._id ? 'Hide details' : 'Show more'}
              </button>
              {expandedCard === user._id && car && (
                <div className={styles.expandedInfo}>
                  <h4>Car details</h4>
                  <div className={styles.infoItem}>
                    <span className={styles.icon}>🚗</span>
                    Car number: {car.carNumber}
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.icon}>📍</span>
                    Current location: {car.location || 'Not specified'}
                  </div>
                  {editingCar === car.carNumber ? (
                    <div className={styles.editLocation}>
                      <input
                        type="text"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        placeholder="Enter new location"
                      />
                      <button onClick={() => handleLocationUpdate(car.carNumber)}>Save</button>
                      <button onClick={() => setEditingCar(null)}>Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setEditingCar(car.carNumber)}>
                      Update location
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
