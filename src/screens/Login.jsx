import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { useForm } from 'react-hook-form';
import { Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView, ToastAndroid } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../services/apiCaller';
import Toast from 'react-native-toast-message';
import { getData } from '../utils/getAndSetData';

const Login = () => {

    const showToastWithGravityAndOffset = () => {
        ToastAndroid.showWithGravityAndOffset(
          'Login  successfull !! ',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          25,
          50,
        );
      };
    const navigation = useNavigation();
    const {
        register,handleSubmit,setValue,getValues,formState:{errors}
    } = useForm();

    const onSubmit = async(data)=>{
        console.log("Login Form Data ", data );
        const result = await login(data,showToastWithGravityAndOffset,storeData,navigation);
          if(result){
            Toast.show({
                text1:"Login successfull"
            })
            navigation.navigate('Home');
          }
        // console.log("Data is :: ",result);

    }

    const storeData = async (key, value) => {
        try {
            const jsonValue = JSON.stringify(value); // Convert the object to a JSON string
            await AsyncStorage.setItem(key, jsonValue);
            console.log('Data successfully stored');
          } catch (e) {
            console.log('Error storing data:', e);
          }
      };


    //   const getData = async (key) => {
    //     try {
    //         const jsonValue = await AsyncStorage.getItem(key);
    //         return jsonValue != null ? JSON.parse(jsonValue) : null; // Parse the JSON string back to an object
    //       } catch (e) {
    //         console.log('Error retrieving data:', e);
    //       }
    //   };
    // const f = async()=>{
    //     console.log('getData Called -- >> ');
    //     const data = await getData('user');
    //     console.log(data);
    // }
    // f();

        

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
                        className='  mt-6 w-[300px] h-[300px] absolute border-2 bottom-[-120px] rotate-45 left-[-150px] border-gray-100'
                    ></View>

<View
                        className='w-[300px] h-[300px] absolute border-2 bottom-[-110px]  left-[-150px] border-gray-100'
                    ></View>
                    <View>
                        <Text className='text-center py-2 text-blue-800 font-bold text-2xl'>
                            Login Here
                        </Text>
                        <Text className='text-black text-center text-lg font-semibold'>
                            {`Welcome back you’ve\nbeen missed!`}
                        </Text>
                    </View>

                    <View className='mx-8'>
                        <TextInput
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                  message: 'Invalid email address',
                                },
                              })}
                              onChangeText={text => setValue('email', text)}


                            placeholder='Email'
                            placeholderTextColor={'gray'}
                            className='bg-[#F1F4FF] my-2 text-black pl-2 border border-blue-800 rounded-md'
                        />
                        {errors.email && (
              <Text style={{ color: 'red' }}>{errors.email.message}</Text>
            )}

                        <TextInput
                           {...register('password',{
                            required:'Password is required'
                           })}
                           onChangeText={text => setValue('password', text)}

                            placeholder='Password'
                            placeholderTextColor={'gray'}
                            className='bg-[#F1F4FF] text-black pl-2 my-2 border border-blue-800 rounded-md'
                            secureTextEntry
                        />
                        {errors.password && (
              <Text style={{ color: 'red' }}>{errors.password.message}</Text>
            )}
                        <TouchableOpacity className='text-blue-800 font-bold self-end py-2'>
                            <Text className='self-end text-blue-800 font-bold py-2'>
                                Forgot your Password?
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                         onPress={handleSubmit(onSubmit)}
                        className='w-full bg-blue-600 py-4 rounded-md'>
                            <Text className='self-center text-lg font-bold text-white'>Sign In</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                     onPress={()=>navigation.navigate('SignUp')}
                    >
                        <Text className='text-center text-gray-400 font-bold py-2'>
                            Create new Account
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default Login
