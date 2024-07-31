import React from 'react'
import { Fragment, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import './ProductList.css'
import { useSelector, useDispatch } from 'react-redux'
import { getAdminProduct, clearErrors, deleteProduct } from '../../actions/productAction'
import { Link, useNavigate } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { Button } from '@mui/material'
import MetaData from "../layout/metaData.js"
import EditIcon from '@mui/icons-material/Edit.js'
import DeleteIcon from '@mui/icons-material/Delete.js'
import Sidebar from './Sidebar.js'
import Loader from '../layout/Loader/Loader.js'
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants.js'

const ProductList = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const alert = useAlert();

    const { error, products } = useSelector((state) => state.products);

    const {error: deleteError, isDeleted, loading} = useSelector((state) => state.product);

    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id));
    }

    useEffect(() => {
      if(error){
        alert.error(error);
        dispatch(clearErrors());
      }

      if(deleteError){
        alert.error(deleteError);
        dispatch(clearErrors());
      }

      if(isDeleted){
        alert.success("Product Deleted Successfully");
        navigate('/admin/dashboard');
        dispatch({
            type: DELETE_PRODUCT_RESET,
        })
      }

      dispatch(getAdminProduct());
    }, [dispatch, error, deleteError, isDeleted, navigate, alert]);
    

    const columns = [
        {field: "id", headerName: "Product ID", minWidth: 200, flex: 0.5},
        {field: "name", headerName: "Name", minWidth: 350, flex: 1},
        {field: "stock", headerName: "Stock", type: "number", minWidth: 150, flex: 0.3},
        {field: "price", headerName: "Price", type: "number", minWidth: 270, flex: 0.5},

        {
            field: "actions",
            flex: 0.3,
            headerName: "Actions",
            minWidth: 150,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Fragment>
                        <Link to={`/admin/product/${params.row.id}`}>
                            <EditIcon />
                        </Link>

                        <Button onClick={() => deleteProductHandler(params.row.id)}>
                            <DeleteIcon />
                        </Button>
                    </Fragment>
                );
            },
        },

    ];

    const rows = [];

    products &&
        products.forEach((item) => {
        rows.push({
            id: item._id,
            stock: item.stock,
            price: item.price,
            name: item.name,
        });
    });

  return (
    <Fragment>
        {
            loading ? (
                <Loader /> 
            ) : (
                <Fragment>
        <MetaData title={`All Products - Admin`}/>

        <div className="dashboard">
            <Sidebar />
            <div className="productListContainer">
                <h1 id="productListHeading">ALL PRODUCTS</h1>

                <DataGrid 
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                          paginationModel: {
                            pageSize: 8,
                          },
                        },
                    }}
                    pageSizeOptions={[8]}
                    disableRowSelectionOnClick
                    className='productListTable'
                    autoHeight
                />
            </div>
        </div>
    </Fragment>
            )
        }
    </Fragment>
  )
}

export default ProductList