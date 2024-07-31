import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';
import Loader from '../layout/Loader/Loader';


const ProtectedRoute = ({ isAdmin, children }) => {
    let {loading, isAuthenticated, user} = useSelector((state) => state.user);

  //   console.log("user",user);
  // console.log("loading",loading);
  // console.log("isAuthenticated",isAuthenticated);
    if(isAuthenticated===undefined) user=null;

    return (loading===undefined || loading===true)? (
        <Loader />
    ) : (
        (isAuthenticated===false && user===null) ? <Navigate to="/login" /> : (
          (isAdmin === true && user.role !== "admin") ? <Navigate to="/login" /> : children
        ) 
    )
  };

export default ProtectedRoute;