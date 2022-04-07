// installing and requiring pakages:
// express(Web-framework), mongoose( library for MongoDB),
// dotenv( for hiding important things), nodemon
const express = require("express");
const mongoose = require("mongoose");
const dotenv =require("dotenv");
const cors = require("cors");


// Importing Routes
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute =require("./routes/stripe");

//make app using express ad framework
const app = express();

// before using dotenv we should config it 
dotenv.config();



//connecting to MongoDB-Atlas with mongoose
mongoose.connect( 
    // it brings tha value of variable MONGO_URL inside .env file:
    process.env.MONGO_URL
).then(()=> console.log("Connection to mongoDB: successfull"))
.catch((err) => {
    console.log(err)
});



// our app should be able to use json file 
app.use(express.json());

// adding routes to app
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);
app.use(cors())





// Runnig server
app.listen(process.env.PORT_NUMBER || 5800, () => {
    console.log("Server is running on localhost with port:5800");
})