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
                 Full name: {user.firstName} {user.lastName}
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.icon}>👑</span>
                 Adress {user.address}
                </div>
                {user.city && (
                  <div className={styles.infoItem}>
                    <span className={styles.icon}>🏠</span>
                    city {user.city}
                  </div>
                )}
                {user.address && (
                  <div className={styles.infoItem}>
                    <span className={styles.icon}>📍</span>
                   address {user.address}
                  </div>
                )}

                {user.rentalDetails && (
                  <div className={styles.rentalInfo}>
                    <h4>Rentel details</h4>
                    {/* <div className={styles.infoItem}>
                      <span className={styles.icon}>🚗</span>
                      דגם: {user.rentalDetails.model}
                    </div> */}
                    <div className={styles.infoItem}>
                      <span className={styles.icon}>🚗</span>
                     Car number {user.rentalDetails.carNumber}
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.icon}>📅</span>
                     Start date:{" "}
                      {new Date(
                        user.rentalDetails.startDate
                      ).toLocaleDateString()}
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.icon}>📅</span>
                      End date:{" "}
                      {new Date(
                        user.rentalDetails.endDate
                      ).toLocaleDateString()}
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.icon}>⏱</span>
                      Number of days: {user.rentalDetails.totalDays}
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.icon}>💰</span>
                      Total price: ${user.rentalDetails.totalPrice}
                    </div>




                    <div className={styles.formGroup}>
                      <label>{user.rentalDetails.carNumber}Cleaning status</label>
                      <div
                        className={`${styles.washStatus} ${
                          carWashStatus
                            ? styles.washed
                            : styles.notWashed
                        }`}
                      >
                        {carWashStatus
                          ? "The vehicle is wash ✓"
                          : "The vehicle is waiting for washing ✗"}
                      </div>

                      <label>{user.rentalDetails.carNumber}Location status</label>
                      <div
                        className={`${styles.washStatus} ${
                          carLocationStatus
                            ? styles.washed
                            : styles.notWashed
                        }`}
                      >
                        {carLocationStatus
                            ? "The vehicle is in place ✓"
                            : "The vehicle is awaiting location ✗"}
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
              {expandedCard === user._id ? "Less" : "More"}
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
          Next
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
          Previous
        </button>
      </div>
    </div>
  );
};

export default Renters;
