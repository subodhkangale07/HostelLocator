import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import BasicInformation from '../components/HostelRegistration/BasicInformation';
import HostelInformation from '../components/HostelRegistration/HostelInformation';
import { ScrollView } from 'react-native-gesture-handler';
import GetHostelLocation from '../components/HostelRegistration/GetHostelLocation';
import HostelPictures from '../components/HostelRegistration/HostelPictures';
import { useDispatch, useSelector } from 'react-redux';
import { setStep } from '../slices/stepSlice';
import { setPictures } from '../slices/hostelFormSlice';

const RegisterHostel = () => {
    // const [step,set/Step] = useState(4);

   const {step} = useSelector((state)=>state.step);
   const {update} = useSelector((state)=>state.hostelForm);
   const dispatch = useDispatch();
  
  //  dispatch(setStep(4));

  useEffect(()=>{
    dispatch(setStep(1));
    if(!update){
      dispatch(setPictures({}));
      
    }
  },[]);


  return (
    <View>
        <View
         className='flex-row  self-center items-center my-2 '
        >
              <View
               className={` border border-black  self-center rounded-full px-3 py-2 bg-blue-100 ${step === 1 ?'bg-blue-400' :' '} ${step>1 ? ' bg-blue-950 text-white ':''}`}
              >
                <Text className={`${step >1 ? "text-white" : "text-black"}`}> 1 </Text>
                 
              </View>

                <View
                 className='text-black  border-b  border-dashed  w-6'> 
                </View>

              <View
             className={` border border-black  self-center rounded-full px-3 py-2 bg-blue-100 ${step === 2 ?'bg-blue-400' :' '} ${step>2 ? ' bg-blue-950 text-white ':''}`}
>
                <Text className={`${step >2 ? "text-white" : "text-black"}`}> 2 </Text>
                 
              </View>

              <View
                 className='text-black  border-b  border-dashed  w-6'> 
                </View>

              <View
             className={` border border-black  self-center rounded-full px-3 py-2 bg-blue-100 ${step === 3 ?'bg-blue-400' :' '} ${step>3 ? ' bg-blue-950 text-white ':''}`}
             >
                <Text className={`${step >3 ? "text-white" : "text-black"}`}> 3 </Text>
                 
              </View>

              <View
                 className='text-black  border-b  border-dashed  w-6'> 
                </View>

              <View
             className={` border border-black  self-center rounded-full px-3 py-2 bg-blue-100 ${step === 4 ?'bg-blue-400' :' '} ${step>4 ? ' bg-blue-950 text-white ':''}`}
             >
                <Text className='text-black'> 4 </Text>
                 
              </View>
        </View>
        {
            step === 1 &&(
                <ScrollView
                 className=' border border-gray-500 mx-2  my-2  rounded-lg  '
                >
                <BasicInformation
                 
                />
                </ScrollView>
            )
        }

       {
            step === 2 &&(
                <ScrollView
                 className=' border border-gray-500 mx-2  my-2  rounded-lg  '
                >
                <HostelInformation/>
                </ScrollView>
            )
        }

        {
          step === 3 &&(
            <ScrollView
            className=' border border-gray-500 mx-2  my-2  rounded-lg  '
           >
           <GetHostelLocation/>
           </ScrollView>
          )
        }

        {
          step === 4 &&(
            <ScrollView
            contentContainerStyle={{paddingBottom:30 ,marginBottom:2}}
            className=' border border-gray-500 mx-2  my-2  rounded-lg  '
           >
           <HostelPictures/>
           </ScrollView>
          )
        }

    </View>
  );
};

export default RegisterHostel;
