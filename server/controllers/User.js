const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");


exports.getProfileData = async(req,res)=>{
  try{
       // get the user by id 
       const userId = req.body.userId;

       const user = await User.findById({_id:userId}).populate('additionalDetails');

       if(!user){
         return res.status(404).json({
            success:false,
            message:"User Not Found"
         });
       }

       return res.status(200).json({
        success:true,
        data:user
       })
  }
  catch(e){
    console.log("Error " ,e);
    return res.status(500).json({
        success:false,
        message:e.message,
    })
  }
}

exports.updateProfile = async (req, res) => {
  try {
    const userId  = req.body.id; 

    const {dateOfBirth, contactNumber, gender } = req.body; 
    let image;
   if(req.files){
    image = req.files.image;
   }
    const user = await User.findById(userId).populate('additionalDetails');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log("image",image)
    if(image){
      const response = await uploadImageToCloudinary(image,'HostelLocator');
      user.image = response.secure_url;
    }

    const profile = await Profile.findById(user.additionalDetails);
    if (dateOfBirth) {
      profile.dateOfBirth = dateOfBirth;
    }
    if (contactNumber) {
      profile.contactNumber = contactNumber;
    }
    if (gender) {
      profile.gender = gender;
    }

    await profile.save();
    await user.save();

    return res.status(200).json({
      message: 'Profile updated successfully',
      success:true,
      user,
      profile,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

