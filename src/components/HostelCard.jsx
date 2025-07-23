import React, { Component, useEffect, useState } from 'react'
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import ImageSlider from './ImageSlider';
import { MapPinIcon, PhoneIcon } from 'react-native-heroicons/outline';
import Icon from 'react-native-vector-icons/FontAwesome'; // or 'Ionicons', 'MaterialIcons', etc.
import { useNavigation } from '@react-navigation/native';

const {height,width} = Dimensions.get('screen');

const HostelCard = ({hostel})=>{
      const navigation = useNavigation();
      const [images,setImages] = useState([]);
     useEffect(()=>{
        const newImages = [];
        if (hostel?.bedImage) newImages.push(hostel.bedImage);
        if (hostel?.exteriorImage) newImages.push(hostel.exteriorImage);
        if (hostel?.roomImage) newImages.push(hostel.roomImage);
      
        setImages(newImages);
     },[]);


     console.log(images);


    return(
        <TouchableOpacity
        onPress={()=>navigation.navigate('HostelScreen',hostel)}
         style={{
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 10,
            backgroundColor: 'white', // Ensure background color for shadow contrast
            borderRadius: 10, // Border radius for rounded corners
        }}
         className='  shadow-lg rounded-xl shadow-red-600 my-4 mx-2   '
        >
            {/* <Text>{hostel.hostelName} Hello </Text> */}
     <View
     className='  ' 
     >
            <Image
             source={{uri:hostel.exteriorImage}}
              height={height*0.28}
              width={width*0.96}
              className='  bg-cover  rounded-t-xl'
            />
            <View
             className=' py-2 px-2 '
            >
                <Text
                 className= ' text-black  text-lg  text-center font-semibold  '
                >{hostel.hostelName}</Text>
                <View
                 className=' flex-row items-center'
                >
                <View
                 className='  rounded-full bg-blue-300 self-start p-1 mr-2'
                >
                <MapPinIcon
                  color={'black'}
                />
                </View>

                <Text
                 className=' text-slate-600'
                >
                    {hostel.hostelAddress}
                </Text>
               
               
                </View>
                
                <View
                 className=' flex-row  items-center  my-2 '
                >
                    
                    <View
                     className=' mr-2  flex items-center justify-center p-1 bg-blue-300  rounded-full self-start '
                    >
                    <PhoneIcon
                     color={'black'}
                     size={20}
                    />
                    

                    </View>

                    <Text
                      className='text-slate-600'
                    >
                        {hostel.contactNumber}
                    </Text>

                   
                </View>

                <View className='flex-row items-center'>
  <Text className='text-slate-600 pr-2'>Available for -</Text>
  <View className='flex-row items-center'>
    <Text
      className={`text-white rounded-md px-2 py-1 ${
        hostel.hostelType === 'Boys'
          ? 'bg-blue-400'
          : hostel.hostelType === 'Girls'
          ? 'bg-pink-400'
          : hostel.hostelType === 'Both'
          ? 'bg-purple-400' // A mixed color for both
          : ''
      }`}
    >
      {hostel.hostelType === 'Boys' && '• Boys'}
      {hostel.hostelType === 'Girls' && '• Girls'}
      {hostel.hostelType === 'Both' && '• Boys • Girls'}
    </Text>
  </View>
</View>

            </View>
     </View>
           
        </TouchableOpacity>
    )
}

export default HostelCard
