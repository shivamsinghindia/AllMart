const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");

// Register a User
exports.registerUser = catchAsyncErrors( async(req,res,next) => {

    // console.log("100");
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    });
    // console.log("100");
    const {name,email,password} = req.body;

    const newUser = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
    });

    sendToken(newUser,201,res);
})


// Login User
exports.loginUser = catchAsyncErrors( async(req,res,next) => {
    const {email,password} = req.body;

    //checking if user has given password and email both
    if(!email || !password){
        return next(new ErrorHander("Please Enter email and password",400));
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHander("Invalid email or password",401));
    }
    // console.log(user);
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHander("Invalid email or password",401));
    }

    sendToken(user,200,res);

    // const token = user.getJWTToken();
    // res.status(200).json({
    //     success:true,
    //     token
    // })
})


//Logout User
exports.logout = catchAsyncErrors(async (req,res,next)=>{
    // res.cookie("token", null, {
    //     expires: new Date(Date.now()),
    //     httpOnly:true,
    // })
    console.log("LALALA");
    localStorage.setItem("token",null);

    res.status(200).json({
        success:true,
        message:"Logged out"
    })
})



//Forget Password
exports.forgotPassword = catchAsyncErrors(async (req,res,next) => {
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return next(new ErrorHander("User not found",404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave: false}); //to save the values after generating reset token and its expire value

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

    try {
        await sendEmail({email:user.email, subject: "AllMart password recovery", message});

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave: false});

        return next(new ErrorHander(error.message,500));
    }
})


// Reset Password
exports.resetPassword = catchAsyncErrors(async (req,res,next) => {
    //creating token hash to match from existing hashed token
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()},
    });

    if(!user){
        return next(new ErrorHander("Reset password token is invalid or has expired",400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHander("Passwords do not match",400));
    }

    user.password = await req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user,200,res);
})



// Get User details/Info
exports.getUserDetails = catchAsyncErrors(async(req,res,next) => {
    // const token = req.cookies.token;
    // const decodedData = jwt.verify(token,process.env.JWT_SECRET);
    // const user = await User.findById(decodedData.id);

    //  OR

    const user = await User.findById(req.user.id); // password will not be shown

    res.status(200).json({
        success:true,
        user
    })

})


// Update User Password
exports.updatePassword = catchAsyncErrors(async (req,res,next) => {

    const user = await User.findById(req.user.id).select("+password"); // password will be shown

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHander("Old password is incorrect",400));
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHander("Passwords does not match",400));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user,200,res);

})



// Update User Profile
exports.updateProfile = catchAsyncErrors(async (req,res,next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };


    // let x = await User.findById(req.user.id);
    // console.log(x.avatar);
    // console.log(req.body.avatar);
    //the image uploading part has created some issues here!
    //It is not uploading on cloudinary when on PROXY
    //But when on DATA if avatar is changed then everything workd fine
    // but if avatar is not changed then again error is thrown even on mobile data.
    if(req.body.avatar!==""){
        
        const user = await User.findById(req.user.id);
        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);
        
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });
        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, { new: true });
    res.status(200).json({
        success:true
    })

})


//Get all users (ADMIN)
exports.getAllUsers = catchAsyncErrors(async (req,res,next) => {
    const users = await User.find();

    res.status(200).json({
        success:true,
        users,
    })
})


//Get single user (ADMIN)
exports.getSingleUser = catchAsyncErrors(async (req,res,next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHander(`User does not exist with Id: ${req.params.id}`));
    }

    res.status(200).json({
        success:true,
        user
    })
})


// Update User Role -- ADMIN
exports.updateRole = catchAsyncErrors(async (req,res,next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData);
    if(!user){
        return next(new ErrorHander(`No user with id ${req.params.id}`,400));
    }
    res.status(200).json({
        success: true
    })

})


// Delete User -- ADMIN
exports.deleteUser = catchAsyncErrors(async (req,res,next) => {

    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHander(`No user with id ${req.params.id}`,400));
    }

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    await user.deleteOne();

    res.status(200).json({
        success:true,
        message:"User Deleted Successfully"
    })

})