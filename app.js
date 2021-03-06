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
const mailFunction = require("./routes/mailFunction");
const welcomeNote = require("./routes/welcomeNote");

// payment Gateway
const stripeRoute = require("./routes/stripe");

// env
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());
// app.options("*", cors());
// app.use(
//     cors({
//         origin: "https://jstore-app.herokuapp.com",
//         methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     })
// );

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
app.use(`/email`, mailFunction);
app.use(`/`, welcomeNote);

// Server
app.listen(port, () => {
    console.log(`Server is live ${port}`);
});
