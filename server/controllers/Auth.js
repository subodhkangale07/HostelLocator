

const User = require('../models/User');
const Otp = require('../models/Otp');
const otpGenrator = require('otp-generator');
const bcrypt = require('bcryptjs');
const Profile = require('../models/Profile')
const jwt = require('jsonwebtoken');
const {uploadImageToCloudinary} = require('../utils/imageUploader');
// const { request } = require('express');
const mailSender = require('../utils/mailSender');
require('dotenv').config();
//sendOtp
exports.sendOtp = async(req,res)=>{
 
    try{
       
        const {email} =req.body;

        console.log('email at bd ' ,req.body);
    
        //User Exists ? 
        const checkUserPresent = await User.findOne({email:email});
    
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User Already Exists",
    
            })
        }

        var otp = otpGenrator.generate(6, {upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false, });

        console.log("Otp Genrated -->" ,otp);

        //check unique otp or not
        let result = await Otp.findOne({otp});
        while(result){
             otp = otpGenrator.generate(6,{
                upperCaseAlphabates:false,
                lowerCaseAlphabates:false,
                specialChars:false,
                });

         result = await Otp.findOne({otp});
        }

        const otpPayload = {email,otp};
        //create an entry for otp in db
        const otpBody = await Otp.create(otpPayload);

        res.status(200).json({
            success:true,
            message:"Otp Created SuccesFully !",
            otp,
        })

    }
    catch(e){
        console.log(" Errror In Otp Genration Function --> ",e);
        res.status(500).json({
            success:false,
            message:e.message,
        })
    }

};

//signup
exports.signUp = async (req, res) => {
    try {
        // Fetch data from req body
        const {firstName , lastName , email, password, confirmPassword, otp,accountType ,contactNumber} = req.body;
        console.log("Account Type -->> ", accountType);

        // Validate
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All Fields Are Required",
            });
        }

        // 2 password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User is Already Registered",
            });
        }

        // Find the most recent OTP for the user
        const recentOtp = await Otp.findOne({ email: email }).sort({ createdAt: -1 });

        // Validate if OTP is found
        if (!recentOtp) {
            return res.status(400).json({
                success: false,
                message: "No OTP found for this email",
            });
        }

        // Validate OTP length
        if (recentOtp.otp.length === 0) {
            return res.status(400).json({
                success: false,
                message: "OTP is invalid (length 0)",
            });
        }

        // Validate if OTP matches
        if (otp !== recentOtp.otp) {
            return res.status(400).json({
                success: false,
                message: "OTP does not match",
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create Profile in DB
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            contactNumber: null,
        });

        // Create User in DB
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        // Return response
        return res.status(200).json({
            success: true,
            message: "User is Registered Successfully",
            user,
        });

    } catch (e) {
        console.log("Error In SignUp ", e);
        return res.status(500).json({
            success: false,
            message: "User Cannot Be Registered. Try Again Later",
            data: e.message,
        });
    }
}
//login

exports.login = async (req,res)=>{
    try{
       
        //getData From Req body
        const {email,password} = req.body;
        //validation
        console.log(email,password);
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All Feilds Are Required",

            })
        }
        //User Existts?
        const user = await User.findOne({email}).populate("additionalDetails");
       // console.log(user);
       if(!user){
        return res.status(401).json({
            success:false,
            message:"User Not Found Please  Sign Up !!"
        })
       }

        //jwt , after Password Matching
       if(await bcrypt.compare(password,user.password)){
        //payload jwt secrete options
          const payload = {
            email:user.email,
            id:user._id,
            accountType:user.accountType, //role ki jagah account Type Ayega
          }

         const token = jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"10d",
         });


         
         user.token=token;
         user.password = undefined;
         
          const options = {
            expires: new Date(Date.now() +5*24*60*60*1000),
            httpOnly:true,
            secure:true,
          }
         res.cookie("token",token,options).json({
            success:true,
            token,user,
            message:"User Logged In SucceSFullY ",
         })

         
       }

       
        //create cookie
        
        //send res
        else{
            return res.status(401).json({
                success:false,
                message:" Password Not Matched",
            })
        }


    }
    catch(e){
      
        console.log("Error in Login Controller ",e.message);
        return res.status(500).json({
            success:false,
            message:e.message,
        })
    }

}



//changePassword

exports.changePassword = async(req,res)=>{
    //get data from req body

    //get oldpassword , newpass , confirmnewPPass
    // In my Opiniion we should take email also to find the user in db
    //User is Already Registered

    try{

        const {oldpassword,newpassword,confirmnewpassword} = req.body;
        //validation
    
        if(!oldpassword || !newpassword || !confirmnewpassword){
            return res.status(401).json({
                success:false,
                message:"All feilds Required For Changing  PAssWord",
            });
    
        }
    
        //upadatepassin db
          const id = req.user.id;
         const user= await User.findById(id);
         if(!user)
         {
            return res.json({
                success:false,
                message:" User Does Not Exists",

            })
         }
        if(newpassword !== confirmnewpassword)
        {
            return res.json({
                success:false,
                messgae:"PassWord And Confirn Password Not Matching",
            })
        }
        const hashedPassword = await bcrypt.hash(newpassword,10);
        const updatedUser = await User.findByIdAndUpdate(id,{
            password:hashedPassword,
        },{new:true});
        //send mail
          
        const response = await mailSender(user.email,"Password Changed SuccessFully",`Dear ${user.firstName} Your new Password is : ${newpassword}`);


    
        //return response
        return res.json({
            success:true,
            message:"Password Changed SuccessFully !!",
        })
        

    }
    catch(e)
    {
        console.log(e);
        return res.status(500).json({
            success:false,
            message:e.message,

        })
    }
   

}

exports.updateProfileImage = async(req,res)=>{

    try{
        console.log("Body Of Request " ,req.body);
        console.log("Body Of files " ,req.files);
        
    //   formData.append("displayPicture", imageFile)
        const imageFile =  req.files.profileImage ;
        const email = req.body.email;
        
 
        const response = await uploadImageToCloudinary(imageFile,"StudyNotion");

        const updatedUser = await User.findOneAndUpdate({email:email},{image:response.secure_url},{new:true}).populate('additionalDetails');

        return res.status(200).json({
            success:true,
            message:"Image UpDated SuccessFully !",
            user:updatedUser,
        })


        
        
    }
    catch(e)
    {
        console.log(e);
        return res.status(500).json({
            success:false,
            message:"Error While Updating Profile Image "
        })
    }
}