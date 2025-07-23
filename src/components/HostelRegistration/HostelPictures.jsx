import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { registerHostelApiCaller, updateHostelDetailsApiCaller, uploadHostelImages } from '../../services/apiCaller';
import { ArrowUpTrayIcon, ChevronLeftIcon } from 'react-native-heroicons/outline';
import { setStep } from '../../slices/stepSlice';
import { setPictures } from '../../slices/hostelFormSlice';
import { CheckCircleIcon, XCircleIcon } from 'react-native-heroicons/solid';
import { getData } from '../../utils/getAndSetData';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('screen');

const HostelPictures = () => {
  const [exteriorImage, setExteriorImage] = useState(null);
  const [roomImage, setRoomImage] = useState(null);
  const [bedImage, setBedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [roomImageUrl, setRoomImageUrl] = useState(null);
  const [exteriorImageUrl, setExteriorImageUrl] = useState(null);
  const [bedImageUrl, setBedImageUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [imageName, setImageName] = useState('');

  const dispatch = useDispatch();
  const { step } = useSelector(state => state.step);
  const { pictures } = useSelector(state => state.hostelForm);
  const {update} = useSelector((state)=>state.hostelForm);
  const {basicInfo,hostelInfo,locationInSlice,id} = useSelector((state)=>state.hostelForm);
  const navigation = useNavigation();

  console.log("Pictures from slice" ,pictures);


  const handleImageSelection = (setImageCallback, imageType, fromCamera = false) => {
    const options = {
      mediaType: 'photo',
      saveToPhotos: fromCamera,
    };

    const callback = (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Error with image picker:', response.errorMessage);
      } else {
        const uri = response.assets[0]?.uri;
        const file = response.assets[0];
        setImageCallback({ uri, file });
        setImageName(imageType);  // Set the image type for the upload button visibility
      }
    };

    if (fromCamera) {
      launchCamera(options, callback);
    } else {
      launchImageLibrary(options, callback);
    }
  };

  const uploadImages = async (image, imageType) => {
    const formData = new FormData();
    formData.append('image', {
      uri: image.file.uri,
      type: image.file.type,
      name: image.file.fileName,
    });

    const data = await uploadHostelImages(formData, setLoading);
    console.log(data);
    if (data.success) {
      if (imageType === 'exteriorImage') {
        setExteriorImageUrl(data.image);
      } else if (imageType === 'roomImage') {
        setRoomImageUrl(data.image);
      } else if (imageType === 'bedImage') {
        setBedImageUrl(data.image);
      }

      Toast.show({
        type: 'success',
        text1: 'Image uploaded successfully',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Image upload failed',
      });
    }
  };

  console.log("Pictures in Regitser" ,pictures)
  useEffect(() => {
    if (Object.keys(pictures).length !== 0) {
      setRoomImageUrl(pictures.roomImage);
      setBedImageUrl(pictures.bedImage);
      setExteriorImageUrl(pictures.exteriorImage);
    }
  }, [pictures]);

  useEffect(()=>{
    if(update === false){
      dispatch(setPictures({}));
      setRoomImageUrl(null);
      setBedImageUrl(null);
      setExteriorImageUrl(null);

    }
  },[])
   

  console.log(" urls : " ,roomImageUrl , bedImageUrl,exteriorImageUrl);

  useEffect(()=>{

    if (roomImageUrl || bedImageUrl || exteriorImageUrl) {
      dispatch(setPictures({
        ...(roomImageUrl && { roomImage: roomImageUrl }),
        ...(bedImageUrl && { bedImage: bedImageUrl }),
        ...(exteriorImageUrl && { exteriorImage: exteriorImageUrl })
      }));
    }
  },[roomImageUrl,bedImageUrl,exteriorImageUrl])

  const registerHostel = async () => {
    const formData = {
      hostelName: basicInfo.hostelName || '',
      ownersFullName: basicInfo.ownersFullName || '',
      contactNumber: basicInfo.contactNumber || '',
      alternateContactNumber: basicInfo.alternateContactNumber || '',
      hostelAddress: basicInfo.hostelAddress || '',
      landmark: basicInfo.landmark || '',
      price:hostelInfo.price,
      roomType: hostelInfo.roomType,
      wifi: hostelInfo.wifi || false,
      hotWater: hostelInfo.hotWater || false,
      drinkingWater: hostelInfo.drinkingWater || true,
      hostelType: hostelInfo.hostelType || '',
      instructions: hostelInfo.instructions || '',
      exteriorImage: pictures.exteriorImage || '',
      roomImage: pictures.roomImage || '',
      bedImage: pictures.bedImage || '',
      latitude: locationInSlice.latitude,
      longitude: locationInSlice.longitude,
    };

    const token = await getData('token');
    const data = await registerHostelApiCaller(formData, token);

    if (data.success) {
      setRoomImageUrl(null);
      setBedImageUrl(null);
      setExteriorImageUrl(null);
      Toast.show({
        type: 'success',
        text1: 'Hostel registered successfully!',
      });

      navigation.navigate('UpdateHostelDetails');

    } else {
      Toast.show({
        type: 'error',
        text1: 'Error in registering hostel',
      });
    }
  };

  const updateHostelDetails = async()=>{
    
    console.log(" Fetchecd Id of hostel" ,id)

    const formData = {
      hostelName: basicInfo.hostelName || '',
      ownersFullName: basicInfo.ownersFullName || '',
      contactNumber: basicInfo.contactNumber || '',
      alternateContactNumber: basicInfo.alternateContactNumber || '',
      hostelAddress: basicInfo.hostelAddress || '',
      landmark: basicInfo.landmark || '',
      roomType: hostelInfo.roomType,
      price:hostelInfo.price,
      wifi: hostelInfo.wifi || false,
      hotWater: hostelInfo.hotWater || false,
      drinkingWater: hostelInfo.drinkingWater || true,
      hostelType: hostelInfo.hostelType || '',
      instructions: hostelInfo.instructions || '',
      exteriorImage: pictures.exteriorImage || '',
      roomImage: pictures.roomImage || '',
      bedImage: pictures.bedImage || '',
      latitude: locationInSlice.latitude,
      longitude: locationInSlice.longitude,
      id:id,
    };


    console.log("Data  of Update Form " , formData);

   const data = await updateHostelDetailsApiCaller(formData);
    console.log("Data in caller",data.success)
   console.log(data);
   if (data.success) {
       setRoomImageUrl(null);
       setBedImageUrl(null);
       setExteriorImageUrl(null);
    Toast.show({
      type: 'success',
      text1: 'Hostel details updated successfully!',
    });

    navigation.navigate('UpdateHostelDetails');

  } else {
    Toast.show({
      type: 'error',
      text1: 'Error in  updating  hostel details ',
    });
  }

  }

  return (
    <ScrollView>
      {/* Exterior Image Section */}
      <View className='border-b border-gray-500 pb-10 mx-2'>
        <Text className='text-black font-semibold text-center py-2'>Exterior Image</Text>
        <View className='flex-row justify-between items-center'>
          <TouchableOpacity
            className='py-2 px-1 bg-blue-100 self-start border border-gray-500 rounded-lg mx-1'
            onPress={() => handleImageSelection(setExteriorImage, 'exteriorImage')}
          >
            <Text className='text-black'>Select from Gallery</Text>
          </TouchableOpacity>
          { exteriorImageUrl && (
            <Text
              className='text-blue-900 underline'
              onPress={() => {
                setCurrentImageUrl(exteriorImageUrl);
                setModalVisible(true);
              }}
            >
              View
            </Text>
          )}
          <TouchableOpacity
            className='py-2 px-1 bg-blue-100 self-start border border-gray-500 rounded-lg mx-1'
            onPress={() => handleImageSelection(setExteriorImage, 'exteriorImage', true)}
          >
            <Text className='text-black'>Click a Picture</Text>
          </TouchableOpacity>
        </View>
        {exteriorImage && imageName === 'exteriorImage' && (
          <TouchableOpacity
            className='py-2 rounded-md bg-purple-600 flex-row items-center justify-center self-center my-2 px-2'
            onPress={() => uploadImages(exteriorImage, 'exteriorImage')}
          >
            <ArrowUpTrayIcon color={'white'} size={24} strokeWidth={2} />
            <Text className='text-white font-semibold px-2'>Upload</Text>
            {loading && <ActivityIndicator color="white" />}
          </TouchableOpacity>
        )}
      </View>

      {/* Room Image Section */}
      <View className='border-b border-gray-500 pb-10 mx-2'>
        <Text className='text-black font-semibold text-center py-2'>Room Image</Text>
        <View className='flex-row justify-between items-center'>
          <TouchableOpacity
            className='py-2 px-1 bg-blue-100 self-start border border-gray-500 rounded-lg mx-1'
            onPress={() => handleImageSelection(setRoomImage, 'roomImage')}
          >
            <Text className='text-black'>Select from Gallery</Text>
          </TouchableOpacity>
          {roomImageUrl && (
            <Text
              className='text-blue-900 underline'
              onPress={() => {
                setCurrentImageUrl(roomImageUrl);
                setModalVisible(true);
              }}
            >
              View
            </Text>
          )}
          <TouchableOpacity
            className='py-2 px-1 bg-blue-100 self-start border border-gray-500 rounded-lg mx-1'
            onPress={() => handleImageSelection(setRoomImage, 'roomImage', true)}
          >
            <Text className='text-black'>Click a Picture</Text>
          </TouchableOpacity>
        </View>
        {roomImage && imageName === 'roomImage' && (
          <TouchableOpacity
            className='py-2 rounded-md bg-purple-600 flex-row items-center justify-center self-center my-2 px-2'
            onPress={() => uploadImages(roomImage, 'roomImage')}
          >
            <ArrowUpTrayIcon color={'white'} size={24} strokeWidth={2} />
            <Text className='text-white font-semibold px-2'>Upload</Text>
            {loading && <ActivityIndicator color="white" />}
          </TouchableOpacity>
        )}
      </View>

      {/* Bed Image Section */}
      <View className='pb-10 mx-2'>
        <Text className='text-black font-semibold text-center py-2'>Bed Image</Text>
        <View className='flex-row justify-between items-center'>
          <TouchableOpacity
            className='py-2 px-1 bg-blue-100 self-start border border-gray-500 rounded-lg mx-1'
            onPress={() => handleImageSelection(setBedImage, 'bedImage')}
          >
            <Text className='text-black'>Select from Gallery</Text>
          </TouchableOpacity>
          {bedImageUrl && (
            <Text
              className='text-blue-900 underline'
              onPress={() => {
                setCurrentImageUrl(bedImageUrl);
                setModalVisible(true);
              }}
            >
              View
            </Text>
          )}
          <TouchableOpacity
            className='py-2 px-1 bg-blue-100 self-start border border-gray-500 rounded-lg mx-1'
            onPress={() => handleImageSelection(setBedImage, 'bedImage', true)}
          >
            <Text className='text-black'>Click a Picture</Text>
          </TouchableOpacity>
        </View>
        {bedImage && imageName === 'bedImage' && (
          <TouchableOpacity
            className='py-2 rounded-md bg-purple-600 flex-row items-center justify-center self-center my-2 px-2'
            onPress={() => uploadImages(bedImage, 'bedImage')}
          >
            <ArrowUpTrayIcon color={'white'} size={24} strokeWidth={2} />
            <Text className='text-white font-semibold px-2'>Upload</Text>
            {loading && <ActivityIndicator color="white" />}
          </TouchableOpacity>
        )}

        <View>

          <TouchableOpacity
           className=' bg-blue-500 py-2 px-3 rounded-md self-start  mt-8'
           onPress={()=>dispatch(setStep(3))}
          >
            <Text
             
            >Back</Text>
          </TouchableOpacity>
          {
           update &&  Object.keys(pictures).length === 3 && (
              <TouchableOpacity
              className=' py-2  px-1 rounded-md  bg-blue-600 flex items-center justify-center mt-28  '
               onPress={()=> updateHostelDetails()}
              >
                <Text
                 className=' text-white font-semibold  '
                > Update Details </Text>
              </TouchableOpacity>



            )
          }


         {
           !update &&  Object.keys(pictures).length === 3 && (
              <TouchableOpacity
              className=' py-2  px-1 rounded-md  bg-blue-600 flex items-center justify-center mt-28  '
               onPress={()=> registerHostel()}
              >
                <Text
                 className=' text-white font-semibold  '
                > Register</Text>
              </TouchableOpacity>



            )
          }

        </View>
      </View>

      {/* Modal for image preview */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <Image source={{ uri: currentImageUrl }} style={styles.modalImage} />
        </Pressable>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalImage: {
    width: width * 0.9,
    height: height * 0.6,
    resizeMode: 'contain',
  },
});

export default HostelPictures;
