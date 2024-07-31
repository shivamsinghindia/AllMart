//Creating Token and saving in cookie

const sendToken = async (user,statusCode,res)=>{
    const token = await user.getJWTToken();
    // console.log("ttokenn",token);
    // console.log("ID",user.id);

    //options for cookie 
    // const options = {
    //     expires: new Date(
    //         Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    //     ),
    //     httpOnly: true,
    //     sameSite: "none",
    //     secure: true,
    // }

    // res.status(statusCode).cookie("token",token,options).json({
    //     success:true,
    //     user,
    //     token
    // })

    res.status(statusCode)
        .header("token", `${token}`)
        .json({
            success: true,
            user,
            token,
        });
}


module.exports = sendToken;