const  jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User')
//Auth

exports.auth = async(req,res,next)=>{
try{
   
    //extract token
    const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");
    console.log("Token is :: ",token);

    // console.log("Token ",token);

     if(!token){
        return res.status(401).json({
            success:false,
            message:"Token Misiing",
        })
     }

     try{
        const decode =  jwt.verify(token,process.env.JWT_SECRET);
         console.log("Decode Token -- >",decode);

        //  Embed The Decoded Data in req 
         req.user = decode;
     }
     catch(e){
        console.log("Error While Decoding The Token" , e);
        res.status(401).json({
            success:false,
            message:"Error While Decoding Token !!",
        })
     }
     next();
}
catch(e){
    console.log(e);
    return res.status(500).json({
        success:false,
        message:"Something Went Wrong While Validating the Token",
        data:e.message,
    })
}
}

//Student

exports.isStudent = async (req,res,next)=>{
    try{
          if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"Thius is Protected Route For Students  Only ,  You Are Not Student !!",

            })
          }
          next();
    }
    catch(e){
    console.log(e,"Error In isSAtudent MiddleWare ")
    return res.status(500).json({
        success:false,
        message:"Error in isStudemt MiddleWare",

    })
    }
}



//Instructor
exports.isHostel = async (req,res,next)=>{
    try{
          if(req.user.accountType !== "Hostel"){
            return res.status(401).json({
                success:false,
                message:"This is Protected Route For Hostels  Only And You Are Not Hostel !!",

            })
          }
          next();
    }
    
    catch(e){
    console.log(e,"Error In Instructor MiddleWare ")
    return res.status(500).json({
        success:false,
        message:"Error in Instructort MiddleWare",

    })
    }
}



exports.isAdmin = async (req,res,next)=>{
    try{
          if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"Thius is Protected Route For Admin Only Nad You Are Not Admin !!",

            })
            
          }
          next();
    }
    catch(e){
    console.log(e,"Error In Instructor MiddleWare ")
    return res.status(500).json({
        success:false,
        message:"Error in Instructort MiddleWare",

    })
    }
}





