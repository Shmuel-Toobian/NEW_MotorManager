import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './carLocation.module.css';
import { useAuth } from '../../store/authProvider';

const CarLocation = () => {

    const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingLocation, setEditingLocation] = useState(null);
  const [newLocation, setNewLocation] = useState('');
  const usersPerPage = 9;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/user/renters');
        if (response.data.users && Array.isArray(response.data.users)) {
          const activeRenters = response.data.users.filter(user => user.rentalDetails);
          setUsers(activeRenters);
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

  const handleLocationUpdate = async (userId) => {
    try {
      await axios.patch(`http://localhost:3000/user/${userId}/location`, {
        location: newLocation
      });
      
      setUsers(users.map(user => {
        if (user._id === userId) {
          return { ...user, location: newLocation };
        }
        return user;
      }));
      
      setEditingLocation(null);
      setNewLocation('');
    } catch (err) {
      console.error('שגיאה בעדכון המיקום:', err);
      setError('שגיאה בעדכון המיקום');
    }
  };

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

  const totalPages = Math.ceil(users.length / usersPerPage);

  if (loading) return <div className={styles.container}>טוען...</div>;
  if (error) return <div className={styles.container}>שגיאה: {error}</div>;
  if (!users.length) return <div className={styles.container}>אין משתמשים להצגה</div>;

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
                <span className={styles.icon}>🚗</span>
                {user.selectedCar?.carNumber}
              </div>
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
                    <button onClick={() => handleLocationUpdate(user._id)}>שמור</button>
                    <button onClick={() => setEditingLocation(null)}>ביטול</button>
                  </div>
                ) : (
                  <>
                    {users.location || 'לא צוין מיקום'}
                    <button 
                      className={styles.editButton}
                      onClick={() => setEditingLocation(users._id)}
                    >
                      ערוך מיקום
                    </button>
                  </>
                )}
              </div>
            </div>

            {expandedCard === user._id && (
              <div className={styles.expandedInfo}>
                {/* מידע מורחב זהה ל-Renters */}
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
        {/* ... קוד ה-pagination ... */}
      </div>
    </div>
  );
};

export default CarLocation;