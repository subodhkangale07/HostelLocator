import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { ChevronRightIcon } from 'react-native-heroicons/outline';
import { useDispatch, useSelector } from 'react-redux';
import { setStep } from '../../slices/stepSlice';
import { setBasicInfo } from '../../slices/hostelFormSlice';

const BasicInformation = () => {
  const dispatch = useDispatch();
  const { basicInfo } = useSelector((state) => state.hostelForm);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    register,
    watch,
  } = useForm();

  // Set the form field values if basicInfo is not empty
  useEffect(() => {
    if (Object.keys(basicInfo).length !== 0) {
      // Set the values for each field if basicInfo exists
      setValue('hostelName', basicInfo.hostelName);
      setValue('ownersFullName', basicInfo.ownersFullName);
      setValue('contactNumber', basicInfo.contactNumber);
      setValue('alternateContactNumber', basicInfo.alternateContactNumber);
      setValue('hostelAddress', basicInfo.hostelAddress);
      setValue('landmark', basicInfo.landmark);
    }
  }, [basicInfo, setValue]);

  const onSubmit = (data) => {
    // Dispatch the form data to the Redux store
    dispatch(setBasicInfo(data));
    dispatch(setStep(2)); // Move to the next step
    console.log('Hostel Details:', data);
  };

  // Fields will now be controlled by react-hook-form
  const formValues = watch();

  return (
    <ScrollView
      className="mx-2 bg-white flex-col gap-y-2 my-4 py-2 px-3"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom:40}}
    >
      <View>
        <Text className="text-center text-xl font-semibold my-2 text-black">
          Basic Information
        </Text>
      </View>

      {/* Hostel Name Input */}
      <Text
       className=' text-black '
      > Hostel Name <Text className=' text-red-900'>* </Text> </Text>
      <TextInput
        {...register('hostelName', {
          required: 'Hostel Name is Required',
        })}
        placeholder="Hostel Name"
        placeholderTextColor="gray"
        className="bg-[#F1F4FF] my-2 text-black pl-2 border border-blue-800 rounded-md"
        value={formValues.hostelName || ''} // Link to react-hook-form value
        onChangeText={(text) => setValue('hostelName', text)} // Update form state
      />
      {errors.hostelName && (
        <Text style={{ color: 'red' }}>{errors.hostelName.message}</Text>
      )}

      {/* Owner's Full Name Input */}
      <Text
       className=' text-black '
      > Owner's Full Name <Text className=' text-red-900'>* </Text>  </Text>
      <TextInput
        {...register('ownersFullName', {
          required: "Owner's Full Name is Required",
        })}
        placeholder="Owner's Full Name"
        placeholderTextColor="gray"
        className="bg-[#F1F4FF] my-2 text-black pl-2 border border-blue-800 rounded-md"
        value={formValues.ownersFullName || ''} // Link to react-hook-form value
        onChangeText={(text) => setValue('ownersFullName', text)} // Update form state
      />
      {errors.ownersFullName && (
        <Text style={{ color: 'red' }}>{errors.ownersFullName.message}</Text>
      )}

      {/* Contact Number Input */}
      <Text className=' text-black '>
  Contact Number <Text className=' text-red-900'>* </Text>
</Text>

<TextInput
  {...register('contactNumber', {
    required: 'Contact Number is required',
    pattern: {
      value: /^[0-9]{10}$/, // Regex for exactly 10 digits
      message: 'Phone number must be exactly 10 digits',
    },
  })}
  placeholder="Contact Number"
  keyboardType="numeric"
  placeholderTextColor="gray"
  className="bg-[#F1F4FF] my-2 text-black pl-2 border border-blue-800 rounded-md"
  value={formValues.contactNumber || ''} // Link to react-hook-form value
  onChangeText={(text) => setValue('contactNumber', text)} // Update form state
/>
{errors.contactNumber && (
  <Text style={{ color: 'red' }}>{errors.contactNumber.message}</Text>
)}


      {/* Alternate Contact Number Input */}
      <Text
       className=' text-black '
      > Alternate Contact Number </Text>
      <TextInput
        {...register('alternateContactNumber')}
        placeholder="Alternate Contact Number (Not mandatory)"
        keyboardType="numeric"
        
        placeholderTextColor="gray"
        className="bg-[#F1F4FF] my-2 text-black pl-2 border border-blue-800 rounded-md"
        value={formValues.alternateContactNumber || ''} // Link to react-hook-form value
        onChangeText={(text) => setValue('alternateContactNumber', text)} // Update form state
      />

      {/* Hostel Address Input */}
      <Text
       className=' text-black '
      > Hostel Address <Text className=' text-red-900'>* </Text>  </Text>

      <TextInput
        {...register('hostelAddress', {
          required: 'Hostel Address is Required',
        })}
        placeholder="Hostel Address"
        placeholderTextColor="gray"
        className="bg-[#F1F4FF] my-2 text-black pl-2 border border-blue-800 rounded-md"
        value={formValues.hostelAddress || ''} // Link to react-hook-form value
        onChangeText={(text) => setValue('hostelAddress', text)} // Update form state
      />
      {errors.hostelAddress && (
        <Text style={{ color: 'red' }}>{errors.hostelAddress.message}</Text>
      )}

      {/* Landmark Input */}
      <Text
       className=' text-black '
      > Landmark </Text>

      <TextInput
        {...register('landmark', {
          required: 'Landmark is Required',
        })}
        placeholder="Landmark"
        placeholderTextColor="gray"
        className="bg-[#F1F4FF] my-2 text-black pl-2 border border-blue-800 rounded-md"
        value={formValues.landmark || ''} // Link to react-hook-form value
        onChangeText={(text) => setValue('landmark', text)} // Update form state
      />
      {errors.landmark && (
        <Text style={{ color: 'red' }}>{errors.landmark.message}</Text>
      )}

      {/* Register Button */}
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        className="bg-blue-700 py-2 px-1 border border-black rounded-lg flex-1 flex-row justify-center items-center"
      >
        <Text className="text-white self-center font-semibold text-lg">Next</Text>
        <ChevronRightIcon color={'white'} size={16} strokeWidth={4} />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BasicInformation;
