import React from 'react'
import { useNavigate } from 'react-router-dom';
import styles from './adminPanel.module.css';

export const AdminPanel = () => {
    const navigate = useNavigate();
    
    return (
        <div className={styles.adminContainer}>
            <div className={styles.welcomeSection}>
                <h1 className={styles.welcomeTitle}>WheelWay</h1>
                <h2 className={styles.welcomeText}>Welcome to the Admin Panel</h2>
                <img 
                    src="/logo.png" 
                    alt="logo" 
                    className={styles.carImage}
                />
            </div>
            
            <div className={styles.menuSection}>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Cars Management</h2>
                    <button className={styles.button} onClick={() => navigate('/cars')}>
                        Cars
                    </button>
                </div>
                
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Renters Management</h2>
                    <button className={styles.button} onClick={() => navigate('/renters')}>
                        Renter
                    </button>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Car Wash Management</h2>
                    <button className={styles.button} onClick={() => navigate('/carwash')}>
                        Car Wash
                    </button>
                </div>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Car Location Management</h2>
                    <button className={styles.button} onClick={() => navigate('/carLocation')}>
                        Car Location
                    </button>
                </div>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Car fixer Management</h2>
                    <button className={styles.button} onClick={() => navigate('/fixcar')}>
                        Car fixer
                    </button>
                </div>
            </div>
        </div>
    );
};
