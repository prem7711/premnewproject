require('dotenv').config()
const mongoose= require("mongoose");
//connection creation and creating a new db
mongoose.connect(process.env.DB_CONN)
.then(()=>console.log("connection successful...."))
.catch((err)=>console.log(err));
