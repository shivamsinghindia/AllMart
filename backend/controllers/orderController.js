const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

//Create new Order
exports.newOrder = catchAsyncErrors(async(req,res,next) => {
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success:true,
        order
    })
})


//Get Single Order Details
exports.getSingleOrderDetails = catchAsyncErrors(async(req,res,next) => {
    const order = await Order.findById(req.params.id).populate("user","name email");
    //using the field "user" which is user id, populate function will retrieve the name and email using the user id!
    
    if(!order){
        return next(new ErrorHander("Order not found with this id",404));
    }

    res.status(200).json({
        success:true,
        order
    })
})


//Get logged in user orders
exports.myOrders = catchAsyncErrors(async(req,res,next) => {
    const orders = await Order.find({user: req.user._id});

    res.status(200).json({
        success:true,
        orders
    })
})


//Get all orders -- ADMIN
exports.getAllOrders = catchAsyncErrors(async(req,res,next) => {
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    })

    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
})


//Update order status -- ADMIN
exports.updateOrder = catchAsyncErrors(async(req,res,next) => {
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHander("Order not found",404));
    }

    if(order.orderStatus === "Delivered"){
        return next(new ErrorHander("You have already delivered this product",400));
    }

    if(req.body.status === "Shipped"){
        order.orderItems.forEach(async (orderItem) => {
            await updateStock(orderItem.product, orderItem.quantity);
        });
    }

    order.orderStatus = req.body.status;

    if(req.body.status==="Delivered"){
        order.deliverdAt = Date.now();
    }

    await order.save({validateBeforeSave: false});

    res.status(200).json({
        success:true,
    })
})

async function updateStock(productId,quantity){
    const product = await Product.findById(productId);
    product.stock -= quantity;
    product.stock = Math.max(product.stock,0);
    await product.save({validateBeforeSave: false});
}


//Delete Order -- ADMIN
exports.deleteOrder = catchAsyncErrors(async (req,res,next) => {
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHander("Order not found",404));
    }

    await order.deleteOne();
    res.status(200).json({
        success: true,
        message: "Order deleted successfully"
    })
})