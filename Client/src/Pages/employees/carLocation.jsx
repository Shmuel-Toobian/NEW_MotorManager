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

  const [notReturnedUsers, setNotReturnedUsers] = useState([]);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const rentersResponse = await axios.get('http://localhost:3000/user/renters');
        const carsResponse = await axios.get('http://localhost:3000/cars');

        if (rentersResponse.data.users && Array.isArray(rentersResponse.data.users)) {
          const filteredUsers = rentersResponse.data.users.filter((user) => user.role !== 'admin'  &&
          user.role !== 'carWasher' &&
           user.role !== 'carMover');
          setUsers(filteredUsers);


          const notReturnedCarsUsers = rentersResponse.data.users.filter((user) => {
            const car = carsResponse.data.find((c) => c.carNumber === user.rentalDetails?.carNumber);
            return (
              user.role !== 'admin' &&
              user.role !== 'carWasher' &&
              user.role !== 'carMover');
          });
          setNotReturnedUsers(notReturnedCarsUsers);



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
          isMoved: true,
          isReturn: false,
          isReadyToReturn: false
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
  const handleCarReturnAndDelete = async (carNumber, userId) => {
    try {
      // שלב 1: החזרת הרכב
      await returnCar(carNumber);
  
      // שלב 2: מחיקת המשתמש
      await deleteUser(userId);
  
      alert("הרכב הוחזר בהצלחה והמשתמש נמחק");
    } catch (error) {
      console.error("Error handling car return or user deletion:", error);
      alert("אירעה שגיאה בהחזרת הרכב או מחיקת המשתמש");
    }
  };
  

  const returnCar = async (carNumber) => {
    try {
     
      const carResponse = await axios.get(`http://localhost:3000/cars/${carNumber}`);
      const car = carResponse.data;

        const response = await axios.put(`http://localhost:3000/cars/${carNumber}`, {
          isMoved: true,
          isReturn: true,    
          isReadyForRent:true,
          location: "ירושלים רמות"
        });
    
      console.log('car return successfully');
    } catch (err) {
      console.error('Error updating location:', err);
      setError('Error updating location');
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/user/${userId}`);
      if (response.status === 200) {
        console.log("User deleted successfully");
        // עדכון המצב לאחר מחיקה
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  


  

  if (loading) return <div className={styles.container}>Loading...</div>;
  if (error) return <div className={styles.container}>Error: {error}</div>;
  if (!users.length) return <div className={styles.container}>No renters to display</div>;

  return (
    <div>
    {/* <div className={styles.container}>
      <h1 className={styles.title}>Car Locations</h1>
      <div className={styles.cardsGrid}>
        {users.map((user) => {
          const car = cars.find((c) =>  c.carNumber === user.rentalDetails?.carNumber 
        );
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




      </div> */}

<div className={styles.container}>
  <h1 className={styles.title}>Car Locations</h1>
  <div className={styles.cardsGrid}>
    {users.map((user) => {
      const car = cars.find((c) => c.carNumber === user.rentalDetails?.carNumber);
      
      // הוסף סינון כאן כדי להציג רכבים ש-isReturn = true ו-isMoved = false
      if (car && car.isReturn === true && car.isMoved === false) {
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
      }
      return null; // מחזיר null אם הרכב לא עומד בתנאים
    })}
  </div>
</div>


      <div>
      <div className={styles.section}>
  <h1 className={styles.title}>רכבים להחזרה</h1>
  <div className={styles.cardsGrid}>
    {notReturnedUsers.map((user) => {
      // חפש את הרכב של המשתמש
      const car = cars.find((c) => c.carNumber === user.rentalDetails?.carNumber);
      
      // סנן רק רכבים ש- isReturn = false
      if (car && car.isReadyToReturn === true &&  car.isReturn === false) {
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

              <button onClick={async () => await handleCarReturnAndDelete(user.rentalDetails?.carNumber, user._id)}>
  הרכב חזר לחברה
</button>

            </div>
          </div>
        );
      }
      return null; // מחזיר null אם לא מצאנו רכב ש- isReturn = false
    })}
  </div>
</div>

      </div>

    </div>
  );
};

export default CarLocation;
