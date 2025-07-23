import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView, ToastAndroid } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendOtp } from '../services/apiCaller';


const SignUp = () => {
      const [accountType,setAccountType] =useState('Student');
      const showToastWithGravityAndOffset = () => {
        ToastAndroid.showWithGravityAndOffset(
          'Otp sent on email successfully ! ',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          25,
          50,
        );
      };

  const navigation = useNavigation();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        console.log('Data retrieved:', value);
        return value;
      }
    } catch (e) {
      console.log('Error retrieving data:', e);
    }
  };



  // getData('token');

  const onSubmit = (data) => {
    data.accountType = accountType;
    console.log("Form Data:", data); // Logs all the form values on submit
    navigation.navigate('VerifyOtp',data);
    sendOtp(data.email);
    showToastWithGravityAndOffset();
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior based on platform
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled'>
        <View className='flex-1 bg-white justify-center'>
          <View
            className='bg-blue-50 rounded-full w-[400px] h-[400px] self-end absolute z-[-1] top-[-200px] right-[-200px]'
          ></View>

          <View
            className='border-2 border-gray-100 rounded-full w-[400px] h-[400px] self-end absolute z-[-1] top-[-190px] right-[-190px]'
          ></View>

          {/* Make A Square */}
          <View
            className='  mt-6 w-[300px] h-[300px] absolute border-2 bottom-[-130px] rotate-45 left-[-170px] border-gray-100'
          ></View>

          <View
            className='w-[300px] h-[300px] absolute border-2 bottom-[-160px] left-[-140px] border-gray-100'
          ></View>

          <View>
            <Text className='text-center py-2 text-blue-800 font-bold text-2xl'>
              Create Account
            </Text>
            <Text className='text-black text-center text-lg font-semibold'>
              {`Create an account so you can explore all the\n existing Hostels`}
            </Text>
          </View>

          

          <View className='mx-8 '>
            
          <View
           className=' flex-1 flex-row justify-between items-center'
          >
            <View><Text
             className=' text-black font-semibold text-lg '
            >Account Type : </Text></View>
            <View
             className='bg-blue-700 self-end flex-row justify-between  py-2 rounded-full  px-1  my-1  '
            >

            
            <View>
              <TouchableOpacity
               onPress={()=>setAccountType('Student')}
               className={`${accountType === 'Student' ? " bg-blue-400  rounded-full " : ""}  py-1 px-1`}
              >
                <Text
                >Student</Text>
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity
              onPress={()=>setAccountType('Hostel')}
              className={`${accountType === 'Hostel' ? " bg-blue-400  rounded-full " : ""}  py-1 px-1`}
            
              
              >
                <Text>Hostel</Text>
              </TouchableOpacity>
            </View>

            </View>

          </View>

            <View
             className='flex-1 flex-row  w-full  flex justify-between items-center'
            >
            <View className='w-[48%]'>
             <TextInput
              placeholder='First Name'
              {...register('firstName', {
                required: 'First Name  is required',
              })}
              placeholderTextColor={'gray'}
              className='bg-[#F1F4FF]    my-2 text-black pl-2 border border-blue-800 rounded-md'
              onChangeText={text => setValue('firstName', text)}
            />
            {errors.email && (
              <Text style={{ color: 'red' }}>{errors.email.message}</Text>
            )}
            </View>
            <View
             className='w-[48%]'
            >

          <TextInput
              placeholder='Last Name'
              {...register('lastName', {
                required: 'Last Name  is required',
              })}
              placeholderTextColor={'gray'}
              className='bg-[#F1F4FF]   my-2 text-black pl-2 border border-blue-800 rounded-md'
              onChangeText={text => setValue('lastName', text)}
            />
            {errors.email && (
              <Text style={{ color: 'red' }}>{errors.email.message}</Text>
            )}
            </View>

            </View>
            <TextInput
              placeholder='Email'
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: 'Invalid email address',
                },
              })}
              placeholderTextColor={'gray'}
              className='bg-[#F1F4FF] my-2 text-black pl-2 border border-blue-800 rounded-md'
              onChangeText={text => setValue('email', text)}
            />
            {errors.email && (
              <Text style={{ color: 'red' }}>{errors.email.message}</Text>
            )}

            <TextInput
              placeholder='Password'
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              placeholderTextColor={'gray'}
              className='bg-[#F1F4FF] text-black pl-2 my-2 border border-blue-800 rounded-md'
              secureTextEntry
              onChangeText={text => setValue('password', text)}
            />
            {errors.password && (
              <Text style={{ color: 'red' }}>{errors.password.message}</Text>
            )}

            <TextInput
              placeholder='Confirm Password'
              {...register('confirmPassword', {
                required: 'Confirm password is required',
                validate: value =>
                  value === getValues('password') || 'Passwords do not match',
              })}
              placeholderTextColor={'gray'}
              className='bg-[#F1F4FF] text-black pl-2 my-2 border border-blue-800 rounded-md'
              secureTextEntry
              onChangeText={text => setValue('confirmPassword', text)}
            />
            {errors.confirmPassword && (
              <Text style={{ color: 'red' }}>{errors.confirmPassword.message}</Text>
            )}

            <TouchableOpacity className='w-full bg-blue-600 py-4 rounded-md' onPress={handleSubmit(onSubmit)}>
              <Text className='self-center text-lg font-bold text-white'>Send Otp </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className='text-center text-gray-400 font-bold py-2'>
              Already have an account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default SignUp;
