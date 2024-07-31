import React from 'react'
import { Fragment, useEffect, useState } from 'react'
import './NewProduct.css'
import { useSelector, useDispatch } from 'react-redux'
import { updateProduct, getProductDetails, clearErrors } from '../../actions/productAction'
import { useAlert } from 'react-alert'
import { Button } from '@mui/material'
import MetaData from "../layout/metaData.js"
import AccountTreeIcon from "@mui/icons-material/AccountTree.js"
import DescriptionIcon from "@mui/icons-material/Description.js"
import StorageIcon from "@mui/icons-material/Storage.js"
import SpellcheckIcon from "@mui/icons-material/Spellcheck.js"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney.js"
import Sidebar from './Sidebar.js'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { UPDATE_PRODUCT_RESET } from '../../constants/productConstants'

const UpdateProduct = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const alert = useAlert();

    const {error, product} = useSelector((state) => state.productDetails);
    const { loading, error: updateError, isUpdated } = useSelector((state) => state.product);

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [Stock, setStock] = useState(0);
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    const productId = id;

    const categories = [
        "Laptop",
        "Footwear",
        "Bottom",
        "Tops",
        "Attire",
        "Camera",
        "SmartPhones",
    ];

    useEffect(() => {

      if(product && product._id !== productId){
        dispatch(getProductDetails(productId));
      }
      else{
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setCategory(product.category);
        setStock(product.stock);
        setOldImages(product.images);
      }

      if(error){
        alert.error(error);
        dispatch(clearErrors());
      }

      if(updateError){
        alert.error(updateError);
        dispatch(clearErrors());
      }

      if(isUpdated){
        alert.success("Product Updated Successfully");
        navigate("/admin/products");
        dispatch({
            type: UPDATE_PRODUCT_RESET
        });
      }
    }, [dispatch, error, isUpdated, navigate, product, productId, updateError, alert]);


    const updateProductSubmitHandler = (e) => {
        e.preventDefault();
    
        const myForm = new FormData();
    
        myForm.set("name", name);
        myForm.set("price", price);
        myForm.set("description", description);
        myForm.set("category", category);
        myForm.set("stock", Stock);
    
        images.forEach((image) => {
          myForm.append("images", image);
        });
        dispatch(updateProduct(productId, myForm));
    };


    const updateProductImagesChange = (e) => {
        const files = Array.from(e.target.files);
    
        setImages([]);
        setImagesPreview([]);
        setOldImages([]);
    
        files.forEach((file) => {
          const reader = new FileReader();
    
          reader.onload = () => {
            if (reader.readyState === 2) {
              setImagesPreview((old) => [...old, reader.result]);
              setImages((old) => [...old, reader.result]);
            }
          };
    
          reader.readAsDataURL(file);
        });
    };
    

  return (
    <Fragment>
        <MetaData title="Update Product"/>
        <div className="dashboard">
            <Sidebar />
            <div className="newProductContainer">
                <form
                    className="createProductForm"
                    encType="multipart/form-data"
                    onSubmit={updateProductSubmitHandler}
                >
                    <h1>Update Product</h1>

                    <div>
                        <SpellcheckIcon />
                        <input
                            type="text"
                            placeholder="Product Name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <AttachMoneyIcon />
                        <input
                            type="number"
                            placeholder="Price"
                            required
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>

                    <div>
                        <DescriptionIcon />
                        <textarea
                            placeholder="Product Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            cols="30"
                            rows="1"
                            required
                        ></textarea>
                    </div>

                    <div>
                        <AccountTreeIcon />
                        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                            <option value="">Choose Category</option>
                            {categories.map((cate) => (
                                <option key={cate} value={cate}>
                                    {cate}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <StorageIcon />
                        <input
                            type="number"
                            placeholder="Stock"
                            required
                            value={Stock}
                            onChange={(e) => setStock(e.target.value)}
                        />
                    </div>

                    <div id="createProductFormFile">
                        <input
                            type="file"
                            name="avatar"
                            accept="image/*"
                            onChange={updateProductImagesChange}
                            multiple
                            // required
                        />
                    </div>

                    <div id="createProductFormImage">
                        {oldImages && oldImages.map((image, index) => (
                            <img key={index} src={image.url} alt="Old Product Preview" />
                        ))}
                    </div>

                    <div id="createProductFormImage">
                        {imagesPreview.map((image, index) => (
                            <img key={index} src={image} alt="Product Preview" />
                        ))}
                    </div>

                    <Button
                        id="createProductBtn"
                        type="submit"
                        disabled={loading ? true : false}
                    >
                        Update
                    </Button>
                </form>
            </div>
        </div>
    </Fragment>
  )
}

export default UpdateProduct