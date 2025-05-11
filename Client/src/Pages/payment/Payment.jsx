import React, { useEffect, useRef } from 'react';
import styles from './payment.module.css';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../../components/global';

const Payment = () => {
  const { sharedValue } = useAppContext();
  const paypal = useRef();
  const totalPrice = sharedValue; // השתמש ב-totalPrice במקום finalPrice
  console.log("Final Price:", totalPrice);

  useEffect(() => {
    window.paypal.Buttons({
      createOrder: (data, actions, err) => {
        return actions.order.create({
          intent: "CAPTURE",
          purchase_units: [
            {
              description: "Car Rental Payment",
              amount: {
                currency_code: "ILS",
                value: totalPrice, // השתמש ב-totalPrice כאן
              },
            },
          ],

        });
        
      },
      onApprove: async (data, actions) => {
        const order = await actions.order.capture();
        console.log(order);
      },
      onError: (err) => {
        console.log(err);
      },
    }).render(paypal.current);
  }, [totalPrice]); // הוסף את totalPrice כתלות ב-useEffect

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.paymentTitle}>Secure Payment</h1>
      <div className={styles.paymentContainer}>
        <div ref={paypal}></div>
      </div>
    </div>
  );
};

export default Payment;
