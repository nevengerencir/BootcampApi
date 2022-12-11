const express = require('express');
const path = require('path')
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload')
const connectDB = require('./config/db');
const errorHandler = require('./middelware/error.js')
dotenv.config({ path: "./config/config.env" });


const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');



// Connect to database
connectDB();

const app = express();
app.use(express.json());
//Creating a react app

//Mounting my routers
if ((process.env.NODE_ENV = "development")) {
  app.use(morgan("dev"));
}

app.use(fileupload())

app.use(express.static(path.join(__dirname,'public')))

app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);


app.use(errorHandler)




const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`server running on ${process.env.NODE_ENV} ${PORT}`.yellow.bold)
);

// Handle unhandled rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err}`.red.bold);
  //Close server and exit process
  server.close(() => process.exit(1));
});
