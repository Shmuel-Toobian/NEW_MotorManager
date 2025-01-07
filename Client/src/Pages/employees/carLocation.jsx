import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './carLocation.module.css';
import { useAuth } from '../../store/authProvider';

const CarLocation = () => {
  // ========== State Management ==========
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingLocation, setEditingLocation] = useState(null);
  const [newLocation, setNewLocation] = useState('');
  const usersPerPage = 9;

  // ========== Data Fetching ==========
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/user/renters');
        const response2 = await axios.get('http://localhost:3000/cars');
        const cars = response2.data;
        console.log(cars);
        console.log(cars[0].location);
        

        if (response.data.users && Array.isArray(response.data.users)) {
          const filteredUsers = response.data.users.filter(user => user.role !== 'admin');
          setUsers(filteredUsers);
        } else {
          throw new Error('המידע שהתקבל אינו בפורמט הנכון');
        }
      } catch (err) {
        console.error('שגיאה בטעינת משתמשים:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);



  // ========== Handlers ==========
  const toggleCard = (userId) => {
    setExpandedCard(expandedCard === userId ? null : userId);
  };

  const getCurrentUsers = () => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    return users.slice(indexOfFirstUser, indexOfLastUser);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleLocationUpdate = async (carNumber) => {
    try {
      const response = await axios.put(`http://localhost:3000/cars/${carNumber}`, {
        location: newLocation
      });
        setEditingLocation(null);
        setNewLocation('');
        console.log('המיקום עודכן בהצלחה');
    } catch (err) {
      console.error('שגיאה בעדכון המיקום:', err);
      setError('שגיאה בעדכון המיקום');
    }
  };

  const totalPages = Math.ceil(users.length / usersPerPage);

  // ========== Render Conditions ==========
  if (loading) return <div className={styles.container}>טוען...</div>;
  if (error) return <div className={styles.container}>שגיאה: {error}</div>;
  if (!users.length) return <div className={styles.container}>אין משתמשים להצגה</div>;

  // ========== Render ==========
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>מיקומי רכבים</h1>
      <div className={styles.cardsGrid}>
        {getCurrentUsers().map((user) => (
          <div key={user._id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.userName}>{user.firstName} {user.lastName}</h3>
            </div>

            <div className={styles.basicInfo}>
              <div className={styles.infoItem}>
                <span className={styles.icon}>📧</span>
                {user.email}
              </div> 
              {user.rentalDetails && (
                <div className={styles.infoItem}>
                  <span className={styles.icon}>🚗</span>
                  {user.rentalDetails.model} - {user.rentalDetails.carNumber}
                </div>
              )}

              <div className={styles.infoItem}>
                <span className={styles.icon}>📍</span>
                {editingLocation === user._id ? (
                  <div className={styles.locationEdit}>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="הכנס מיקום חדש"
                    />
                    <button onClick={() => handleLocationUpdate(user.rentalDetails.carNumber)}>שמור</button>
                    <button onClick={() => setEditingLocation(null)}>ביטול</button>
                  </div>
                ) : (
                  <>
                    {user.carDetails?.location || 'לא צוין מיקום'}
                    <button 
                      className={styles.editButton}
                      onClick={() => setEditingLocation(user._id)}
                    >
                      ערוך מיקום
                    </button>
                  </>
                )}
              </div>
            </div>

            {expandedCard === user._id && (
              <div className={styles.expandedInfo}>
                {user.rentalDetails && (
                  <div className={styles.rentalInfo}>
                    <h4>פרטי השכרה:</h4>
                    <div className={styles.infoItem}>
                      <span className={styles.icon}>📅</span>
                      תאריך התחלה: {new Date(user.rentalDetails.startDate).toLocaleDateString()}
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.icon}>📅</span>
                      תאריך סיום: {new Date(user.rentalDetails.endDate).toLocaleDateString()}
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.icon}>⏱️</span>
                      מספר ימים: {user.rentalDetails.totalDays}
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.icon}>📍</span>
                     חדש מיקום: {user.address}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button 
              className={styles.expandButton}
              onClick={() => toggleCard(user._id)}
            >
              {expandedCard === user._id ? 'הצג פחות' : 'הצג עוד'}
            </button>
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        <button 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={styles.pageButton}
        >
          הבא
        </button>
        
        {[...Array(totalPages)].reverse().map((_, index) => {
          const pageNumber = totalPages - index;
          return (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`${styles.pageButton} ${currentPage === pageNumber ? styles.activePage : ''}`}
            >
              {pageNumber}
            </button>
          );
        })}
        
        <button 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
          הקודם
        </button>
      </div>
    </div>
  );
};

export default CarLocation;