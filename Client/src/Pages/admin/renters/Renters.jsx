import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Renters.module.css";

const Renters = () => {
  const [renters, setRenters] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rentersPerPage = 9;

  const [carWashStatus, setCarWashStatus] = useState(null);
  const [carLocationStatus,  setCarLocationStatus] = useState(null);

// פונקציה לבדיקת סטטוס השטיפה
const checkCarWashStatus = async (carNumber) => {
  try {
    const response = await axios.get(`http://localhost:3000/cars/status/${carNumber}`);
    setCarWashStatus(response.data.isWashed);
    
  } catch (error) {
    console.error('Error checking car wash status:', error);
    setCarWashStatus(null);

  }
};
const checkCarLocationStatus = async (carNumber) => {
  try {
    const response = await axios.get(`http://localhost:3000/cars/status/${carNumber}`);
    setCarLocationStatus(response.data.isMoved);
  } catch (error) {
    console.error('Error checking car location status:', error);
    setCarLocationStatus(null);
  }
};


  useEffect(() => {
    const fetchRenters = async () => {
      try {
        const response = await axios.get("http://localhost:3000/user/renters");
        if (response.data.users && Array.isArray(response.data.users)) {
          const filteredRenters = response.data.users.filter(
            (user) => user.role !== "admin" && user.role !== "carWasher" && user.role !== "carMover" && user.role !== "carFixer"  && user.role !== "carFixer"
          );
          setRenters(filteredRenters);
        } else {
          throw new Error(
            "The information received is not in the correct format"
          );
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
   
    fetchRenters();
  }, []);

  const toggleCard = (userId,carNumber) => {
    {checkCarWashStatus(carNumber)}
    {checkCarLocationStatus(carNumber)}

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
  if (!renters.length)
    return <div className={styles.container}>No orders to display</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Orders</h1>
      <div className={styles.cardsGrid}>
        {getCurrentRenters().map((user) => (
          <div key={user._id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.userName}>
                {user.firstName} {user.lastName}
              </h3>
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
                {user.address && (
                  <div className={styles.infoItem}>
                    <span className={styles.icon}>📍</span>
                    רחוב: {user.address}
                  </div>
                )}

                {user.rentalDetails && (
                  <div className={styles.rentalInfo}>
                    <h4>פרטי השכרה:</h4>
                    {/* <div className={styles.infoItem}>
                      <span className={styles.icon}>🚗</span>
                      דגם: {user.rentalDetails.model}
                    </div> */}
                    <div className={styles.infoItem}>
                      <span className={styles.icon}>🚗</span>
                      מספר רכב: {user.rentalDetails.carNumber}
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.icon}>📅</span>
                      תאריך התחלה:{" "}
                      {new Date(
                        user.rentalDetails.startDate
                      ).toLocaleDateString()}
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.icon}>📅</span>
                      תאריך סיום:{" "}
                      {new Date(
                        user.rentalDetails.endDate
                      ).toLocaleDateString()}
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.icon}>⏱</span>
                      מספר ימים: {user.rentalDetails.totalDays}
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.icon}>💰</span>
                      מחיר כולל: ₪{user.rentalDetails.totalPrice}
                    </div>




                    <div className={styles.formGroup}>
                      <label>{user.rentalDetails.carNumber}:סטטוס ניקיון</label>
                      <div
                        className={`${styles.washStatus} ${
                          carWashStatus
                            ? styles.washed
                            : styles.notWashed
                        }`}
                      >
                        {carWashStatus
                          ? "הרכב נקי ✓"
                          : "הרכב מחכה לשטיפה ✗"}
                      </div>

                      <label>{user.rentalDetails.carNumber}:סטטוס מיקום</label>
                      <div
                        className={`${styles.washStatus} ${
                          carLocationStatus
                            ? styles.washed
                            : styles.notWashed
                        }`}
                      >
                        {carLocationStatus
                          ? "הרכב נמצא במקום ✓"
                          : "הרכב מחכה למיקום ✗"}
                      </div>
                    </div>

                   


                  </div>
                )}
              </div>
            )}

            <button
              className={styles.expandButton}
              onClick={(e) => {
                e.stopPropagation();
                console.log("Button clicked for user:", user._id);
                toggleCard(user._id,user.rentalDetails.carNumber);
              }}
            >
              {expandedCard === user._id ? "הצג פחות" : "הצג עוד"}
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
              className={`${styles.pageButton} ${
                currentPage === pageNumber ? styles.activePage : ""
              }`}
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
