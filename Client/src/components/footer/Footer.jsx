import React from 'react';
import style from './footer.module.css';

const Footer = () => {
  return (
    <footer className={style.footer}>
      <div className={style.footerContent}>
        <div className={style.companyInfo}>
          <h1 className={style.title}>Whellway</h1>
          <p className={style.rights}>© All rights reserved - Eliran and Shmuel</p>
        </div>

        <div className={style.contactInfo}>
          <div className={style.contactItem}>
            <i className="bi bi-telephone"></i>
            <span>051-277-8815</span>
          </div>
          <div className={style.contactItem}>
            <i className="bi bi-envelope"></i>
            <span>wheelway@email.com</span>
          </div>
          <div className={style.hours}>
            <p>Hours:</p>
            <p>Monday-Friday: 08:00-19:00</p>
            <p>Saturday: 08:00-13:00</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
