import React, {Fragment, useEffect, useRef} from 'react'
import CheckoutSteps from './CheckoutSteps'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import MetaData from "../layout/metaData.js"
import { Typography } from '@mui/material'
import { useAlert } from 'react-alert'
import{
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js"

import axios from 'axios'
import "./Payment.css"
import CreditCardIcon from "@mui/icons-material/CreditCard.js"
import EventIcon from "@mui/icons-material/Event.js"
import VpnKeyIcon from "@mui/icons-material/VpnKey.js"
import { clearErrors, createOrder } from '../../actions/orderAction.js'
import { emptyTheCart } from '../../actions/cartAction.js'


const Payment = () => {

    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const alert = useAlert();

    const payBtn = useRef(null);

    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const { error } = useSelector((state) => state.newOrder);

    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100),
    };

    const order = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: orderInfo.subtotal,
        taxPrice: orderInfo.tax,
        shippingPrice: orderInfo.shippingCharges,
        totalPrice: orderInfo.totalPrice,
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        payBtn.current.disabled = true;

        try {
            const { data } = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/payment/process`, paymentData, {
                headers:{
                    token: localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            });

            const client_secret = data.client_secret;

            if(!stripe || !elements) return;

            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method:{
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email,
                        address: {
                            line1: shippingInfo.address,
                            city: shippingInfo.city,
                            state: shippingInfo.state,
                            postal_code: shippingInfo.pinCode,
                            country: shippingInfo.country,
                        },
                    },
                },
            });

            if(result.error){
                payBtn.current.disabled = false;
                alert.error(result.error.message);
            }
            else{
                if(result.paymentIntent.status === "succeeded"){

                    order.paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status,
                    }

                    dispatch(createOrder(order));
                    dispatch(emptyTheCart());
                    navigate("/success");
                } else {
                    alert.error("There's some issue while processing payment");
                }
            }


        } catch (error) {
            payBtn.current.disabled = false;
            alert.error(error.response.data.message);
        }
    };

    useEffect(() => {
      if(error){
        alert.error(error);
        dispatch(clearErrors());
      }
    }, [error, dispatch, alert])
    

  return (
    <Fragment>
        <MetaData title="Payment"/>
        <CheckoutSteps activeStep={2}/>
        <div className="paymentContainer">
            <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
                <Typography>Card Info</Typography>
                <div>
                    <CreditCardIcon />
                    <CardNumberElement className='paymentInput'/>
                </div>
                <div>
                    <EventIcon />
                    <CardExpiryElement className='paymentInput'/>
                </div>
                <div>
                    <VpnKeyIcon />
                    <CardCvcElement className='paymentInput'/>
                </div>

                <input 
                    type="submit"
                    value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
                    ref={payBtn}
                    className='paymentFormBtn' 
                />
            </form>
        </div>
    </Fragment>
  )
}

export default Payment