const bodyParser = require('body-parser');
const express = require('express');
const dbConnect = require('./config/database');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const app = express();
const dotenv = require('dotenv').config();
const morgan = require('morgan');
const PORT = process.env.PORT || 4000;
const authRoute = require('./routes/authRoute');
const authProduct = require('./routes/productRoute');
const blogRoute = require('./routes/blogRoute');
const procateRoute = require('./routes/procateRoute');
const blogcateRoute = require('./routes/blogcateRoute');
const couponRoute = require('./routes/couponRoute');
dbConnect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
// app.use(express.json());
app.use(cookieParser());
app.use('/api/user',authRoute);
app.use('/api/product',authProduct);
app.use('/api/blog',blogRoute);
app.use('/api/procate',procateRoute)
app.use('/api/blogcate',blogcateRoute);
app.use('/api/coupon',couponRoute);

// Error Handler
app.use(notFound);
app.use(errorHandler);






app.listen(PORT ,() => {
    console.log(`Server is running on port ${PORT}`);
})