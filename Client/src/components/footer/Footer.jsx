import React from 'react';
import style from './footer.module.css';

const Footer = () => {
  return (
    <footer className={style.footer}>
      <h1 className={style.title}>Garage</h1>
      <div className={style.icons}>
        <i className={`${style.icon} ${style.whatsapp} bi bi-whatsapp`}></i>
        <i className={`${style.icon} ${style.youtube} bi bi-youtube`}></i>
        <i className={`${style.icon} ${style.facebook} bi bi-facebook`}></i>
        <i className={`${style.icon} ${style.instagram} bi bi-instagram`}></i>
        <i className={`${style.icon} ${style.twitter} bi bi-twitter-x`}></i>
      </div>
    </footer>
  );
}

export default Footer;
