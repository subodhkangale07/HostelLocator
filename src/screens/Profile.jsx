import React, { useCallback, useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View, TextInput, Alert, Modal, ActivityIndicator } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { getData } from '../utils/getAndSetData';
import { getProfileData, updateProfileApiCaller } from '../services/apiCaller';
import DateTimePicker from '@react-native-community/datetimepicker'; // Date picker
import { Picker } from '@react-native-picker/picker'; // Dropdown for gender selection
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [image, setImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newContactNumber, setNewContactNumber] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [newDateOfBirth, setNewDateOfBirth] = useState(''); // New state for date of birth
  const [isModalVisible, setIsModalVisible] = useState(false); // For text input modal
  const [showUpload, setShowUpload] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // Fetch user data on component mount
  const fetchUser = async () => {
    const res = await getData('user');
    // console.log("Result -- >", res);
    setUser(res);

  };


useFocusEffect(
  useCallback(() => {
    fetchUser(); 
  }, [])
);
  // Fetch profile data based on user
  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        const res = await getProfileData(user._id);
        setProfileData(res);
        setImage(res.image);
        setNewDateOfBirth(res.additionalDetails?.dateOfBirth || ''); // Set date of birth
        setNewContactNumber(res.additionalDetails?.contactNumber || ''); // Set contact number
        setSelectedGender(res.additionalDetails?.gender || ''); // Set gender
      }
    };
    fetchProfileData();
  }, [user]);

  // Handle image upload
  const handleImageUpload = async () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response?.assets) {
        setImageFile(response?.assets[0]);
        setShowUpload(true);
        const selectedImage = response.assets[0].uri;
        setImage(selectedImage);
      }
    });
  };

  // Handle date picker change
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setNewDateOfBirth(selectedDate.toISOString().split('T')[0]);
    }
  };

  const handleContactNumberUpdate = () => {
    setIsModalVisible(false);
  };

  const apiCall = async () => {
    const formData = new FormData();
    
    if (imageFile) {
      formData.append('image', {
        uri: imageFile.uri,
        type: imageFile.type,
        name: imageFile.fileName,
      });
    }

    // Only append fields if they have new values
    if (newDateOfBirth) {
      formData.append('dateOfBirth', newDateOfBirth);
    }
    if (newContactNumber) {
      formData.append('contactNumber', newContactNumber);
    }
    if (selectedGender) {
      formData.append('gender', selectedGender);
    }

    formData.append('id', user._id);

    const res = await updateProfileApiCaller(formData);
    console.log('Response ', res);

    if (res?.success ) {
      if(showUpload){
        Toast.show({
          type: 'success',
          text1: 'Image updated successfully',
        });
        setShowUpload(false);
        setImageFile(null);
      }
      else
      Toast.show({
        type: 'success',
        text1: 'Profile updated successfully',
      });
      
    }
  };

  if(!user || !profileData){
    return(
      <View
       className=' h-screen w-screen flex-col items-center justify-center'
      >
        <ActivityIndicator
         color={'blue'}
         size={24}
        ></ActivityIndicator>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <View className="items-center mb-6">
        <View className="relative">
          {image ? (
            <Image
              source={{ uri: image }}
              className="w-32 h-32 rounded-full border-2 border-gray-300"
            />
          ) : (
            <Text className="text-base text-gray-600">No profile image available</Text>
          )}

          <TouchableOpacity
            className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full"
            onPress={handleImageUpload}
          >
            <Text className="text-white">Edit</Text>
          </TouchableOpacity>
        </View>

        {showUpload && (
          <TouchableOpacity
            onPress={apiCall}
            className="py-1 px-2 rounded-md bg-blue-400 mt-6"
          >
            <Text className="text-white">Upload</Text>
          </TouchableOpacity>
        )}

        <Text className="text-xl font-semibold mt-4 text-gray-800">
          {profileData.firstName} {profileData.lastName}
        </Text>
        <Text className="text-gray-500">{profileData.email}</Text>
      </View>

      <View className="bg-white p-4 rounded-lg shadow">
        <Text className="text-lg font-semibold text-gray-700">Profile Details</Text>

        <View className="mt-4">
          <Text className="text-sm text-gray-600">Account Type:</Text>
          <Text className="text-base font-medium text-gray-900">{profileData.accountType}</Text>
        </View>

        {/* Date of Birth */}
        <View className="mt-4">
          <Text className="text-sm text-gray-600">Date of Birth:</Text>
          <Text className="text-base font-medium text-gray-900">
            {newDateOfBirth || 'Not provided'}
          </Text>
          <TouchableOpacity
            className="bg-blue-500 p-2 mt-2 rounded self-end"
            onPress={() => setShowDatePicker(true)}
          >
            <Text className="text-white text-sm">Update Date of Birth</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            mode="date"
            value={new Date()}
            onChange={handleDateChange}
            display="default"
          />
        )}

        {/* Contact Number */}
        <View className="mt-4">
          <Text className="text-sm text-gray-600">Contact Number:</Text>
          <Text className="text-base font-medium text-gray-900">
            {newContactNumber || 'Not provided'}
          </Text>
          <TouchableOpacity
            className="bg-blue-500 p-2 mt-2 rounded self-end"
            onPress={() => setIsModalVisible(true)}
          >
            <Text className="text-white text-sm">Update Contact Number</Text>
          </TouchableOpacity>
        </View>

        <Modal transparent={true} visible={isModalVisible} animationType="slide">
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="bg-white p-6 rounded-lg w-3/4">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Enter New Contact Number</Text>
              <TextInput
                className="border border-gray-300 p-2 rounded-lg w-full text-black"
                keyboardType="phone-pad"
                value={newContactNumber}
                onChangeText={setNewContactNumber}
              />
              <View className="mt-4 flex-row justify-between">
                <TouchableOpacity
                  className="bg-gray-300 p-2 rounded"
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text className="text-black">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-blue-500 p-2 rounded"
                  onPress={handleContactNumberUpdate}
                >
                  <Text className="text-white">Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Gender */}
        <View className="mt-4">
          <Text className="text-sm text-gray-600">Gender:</Text>
          <Picker
            selectedValue={selectedGender}
            onValueChange={(itemValue) => setSelectedGender(itemValue)}
            style={{ height: 50, width: '100%' }}
          >
            <Picker.Item label="Male" value="Male" color="black" />
            <Picker.Item label="Female" value="Female" color="black" />
            <Picker.Item label="Other" value="Other" color="black" />
          </Picker>
        </View>

        <TouchableOpacity
          className="bg-blue-500 p-3 mt-4 rounded"
          onPress={apiCall}
        >
          <Text className="text-white text-center">Update Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;
