import React, { Component, useEffect, useState } from 'react'
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native'
import { getAllHostels, getHostelDetials } from '../services/apiCaller';
import { getData } from '../utils/getAndSetData';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { setBasicInfo, setHostelInfo, setId, setLocationInSlice, setPictures, setUpdate } from '../slices/hostelFormSlice';
import { useIsFocused, useNavigation } from '@react-navigation/native';

const UpdateHostelDetails = ()=>{
    const [data,setData] = useState([]);
    const dispatch = useDispatch();
    const isFocused = useIsFocused(); // This hook detects when the screen is focused

    const navigation = useNavigation();

    
    // let token;
    const getHostels = async () => {
        try {
          const token = await getData('token');
          console.log("Token:", token);
          const res = await getAllHostels(token);
          console.log("Hostels result:", res);
          setData(res.data);
        } catch (error) {
          console.log("Error fetching hostels:", error);
        }
      };
    
      useEffect(() => {
        if (isFocused) {
          getHostels();
        }
      }, [isFocused]); // Re-fetch data when the screen is focused

 
    console.log("Data ++ -- ++ " ,data);

    const handleUpdateHostelDetails = async(id)=>{
         console.log(id);

         const hostelData  = await getHostelDetials(id);

         console.log("Data  in caller  of Hostel ",hostelData);

         if(hostelData){
            dispatch(setId(id));
             console.log("Setting the hostel id ",id);
            dispatch(setBasicInfo({
               
                hostelName: hostelData.hostelName,
                ownersFullName: hostelData.ownersFullName,
                contactNumber: hostelData.contactNumber,
                alternateContactNumber: hostelData.alternateContactNumber,
                hostelAddress: hostelData.hostelAddress,
                landmark: hostelData.landmark,
              }));
         }
         dispatch(setHostelInfo({
            hostelType: hostelData.hostelType,
            roomType: hostelData.roomType,
            wifi: hostelData.wifi,
            hotWater: hostelData.hotWater,
            drinkingWater: hostelData.drinkingWater,
            instructions: hostelData.instructions,
            price:hostelData?.price
          }));

          dispatch(setLocationInSlice({
            latitude: hostelData.latitude,
            longitude: hostelData.longitude,
          }));

          dispatch(setPictures({
            roomImage: hostelData.roomImage,
            bedImage: hostelData.bedImage,
            exteriorImage: hostelData.exteriorImage,
          }));
          dispatch(setUpdate(true));
          navigation.navigate('RegisterHostel');




    }
  if(!data){
    return (
      <View
       className=' h-screen w-screen flex-col items-center justify-center'      
      >

    
      <ActivityIndicator
       size={24}
       color={'blue'}
      ></ActivityIndicator>
        </View>
    )
  }
    return(
        <ScrollView
         className=''
        >
             <Text
              className=' text-black font-semibold  text-center  py-2  text-xl '
             > Your Hostels </Text>
           
                {
                    data && data.map((hostel,index)=>(
                        <View
                          className= ' flex flex-row  py-2 my-2 border border-gray-300 mx-2 rounded-md px-2  items-center justify-between'
                         key={index}
                        >
                            <Image
                             className=' object-cover rounded-md  '
                             source={{uri:hostel.exteriorImage}}
                             height={100}
                             width={100}
                            />
                            <Text className= ' text-black' >{hostel.hostelName}</Text>

                            <View>
                                <TouchableOpacity
                                onPress={()=>{
                                    navigation.navigate('UpdateHostelOccupancy',hostel);
                                }}
                                 className= ' flex items-center justify-center py-2 px-1 bg-blue-400 rounded-lg border border-gray-600'
                                >
                                    <Text
                                     className= 'text-black '
                                    >Update Ocuupancy</Text>
                                </TouchableOpacity>

                                <TouchableOpacity

                                onPress={()=>{}}
                                 className= ' mt-2  py-2 px-1 bg-green-200 rounded-lg border border-gray-600'
                                >
                                    <Text
                                     className= 'text-black  '
                                     onPress={()=>handleUpdateHostelDetails(hostel._id)}
                                    >Update Hostel Details </Text>
                                </TouchableOpacity>

                            </View>

                        </View>
                    ))
                }
            
        </ScrollView>
    )
}

export default UpdateHostelDetails
