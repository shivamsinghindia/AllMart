// // Handling Uncaught Exception errors
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Uncaught Exception errors");

    process.exit(1);
})

const express = require("express");
const ap = express();
const dotenv = require("dotenv");
dotenv.config({path: "backend/config/config.env"});
const cors = require("cors");
ap.use(cors());

const app = require("./app.js");

//Importing Route
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");

app.use("/api/v1",productRoute);
app.use("/api/v1",userRoute);
app.use("/api/v1",orderRoute);

const errorMiddleware = require("./middleware/error");
app.use(errorMiddleware);
const cloudinary = require("cloudinary").v2;
//Config : by doing this process.env = contents of config.env


const connectDatabase = require("./config/database.js");
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server working on http://localhost:${process.env.PORT}`); //value of PORT from config.env file
})


// Handling Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Unhandled Promise Rejection");

    server.close(()=>{
        process.exit(1);
    });
});

// const express = require("express");
// const cookieParser = require("cookie-parser");
// // const cors = require("cors");
// const dotenv = require("dotenv");

// const app = express();

// // Load environment variables
// dotenv.config({ path: "backend/config/config.env" });

// const connectDatabase = require("./config/database.js");
// const errorMiddleware = require("./middleware/error");

// // Connect to the database
// connectDatabase();

// // Middleware setup
// // app.use(cors({
// //     origin: "http://localhost:3000", // Allow requests from this origin
// //     credentials: true // Allow credentials such as cookies
// // }));
// app.use(express.json());
// app.use(cookieParser());

// // Importing routes
// const productRoute = require("./routes/productRoute");
// const userRoute = require("./routes/userRoute");
// const orderRoute = require("./routes/orderRoute");

// // Use routes
// app.use("/api/v1", productRoute);
// app.use("/api/v1", userRoute);
// app.use("/api/v1", orderRoute);

// // Error middleware
// app.use(errorMiddleware);

// // Handle uncaught exceptions
// process.on("uncaughtException", (err) => {
//     console.log(`Error: ${err.message}`);
//     console.log("Shutting down the server due to uncaught exception");
//     process.exit(1);
// });

// // Handle unhandled promise rejections
// process.on("unhandledRejection", (err) => {
//     console.log(`Error: ${err.message}`);
//     console.log("Shutting down the server due to unhandled promise rejection");

//     server.close(() => {
//         process.exit(1);
//     });
// });

// // Start the server
// const server = app.listen(process.env.PORT, () => {
//     console.log(`Server running on http://localhost:${process.env.PORT}`);
// });

