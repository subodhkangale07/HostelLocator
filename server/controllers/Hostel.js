const { default: mongoose } = require("mongoose");
const Hostel = require("../models/Hostel");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.registerHostel =  async(req,res)=>{
   try{
       const {hostelName, ownersFullName , contactNumber ,alternateContactNumber , 
         hostelAddress ,landmark ,roomType,wifi,hotWater,drinkingWater,
         hostelType,instructions,exteriorImage,roomImage,bedImage,latitude,longitude,price} = req.body;


       if(!hostelName || !hostelAddress || !ownersFullName || ! contactNumber || !latitude || !longitude ){
        return res.status(404).json({
            success:false,
            message:" hostelName, ownersFullName , contactNumber  ,  hostelAddress , latitide ,longitude   ( some of the things  are  missing ) "
        });
       }

       const email = req.user.email;

       const user = await User.findOne({
        email:email
       });

       if(!user){
        return res.status(404).josn({
            success:false,
            message:" USer  Not Found "
        })
       }

       console.log("email  Fetched From  Token " , email);
     //  Registrer A Hsotel 
       const result = await Hostel.create({
        hostelName,hostelAddress,hostelOwner:user._id,
        landmark,ownersFullName,contactNumber,alternateContactNumber,
        latitude,longitude,roomImage,bedImage , exteriorImage , 
        roomType,hostelType,
        instructions, wifi , hotWater ,drinkingWater,
        price // set if provided
       });


       return res.status(200).json({
        success: true,
        message: "Hostel Registered Successfully!",
        data: result
    });




   }
   catch(e){
    console.log("Error " , e);
     return res.status(500).json({
        success:false,
        messgae:e.messgae
     })
   }  
}

exports.uploadHostelImages =  async(req,res)=>{
  try{
    console.log("Requets recived");
    const image = req.files.image;
   

    console.log(image);


    // console.log("Images Recived Are As Follows" , roomImage, bedImage ,exteriorImage );

    

    const result = await  uploadImageToCloudinary(image,'HostelLocator');
    // const bedImageResult = await  uploadImageToCloudinary(bedImage,'HostelLocator');
    // const roomImageResult = await  uploadImageToCloudinary(roomImage,'HostelLocator');


    // console.log(exteriorImageResult);

    return res.status(200).json({
      success:true,
      message:"Images Uploaded  SuccessFully ! ",
      image:result.secure_url,
    });


  }
  catch(e){
    console.log("Error While Uploading  Images To Cloudinary ");
    return res.status(500).json({
      success:false,
      messgae:e.message,
    });

  }
}

exports.getAllHostelsOfOwner = async(req,res)=>{
  try{
    // const id = req.user.id;
    const id = new mongoose.Types.ObjectId(req.user.id);
    console.log(id);
    console.log("Owner " ,id);

    const result = await Hostel.find();

    // console.log(result);

    //filter data
    const filteredResut = result.filter((hostel) => hostel.hostelOwner.toString() === id.toString());

    // console.log("Filtered Result "  , filteredResut)
   
    return res.status(200).json({
      success:true,
      message:"All Hostels Fetched SucccessFully ",
      data:filteredResut,
    })
  }
  catch(e)
  {
    console.log("Error in fetching the hostels " ,e);
    return res.status(500).json({
      success:false,
      messgae:"Error In Fetching the hostel Details ",
      data:e.messgae
    })
  }
}

exports.getHostelDetails =async (req,res)=>{
  const {id} = req.query;

  console.log("Id In Bd ;: " ,id);
  try{
     const result = await Hostel.findById({_id:id});

       if(!result){
         return res.status(404).json({
          success:false,
          messgae:"Hostel Not Found ",

         })
       }

       return res.status(200).json({
        success:true,
        message:"Hostel Dat Fetched Successfully ",
        data:result
       });

  }
  catch(e){
    console.log("Eror" ,e);
    return res.status(500).json({
      success:false,
      messgae:"Cannot Get Hostel Data",
      data:e.messgae
    })
  }
}

// const Hostel = require('../models/hostel'); // Ensure the Hostel model is imported

exports.updateHostelOccupancy = async (req, res) => {
  try {
    const hostelId = req.body.id; // Assuming the hostel ID is passed as a URL parameter
    console.log(hostelId);

    const updatedData = req.body; // Fetch all updated data from the request body
  console.log("Price " ,updatedData.price);

    // Update the hostel occupancy details by finding the hostel with the given ID and updating its fields
    const updatedHostel = await Hostel.findByIdAndUpdate(
      hostelId, 
      {
        $set: {
          hostelName: updatedData.hostelName,
          alternateContactNumber: updatedData.alternateContactNumber,
          bedImage: updatedData.bedImage,
          contactNumber: updatedData.contactNumber,
          drinkingWater: updatedData.drinkingWater,
          exteriorImage: updatedData.exteriorImage,
          hostelAddress: updatedData.hostelAddress,
          hostelType: updatedData.hostelType,
          hotWater: updatedData.hotWater,
          instructions: updatedData.instructions,
          landmark: updatedData.landmark,
          latitude: updatedData.latitude,
          longitude: updatedData.longitude,
          ownersFullName: updatedData.ownersFullName,
          roomImage: updatedData.roomImage,
          roomType: updatedData.roomType,
          wifi: updatedData.wifi,
          SingleBed: updatedData.SingleBed,
          DoubleBeds: updatedData.DoubleBeds,
          ThreeBeds: updatedData.ThreeBeds,
          FourBeds: updatedData.FourBeds,
          MoreThanFourBeds: updatedData.MoreThanFourBeds,
          price:updatedData.price,
        },
      },
      { new: true } // Returns the updated document
    );

    // Check if the hostel was found and updated
    if (!updatedHostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    // Return success response with updated hostel details
    res.status(200).json({
      message: 'Hostel details updated successfully',
      updatedHostel,
    });
  } catch (error) {
    // Handle any errors during the process
    console.error('Error updating hostel: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.updtaeHostelDetails = async(req,res)=>{
  try{
    const hostelId = req.body.id; 
    console.log(hostelId)
    const updatedData = req.body; 
    const hostel = await Hostel.findById(hostelId);
   if(!hostel){
    return res.status(404).json({
      success:false,
      message:"Hostel Not Found"
    });}

    const updatedHostel = await Hostel.findByIdAndUpdate(
      hostelId, 
      {
        $set: {
          hostelName: updatedData.hostelName,
          alternateContactNumber: updatedData.alternateContactNumber,
          bedImage: updatedData.bedImage,
          contactNumber: updatedData.contactNumber,
          drinkingWater: updatedData.drinkingWater,
          exteriorImage: updatedData.exteriorImage,
          hostelAddress: updatedData.hostelAddress,
          hostelType: updatedData.hostelType,
          hotWater: updatedData.hotWater,
          instructions: updatedData.instructions,
          landmark: updatedData.landmark,
          latitude: updatedData.latitude,
          longitude: updatedData.longitude,
          ownersFullName: updatedData.ownersFullName,
          roomImage: updatedData.roomImage,
          roomType: updatedData.roomType,
          wifi: updatedData.wifi,
          SingleBed: updatedData.SingleBed,
          DoubleBeds: updatedData.DoubleBeds,
          ThreeBeds: updatedData.ThreeBeds,
          FourBeds: updatedData.FourBeds,
          MoreThanFourBeds: updatedData.MoreThanFourBeds,
          price:updatedData?.price
        },
      },
      { new: true } // Returns the updated document
    );

    // Check if the hostel was found and updated
    if (!updatedHostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    // Return success response with updated hostel details
    res.status(200).json({
      message: 'Hostel details updated successfully',
      data:updatedHostel,
      success:true,
    });

  }
  catch(e){
    console.log("Error While Updating the Hostel Details " ,e);
    return res.status(500).json({
      success:false,
      message:"Error While updateing hostel Details "
    });

  }
}
exports.getAllHostels = async(req,res)=>{
try{
   const result = await Hostel.find().populate('hostelOwner');

   return res.status(200).json({
    success:true,
    messgae:"All Hostels Fetched SuccessFully",
    data:result,
   });
   
}
catch(e){
  console.log("Error while Fetching all hostels ",e);
  return re.status(500).json({
    success:false,
    messgae:"Error ",
    data:e.message,

  })
}
}

exports.searchHostels = async (req,res)=>{
  try {
    const { keyword,hostelType } = req.query;

    // Build the query
    let query = {};
    
    // Search by keyword in hostelName, ownersFullName, or hostelAddress
    if (keyword) {
      query.$or = [
        { hostelName: { $regex: keyword, $options: 'i' } },
        { ownersFullName: { $regex: keyword, $options: 'i' } },
        { hostelAddress: { $regex: keyword, $options: 'i' } }
      ];
    }

    // Filter by amenities
    if (hostelType) query.hostelType = hostelType;
    const hostels = await Hostel.find(query).populate('hostelOwner');
    res.json(hostels);

  } catch (error) {
    res.status(500).json({ error: 'Failed to search hostels' });
  }
}