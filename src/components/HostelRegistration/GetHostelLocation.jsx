import Geolocation from '@react-native-community/geolocation';
import React, { Component, useEffect, useState } from 'react'
import { Alert, Linking, PermissionsAndroid, Text, TouchableOpacity, View } from 'react-native'
import { ChevronLeftIcon, ChevronRightIcon } from 'react-native-heroicons/outline';
import { setStep } from '../../slices/stepSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setLocationInSlice } from '../../slices/hostelFormSlice';

const GetHostelLocation = ()=>{
   const dispatch = useDispatch();
    const [location,setLocation] = useState()
   const {locationInSlice} = useSelector((state)=>state.hostelForm);
    const requestLocationPermission = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'HostelLocator Geolocation Permission',
              message: 'HostelLocator App needs access to your location.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Location permission granted');
            getCurrentLocation(); // Call location fetching after permission is granted
          } else {
            console.log('Location permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      };
    
      // Get the current location
      const getCurrentLocation = () => {
        // iOS only: request authorization
        Geolocation.requestAuthorization();
    
        Geolocation.getCurrentPosition(
          position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            setLocation({ latitude, longitude });
            console.log('Position:', latitude, longitude);
          },
          error => {
            // Handling the error codes
            if (error.code === 1) {
              // Permission denied
              Alert.alert(
                'Permission Denied',
                'You have denied location permissions. Please enable them in the settings.',
                [
                  { text: 'Cancel' },
                  { text: 'Open Settings', onPress: () => Linking.openSettings() },
                ]
              );
            } else if (error.code === 2) {
              // Position unavailable (e.g., GPS turned off)
              Alert.alert(
                'Location Unavailable',
                'Location services are turned off. Please enable them in the settings.',
                [
                  { text: 'Cancel' },
                  { text: 'Open Settings', onPress: () => Linking.openSettings() },
                ]
              );
            } else {
              // General error handling
              Alert.alert(
                'Error',
                `Unable to get location: ${error.message}`
              );
            }
          },
          {
            enableHighAccuracy: false,
            timeout: 10000, // Increased timeout
            maximumAge: 10000,
          }
        );
      };
   
      
       const onSubmit = () =>{
         dispatch(setStep(4));
         dispatch(setLocationInSlice(location));

       }
      useEffect(()=>{
         if(Object.keys(locationInSlice).length !== 0)
         {
          setLocation(locationInSlice);
          //  console.log(locationInSlice);
         }
      },[]);


    return (
        <View>
        <View
         className=' flex-1  h-[600]  bg-white justify-center items-center   '
        >
           <Text
            className=' text-black text-lg  font-semibold self-center py-2 '
           > Provide Hostel Location </Text>
          
           <TouchableOpacity
           onPress={requestLocationPermission}
            className=' py-2 px-1 bg-blue-500 rounded-lg border border-black  self-center '
           >
             <Text
              className=' text-white  font-semibold  '
             >Grant Permission </Text>
           </TouchableOpacity>

           {
            location &&(
                <Text
                 className='text-black ' 
                > {location.latitude} && {location.longitude} </Text>
            )
           }


           <Text className=' text-red-400 '> Note* - Please turn on your Gps </Text>

           

        </View>
        {
             location &&(
              <View
              className='flex-row justify-between py-2 gap-x-2 '
             >
        
             
              <TouchableOpacity
                onPress={()=>{
                   dispatch(setStep(2))
                }}
                className="bg-blue-700 py-2 self-center  px-1 border border-black rounded-lg flex-1 flex-row  justify-center items-center"
           
             >
               
        
                <ChevronLeftIcon
                color={'white'}
                size={16}
                strokeWidth={4}
                />
                 <Text className="text-white self-center font-semibold text-lg">
                  Back
                </Text>
        
               
              </TouchableOpacity>
        
              <TouchableOpacity
                onPress={()=>onSubmit()}
                className="bg-blue-700 py-2  self-center px-1 border border-black rounded-lg flex-1 flex-row  justify-center items-center"
              >
                <Text className="text-white self-center font-semibold text-lg">
                  Next
                </Text>
                <ChevronRightIcon
                    color={'white'}
                    size={16}
                    strokeWidth={4}
                  />
              </TouchableOpacity>
        
              </View>
             )
           }
        </View>
    )
}

export default GetHostelLocation
