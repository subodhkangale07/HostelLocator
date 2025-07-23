
const cloudinary = require('cloudinary').v2;

const connectToCloudinary = () =>{
 try{
     require('dotenv').config();
    cloudinary.config({
        cloud_name:process.env.CLOUD_NAME,
        api_key:process.env.API_KEY,
        api_secret:process.env.API_SECRET,
        secure:true,

    })

    console.log("Cloudinary Connection Done !! ");
 }
 
 catch(e)
 {
    console.log("Error Ehile Estabilishing Connection With Cloudinary  , ",e)
 }
}

module.exports  = connectToCloudinary;

