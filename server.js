const path = require('path')
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db');
//load env variables
dotenv.config({path: './config/config.env'});
//connect to database
connectDB();

//routes file

const auth = require('./routes/auth');
const users = require('./routes/users');
const certificate = require('./routes/certificate');


const app = express();

//body parser
app.use(express.json())

// Cookie Parser
app.use(cookieParser())

//dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//File upload
app.use(fileupload()); 

//Sanitize data
app.use(mongoSanitize())

//Set security headers
app.use(helmet())

//Prevent XSS attacks
app.use(xss())

//Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //10mins
    max: 100
})
app.use(limiter)

//prevent http param pollution
app.use(hpp())

//Enable CORS
app.use(cors())

//Set static folder
app.use(express.static(path.join(__dirname, 'public')))

//Mount routers
app.use('/auth', auth);
app.use('/users', users);
app.use('/certificate', certificate);


//error handling middleware
app.use(errorHandler)


const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});

//handle Unhandled promise rejection

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    //close server and exit process
    server.close(() => process.exit(1));
})
