import React from 'react'
import { Fragment, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import './ProductList.css'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { Button } from '@mui/material'
import MetaData from "../layout/metaData.js"
import EditIcon from '@mui/icons-material/Edit.js'
import DeleteIcon from '@mui/icons-material/Delete.js'
import Sidebar from './Sidebar.js'
import Loader from '../layout/Loader/Loader.js'
import { deleteOrder, getAllOrders, clearErrors } from '../../actions/orderAction.js'
import { DELETE_ORDER_RESET } from '../../constants/orderConstants.js'

const OrderList = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const alert = useAlert();

    const { error, orders } = useSelector((state) => state.allOrders);

    const {error: deleteError, isDeleted, loading} = useSelector((state) => state.order);

    const deleteOrderHandler = (id) => {
        dispatch(deleteOrder(id));
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
        alert.success("Order Deleted Successfully");
        navigate('/admin/orders');
        dispatch({
            type: DELETE_ORDER_RESET,
        })
      }

      dispatch(getAllOrders());
    }, [dispatch, error, deleteError, isDeleted, navigate, alert]);
    

    const columns = [
        {
            field: "id",
            headerName: "Order ID",
            minWidth: 300,
            flex: 1,
        },
        {
            field: "status",
            headerName: "Status",
            minWidth: 150,
            flex: 0.5,
            cellClassName: (params) => {
                return params.row.status === "Delivered"
                 ? "greenColor"
                 : "redColor";
            }
        },
        {
            field: "itemsQty",
            headerName: "Items Qty",
            type: "number",
            minWidth: 150,
            flex: 0.4,
        },
        {
            field: "amount",
            headerName: "Amount",
            type: "number",
            minWidth: 270,
            flex: 0.5,
        },
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
                        <Link to={`/admin/order/${params.row.id}`}>
                            <EditIcon />
                        </Link>

                        <Button onClick={() => deleteOrderHandler(params.row.id)}>
                            <DeleteIcon />
                        </Button>
                    </Fragment>
                );
            },
        },

    ];

    const rows = [];

    orders &&
        orders.forEach((item) => {
        rows.push({
            id: item._id,
            itemsQty: item.orderItems.length,
            amount: item.totalPrice,
            status: item.orderStatus,
        });
    });

  return (
    <Fragment>
        {
            loading ? (
                <Loader /> 
            ) : (
                <Fragment>
        <MetaData title={`All ORDERS - Admin`}/>

        <div className="dashboard">
            <Sidebar />
            <div className="productListContainer">
                <h1 id="productListHeading">ALL ORDERS</h1>

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

export default OrderList