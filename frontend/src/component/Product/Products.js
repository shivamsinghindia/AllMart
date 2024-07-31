import React, { Fragment, useEffect, useState } from 'react';
import './Products.css';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, getProduct } from '../../actions/productAction';
import Loader from '../layout/Loader/Loader';
import ProductCard from '../Home/ProductCard';
import { useParams } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography';
import { useAlert } from 'react-alert';
import MetaData from "../layout/metaData.js"

const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones",
  ];


const Products = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const [currentPage, setcurrentPage] = useState(1);
  const setCurrentPageNo = (e)=>{
    setcurrentPage(e);
  }

  const [price, setprice] = useState([0,250000]);
  const priceHandler = (event, newPrice)=>{
    setprice(newPrice);
  }

  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState(0);

  const { products, loading, error, productsCount, resultPerPage, filteredProductsCount } = useSelector((state) => state.products);
  const count = filteredProductsCount;
  
  const { keyword } = useParams(); // Use useParams to get the keyword from URL

  useEffect(() => {
    if (error) {
      alert.error(error.message);
      dispatch(clearErrors());
    }
    dispatch(getProduct(keyword, currentPage, price, category, ratings));
  }, [dispatch, keyword, error, currentPage, price, category, ratings, alert]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="PRODUCTS -- AllMart"/>
          <h2 className="productsHeading">Products</h2>

          <div className="products">
            {products && products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="filterBox">
            <Typography>Price</Typography>
            <Slider
                value={price}
                onChange={priceHandler}
                valueLabelDisplay='auto'
                aria-labelledby='range-slider'
                min={0}
                max={250000}
            />

            <Typography>Categories</Typography>
            <ul className="categoryBox">
                {
                    categories.map((category) => (
                        <li 
                            className="category-link"
                            key={category}
                            onClick={()=> setCategory(category)}
                        >
                            {category}
                        </li>
                    ))
                }
            </ul>

            <fieldset>
                <Typography component="legend">Rating Above</Typography>
                <Slider
                    value={ratings}
                    onChange={(e,newRating) => {
                        setRatings(newRating);
                    }}
                    aria-labelledby='continuous-slider'
                    min={0}
                    max={5}
                    valueLabelDisplay='auto'
                />
            </fieldset>

          </div>

          {
            count > resultPerPage && <div className="paginationBox">
            <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass='page-item'
                linkClass='page-link'
                activeClass='pageItemActive'
                activeLinkClass='pageLinkActive'
            />
          </div>
          }

        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;
