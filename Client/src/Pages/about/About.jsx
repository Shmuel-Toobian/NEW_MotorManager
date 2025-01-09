import React from 'react'
import styles from './about.module.css'


export const About = () => {
  return (
    <div className={styles.aboutContainer}>
      <h1 className={styles.title}>About Us</h1>
      
      <div className={styles.content}>
        <p className={styles.intro}>
          Welcome to Wheelway! We've been providing quality car rental services for over 10 years.
          Our mission is to give you the best driving experience at competitive prices.
        </p>

        <div className={styles.features}>
          <div className={styles.featureCard}>
            <h3>Diverse Fleet</h3>
            <p>Wide selection of new and well-maintained vehicles</p>
          </div>
          
          <div className={styles.featureCard}>
            <h3>Personal Service</h3>
            <p>Professional and friendly team at your service</p>
          </div>
          
          <div className={styles.featureCard}>
            <h3>Guaranteed Quality</h3>
            <p>High standards and complete satisfaction</p>
          </div>
        </div>

        <div className={styles.contactSection}>
          <h2>Contact Us</h2>
          <div className={styles.contactInfo}>
            <p>Phone: 051-277-8815</p>
          </div>
          <p>Address: Jerusalem</p>
          <p>Hours: sunday - thursday 08:00 - 19:00</p>
          <p>friday 08:00 - 13:00</p>
        </div>
      </div>
    </div>
  )
}

export default About;
