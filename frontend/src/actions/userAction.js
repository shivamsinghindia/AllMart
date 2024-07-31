import { 
    LOGIN_REQUEST, 
    LOGIN_SUCCESS, 
    LOGIN_FAIL, 
    CLEAR_ERRORS,
    REGISTER_USER_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    LOAD_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOGOUT_FAIL,
    LOGOUT_SUCCESS,
    UPDATE_PROFILE_FAIL,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PASSWORD_FAIL,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_FAIL,
    RESET_PASSWORD_SUCCESS,
    ALL_USERS_REQUEST,
    ALL_USERS_SUCCESS,
    ALL_USERS_FAIL,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
} from '../constants/userConstants'

import axios from 'axios'

export const login = (email, password) => async (dispatch) =>{
    try {
        dispatch({
            type: LOGIN_REQUEST
        });

        const config = { headers: { "Content-Type": "application/json" } };

        const {data} = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/login`, {email, password}, config);
        // console.log("data",data);
        localStorage.setItem('token',data?.token);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: data.user,
        })
    } catch (error) {
        dispatch({
            type: LOGIN_FAIL,
            payload: error.response.data.message,
        })
    }
};


export const register = (userData) => async (dispatch) =>{
    try {
        dispatch({
            type: REGISTER_USER_REQUEST
        });
        const config = { headers: { "Content-Type": "multipart/form-data" } };
        const {data} = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/register`, userData, config);
        localStorage.setItem('token',data?.token);
        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data.user,
        })
    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error.response.data.message,
        });
    }
};


export const loadUser = () => async (dispatch) =>{
    try {
        dispatch({
            type: LOAD_USER_REQUEST
        });
        // console.log("tokennnn",localStorage.getItem("token"));
        const {data} = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/me`,{
            headers: {
                token: localStorage.getItem("token"),
            },
        });
        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data.user,
        })
    } catch (error) {
        dispatch({
            type: LOAD_USER_FAIL,
            payload: error.response.data.message,
        })
    }
};

export const logout = () => async (dispatch) =>{
    try {
        // console.log("tokennnn",localStorage.getItem("token"));
        // await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/logout`,{
        //     headers: {
        //         token: localStorage.getItem("token"),
        //     },
        // });
        localStorage.setItem("token",null);
        // console.log("tokennnn",localStorage.getItem("token"));
        dispatch({
            type: LOGOUT_SUCCESS,
        });
    } catch (error) {
        dispatch({
            type: LOGOUT_FAIL,
            payload: error.response.data.message,
        });
    }
};


export const updateProfile = (userData) => async (dispatch) =>{
    try {
        dispatch({
            type: UPDATE_PROFILE_REQUEST
        });
        // const config = { headers: {  } };
        // console.log("tokennnn",localStorage.getItem("token"));
        const {data} = await axios.put(`${process.env.REACT_APP_BASE_URL}/api/v1/me/update`, userData, {
            headers: {
                token: localStorage.getItem("token"),
                "Content-Type": "multipart/form-data"
            },
        });
        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data.success,
        })
    } catch (error) {
        dispatch({
            type: UPDATE_PROFILE_FAIL,
            payload: error.response.data.message,
        });
    }
};



export const updatePassword = (passwords) => async (dispatch) =>{
    try {
        dispatch({
            type: UPDATE_PASSWORD_REQUEST
        });

        // console.log("tokennnn",localStorage.getItem("token"));
        const {data} = await axios.put(`${process.env.REACT_APP_BASE_URL}/api/v1/password/update`, passwords, {
            headers: {
                token: localStorage.getItem("token"),
                "Content-Type": "application/json"
            },
        });
        dispatch({
            type: UPDATE_PASSWORD_SUCCESS,
            payload: data.success,
        })
    } catch (error) {
        dispatch({
            type: UPDATE_PASSWORD_FAIL,
            payload: error.response.data.message,
        });
    }
};


export const forgotPassword = (email) => async (dispatch) =>{
    try {
        dispatch({
            type: FORGOT_PASSWORD_REQUEST
        });

        const {data} = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/password/forgot`, email, {
            headers:{
                "Content-Type": "application/json",
            }
        });
        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: data.message,
        })
    } catch (error) {
        dispatch({
            type: FORGOT_PASSWORD_FAIL,
            payload: error.response.data.message,
        })
    }
};


export const resetPassword = (token, passwords) => async (dispatch) =>{
    try {
        dispatch({
            type: RESET_PASSWORD_REQUEST
        });

        const {data} = await axios.put(`${process.env.REACT_APP_BASE_URL}/api/v1/password/reset/${token}`, passwords, {
            headers:{
                "Content-Type": "application/json",
            }
        });
        dispatch({
            type: RESET_PASSWORD_SUCCESS,
            payload: data.success,
        })
    } catch (error) {
        dispatch({
            type: RESET_PASSWORD_FAIL,
            payload: error.response.data.message,
        })
    }
};


export const getAllUsers = () => async (dispatch) =>{
    try {
        dispatch({
            type: ALL_USERS_REQUEST
        });
        const {data} = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/admin/users`,{
            headers: {
                token: localStorage.getItem("token"),
            },
        });
        dispatch({
            type: ALL_USERS_SUCCESS,
            payload: data.users,
        })
    } catch (error) {
        dispatch({
            type: ALL_USERS_FAIL,
            payload: error.response.data.message,
        })
    }
};


export const getUserDetails = (id) => async (dispatch) =>{
    try {
        dispatch({
            type: USER_DETAILS_REQUEST
        });
        const {data} = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/admin/user/${id}`,{
            headers: {
                token: localStorage.getItem("token"),
            },
        });
        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data.user,
        })
    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response.data.message,
        })
    }
};


export const updateUser = (id, userData) => async (dispatch) =>{
    try {
        dispatch({
            type: UPDATE_USER_REQUEST
        });

        const {data} = await axios.put(`${process.env.REACT_APP_BASE_URL}/api/v1/admin/user/${id}`, userData, {
            headers: {
                token: localStorage.getItem("token"),
                "Content-Type": "application/json"
            },
        });
        dispatch({
            type: UPDATE_USER_SUCCESS,
            payload: data.success,
        })
    } catch (error) {
        dispatch({
            type: UPDATE_USER_FAIL,
            payload: error.response.data.message,
        });
    }
};


export const deleteUser = (id) => async (dispatch) =>{
    try {
        dispatch({
            type: DELETE_USER_REQUEST
        });

        const {data} = await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/v1/admin/user/${id}`, {
            headers: {
                token: localStorage.getItem("token"),
            },
        });
        dispatch({
            type: DELETE_USER_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: DELETE_USER_FAIL,
            payload: error.response.data.message,
        });
    }
}; 


export const clearErrors = () => async(dispatch) => {
    dispatch({
        type: CLEAR_ERRORS,
    })
}
