const mongoose = require('mongoose');
require('dotenv').config();

exports.connect = ()=>{
    mongoose.connect(process.env.MONGODB_URL,{})
    .then(()=>{console.log("DB Connected 1")})
    .catch((e)=>{console.log(e); console.log("DB Connection 0");process.exit(1)})
}
  










