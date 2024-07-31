import React, { Fragment, useEffect } from 'react'
import { CgMouse } from 'react-icons/cg'
import './Home.css'
import Product from './ProductCard.js'
import MetaData from "../layout/metaData.js"
import {clearErrors, getProduct} from "../../actions/productAction.js"
import {useSelector, useDispatch} from 'react-redux'
import Loader from '../layout/Loader/Loader.js'
import { useAlert } from 'react-alert'

const Home = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const {loading, error, products} = useSelector(state=>state.products);


  useEffect(() => {
    if(error){
        // console.log(error);
        alert.error(error.message);
        dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch,error, alert]);
  
  

  return (
    
    <Fragment>
        {loading ? (
            <Loader/> 
        ) : (
            <Fragment>
        
                <MetaData title="AllMart"/>
        
        
                <div className="banner">
                    
                    
                    <p>Welcome to AllMart</p>
                    <h1>FIND AMAZING PRODUCTS BELOW</h1>
                    <a href="#container">
                        <button className='scroll'>
                            Scroll <CgMouse/>
                        </button>
                    </a>
                </div>
        
                <h2 className='homeHeading'>Featured Products</h2>
        
                <div className="container" id='container'>
                    {products && products.map(product => (
                        <Product product={product}/>
                    ))}
        
        
                </div>
            </Fragment>

            )
        }
    </Fragment>
  )
}

export default Home