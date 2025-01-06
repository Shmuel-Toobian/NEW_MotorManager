import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Renters.module.css';

const Renters = () => {
  const [renters, setRenters] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rentersPerPage = 9;

  useEffect(() => {
    const fetchRenters = async () => {
      try {
        const response = await axios.get('http://localhost:3000/user/renters');
        if (response.data.users && Array.isArray(response.data.users)) {
          const filteredRenters = response.data.users.filter(user => user.role !== 'admin');
          setRenters(filteredRenters);
        } else {
          throw new Error('The information received is not in the correct format');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRenters();
  }, []);

  const toggleCard = (userId) => {
    setExpandedCard(expandedCard === userId ? null : userId);
  };

  const getCurrentRenters = () => {
    const indexOfLastRenter = currentPage * rentersPerPage;
    const indexOfFirstRenter = indexOfLastRenter - rentersPerPage;
    return renters.slice(indexOfFirstRenter, indexOfLastRenter);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(renters.length / rentersPerPage);

  if (loading) return <div className={styles.container}>Loading...</div>;
  if (error) return <div className={styles.container}>Error: {error}</div>;
  if (!renters.length) return <div className={styles.container}>No orders to display</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Orders</h1>
      <div className={styles.cardsGrid}>
        {getCurrentRenters().map((user) => (
          <div 
            key={user._id} 
            className={styles.card}
          >
            <div className={styles.cardHeader}>
              <h3 className={styles.userName}>{user.firstName} {user.lastName}</h3>
            </div>
            
            <div className={styles.basicInfo}>
              <div className={styles.infoItem}>
                <span className={styles.icon}>📧</span>
                {user.email}
              </div>
              <div className={styles.infoItem}>
                <span className={styles.icon}>📱</span>
                {user.phone}
              </div>
            </div>

            {console.log('Expanded card:', expandedCard)}
            {console.log('Current user:', user)}

            {expandedCard === user._id && (
              <div className={styles.expandedInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.icon}>👤</span>
                  שם מלא: {user.firstName} {user.lastName}
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.icon}>👑</span>
                  סוג משתמש: {user.role}
                </div>
                {user.city && (
                  <div className={styles.infoItem}>
                    <span className={styles.icon}>🏠</span>
                    עיר: {user.city}
                  </div>
                )}
                {user.street && (
                  <div className={styles.infoItem}>
                    <span className={styles.icon}>📍</span>
                    רחוב: {user.street}
                  </div>
                )}
                
                {user.rentalDetails && (
                  <div className={styles.rentalInfo}>
                    <h4>פרטי השכרה:</h4>
                    <div className={styles.infoItem}>
                      <span className={styles.icon}>🚗</span>
                      דגם: {user.rentalDetails.model}
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.icon}>🔢</span>
                      מספר רכב: {user.selectedCar?.carNumber}
                    </div>
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
                      <span className={styles.icon}>💰</span>
                      מחיר כולל: ₪{user.rentalDetails.totalPrice}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button 
              className={styles.expandButton}
              onClick={(e) => {
                e.stopPropagation();
                console.log('Button clicked for user:', user._id);
                toggleCard(user._id);
              }}
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

export default Renters;
