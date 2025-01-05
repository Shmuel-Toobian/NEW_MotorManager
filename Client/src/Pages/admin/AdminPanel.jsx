import React from 'react'
import { useNavigate } from 'react-router-dom';
import styles from './adminPanel.module.css';

export const AdminPanel = () => {
    const navigate = useNavigate();
    
    return (
        <div className={styles.adminContainer}>
            <br />
            <br />  
            <br />
            <h1 className={styles.title}>Admin Panel</h1>
            
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Cars Management</h2>
                <button 
                    className={styles.button}
                    onClick={() => navigate('/cars')}
                >
                    Cars
                </button>
            </div>
            
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Users Management</h2>
                <button 
                    className={styles.button}
                    onClick={() => navigate('/renters')}
                >
                    Users
                </button>
            </div>
        </div>
    );
};
