import React, { useEffect, useRef } from 'react'
import styles from './payment.module.css';
import { useLocation } from 'react-router-dom';

const Payment = () => {

  const paypal = useRef();
  const location = useLocation();
  const finalPrice = location.state?.totalPrice || 100; // fallback to 100 if no price passed

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
                                value: finalPrice.toString(),
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
    }, [finalPrice])
    return (
        <>
            <h1 className={styles.paymentTitle}>Payment</h1>
            <div className={styles.paymentContainer}>
            <div ref={paypal}></div>
            </div>
            
        </>
    )
}

export default Payment