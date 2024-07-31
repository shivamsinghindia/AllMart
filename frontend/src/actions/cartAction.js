import {
    ADD_TO_CART,
    EMPTY_CART,
    REMOVE_CART_ITEM,
    SAVE_SHIPPING_INFO
} from "../constants/cartConstants";

import axios from "axios";

export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
    const {data} = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/product/${id}`); 

    dispatch({
        type: ADD_TO_CART,
        payload: {
            product: data.currProd._id,
            name: data.currProd.name,
            price: data.currProd.price,
            image: data.currProd.images[0].url,
            stock: data.currProd.stock,
            quantity,
        },
    });

    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
}


export const removeItemsFromCart = (id) => async (dispatch, getState) => {
    dispatch({
        type: REMOVE_CART_ITEM,
        payload: id,
    });

    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
}

export const emptyTheCart = () => async (dispatch, getState) => {
    dispatch({
        type: EMPTY_CART,
    });

    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
}

export const saveShippingInfo = (data) => async (dispatch) => {
    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data,
    });

    localStorage.setItem("shippingInfo", JSON.stringify(data));
}