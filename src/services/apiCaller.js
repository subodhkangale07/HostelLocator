import axios from "axios";
import { apiConnector } from "./apiConnector"
import { clearAsyncStorage, storeData } from "../utils/getAndSetData";
const BASE_URL = 'https://hostellocator.onrender.com';

export const test = async()=>{
    try{
        const result = await apiConnector('GET',BASE_URL);
        console.log("response from BackEnd" ,result.data);
        return result;
    } 
    catch(e)
    {
        console.log("Error in fE while Calling ",e);
    }
   
}

export const sendOtp = async(data)=>{
    const SEND_OTP_API = BASE_URL + '/sendOtp';
    console.log(SEND_OTP_API);
    console.log("data at services" ,data);

    try{
      const result = await apiConnector('POST',SEND_OTP_API,{email:data},null,null);
      console.log("Data of SendOtp Api ",result.data);

    }
    catch(e)
    {
        console.log("Error in sendOtp frontend",e);
    }
}

export const signUp = async(data,showToastWithGravityAndOffset,navigation)=>{
 const SIGN_UP_API = BASE_URL + '/signUp';
 try{
   const result = await apiConnector('POST',SIGN_UP_API,data);
   console.log(result.data);
   if(result.data){
    if(result.data.success)
    {
        showToastWithGravityAndOffset();
        navigation.navigate('Login');
        
    }

   }
 }
 catch(e)
 {
    console.log("Error While Sign Up ",e);
 }
}

export const login = async(data,showToastWithGravityAndOffset,storeData,navigation)=>{

    const LOGIN_API = BASE_URL + '/login';
    try{
       const result = await apiConnector('POST',LOGIN_API,data);
      console.log('result of login ', result);
       if(result.data.success){
        showToastWithGravityAndOffset();
        await clearAsyncStorage();
        await storeData('token',result.data.token);
        await storeData('user',result.data.user);
        navigation.navigate('Drawer');
        console.log("Login Done !!");
        console.log("Data of Login " ,result.data);

        return result.data;

       }

    }
    catch(e)
    {
        console.log("Error In logIn FrontEnd" ,e );

    }
}

export const uploadImage = async (formData) => {

    console.log("FormData in FE " ,formData);

  let API = BASE_URL + '/updateProfileImage';
    try {
      const response = await axios.post(API, {email:formData.email}, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Success', response.data.message);
    } catch (error) {
      console.error('Error uploading image:', error);
      console.log('Upload Failed', 'Failed to upload image. Please try again.');
    }
  };


  export async function updateProfileImage(formData,setLoading) {
    console.log("Services:", formData);
    const url = `${BASE_URL}/updateProfileImage`;
    console.log(url);
    console.log("In services for API of Update Profile Image");
     setLoading(true);
    const response = await fetch(`${BASE_URL}/updateProfileImage`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = await response.json();
      if(data.success)
      {
         await storeData('user',data.user);
      }
      console.log('Response:', data);
      setLoading(false);

}

export const uploadHostelImages = async(formData,setLoading)=>{
    console.log("Images calling ");
  const API_URL = BASE_URL + '/uploadHostelImages';
try{
  setLoading(true);
  const response = await fetch(API_URL, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  const data = await response.json();
  console.log("Data --> " ,data);

 
  console.log("Images -- >> " ,data);
  setLoading(false);
  return data;

}
catch(e){
  console.log("Error In FrontEnd While Uploading Images to Cloudinary ",e);
}

setLoading(false);
}

export const registerHostelApiCaller = async(data,token)=>{
  try{
     console.log("Data in apiCaller ", data,token);
    const API_URL = BASE_URL + '/registerHostel';
       const  result = await apiConnector('POST',API_URL,data,{
        Authorization: `Bearer ${token}`,
      });
      
      console.log("Result of Register Hostel " ,  result);
     
      return result.data;
      
  }
  catch(e){
    console.log("Error While Rwgistering the hostel " ,e);
  }
}

export const  getAllHostels = async (token)=>{
  try{
     const API = BASE_URL + '/getHostelsForOwner';

     const result = await apiConnector('GET',API,null,{
      Authorization: `Bearer ${token}`,
    });

    console.log(" Result of Hostels -- -- -- -- -- -- -- -- --  ",result.data);

    return result.data;
    

  }
  catch(e)
  {
    console.log("Error While Fetching The Hostel Details ", e);
  }
}

export const getHostelDetials =  async(id)=>{
  const API = BASE_URL +  `/getHostelDetails?id=${id}`;

  console.log("Data  of Id :: " ,id)
  try{
  const result = await apiConnector('GET',API);

  console.log(result.data);
  return result?.data?.data;
  }
  catch(e){
    console.log("Error While  fetching the hsotel Details " ,e);

  }

}

export const updateHostelOccupancyApiCaller = async (data) => {
  try {
    const API_URL = BASE_URL + '/updateHostelOccupancy';
    
    console.log("Data for updating hostel occupancy", data);

    const result = await apiConnector('POST', API_URL, data);

    console.log("Result of updating hostel occupancy: ", result.data);

    return result.data;
  } catch (error) {
    console.log("Error while updating hostel occupancy", error);
    throw error;
  }
};

export const updateHostelDetailsApiCaller = async(formData) =>{

  const API = BASE_URL +'/updateHostelDetails';
   try{
       const result = await apiConnector('POST',API,formData);
       console.log("Data of APi " , result.data.success);
       return result.data;
   }
   catch(e)
   {
    console.log("Error " ,e);
   }
}

export const getAllHostelsApiCaller = async(setLoading)=>{
        const API_URL = BASE_URL +'/getAllHostels';

        console.log("Calling to ",API_URL );


        try{
          setLoading(true);
          const result = await apiConnector('GET',API_URL);
          // console.log("Result of an api ",result.data.data);
          setLoading(false);
          return result.data.data;
        }
        catch(e){
          console.log("Error ",e);
        }
}

export const searchHostelsApiCaller = async(setLoading,keyword,hostelType)=>{

  const API_URL  = BASE_URL +`/searchHostels?keyword=${keyword}`;
  if(hostelType){
    //set it and get  add url 
  }
  try{ 
    setLoading(true);
   const result = await apiConnector('POST',API_URL);
   return result.data;

  }
  catch(e){
    console.log("Error " , e);
  }
  finally{
    setLoading(false);
  }
}

export const getProfileData = async(userId)=>{
  try{
    const url = BASE_URL+'/getProfileData';
   const result = await apiConnector('POST',url,{userId});
   console.log("Result is " , result.data);
   return result.data.data;
   
  }
  catch(e){
    console.log("Error In ProfileData " ,e);
  }
}

export const updateProfileApiCaller = async(formData)=>{
  const api = BASE_URL + '/updateUserProfile';
  try{
    const response = await fetch(api, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    
    const data = await response.json();
    console.log("data" ,data);
    return data;

  }
  catch(e){
    console.log("Error while updating profile in FE" , e);
  }
}