require("dotenv/config");
const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

// Routes Import
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
const cartRoute = require("./routes/cart");

// payment Gateway
const stripeRoute = require("./routes/stripe");

// env
const port = process.env.API_PORT || 3000;

// Middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

// DB
mongoose
    .connect(process.env.DB_CONNECTION_STRING)
    .then(() => {
        console.log("DB connected");
    })
    .catch((err) => {
        console.log("Error ", err);
    });

// Routes
app.use(`/auth`, authRoute);
app.use(`/users`, userRoute);
app.use(`/products`, productRoute);
app.use(`/orders`, orderRoute);
app.use(`/carts`, cartRoute);
app.use(`/checkout`, stripeRoute);

// Server
app.listen(port, () => {
    console.log(`Server is live ${port}`);
});
