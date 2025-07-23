import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useForm } from 'react-hook-form';
import CheckBox from '@react-native-community/checkbox';
import RadioGroup from 'react-native-radio-buttons-group';
import { ChevronLeftIcon, ChevronRightIcon } from 'react-native-heroicons/outline';
import { setStep } from '../../slices/stepSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setHostelInfo } from '../../slices/hostelFormSlice';

const HostelInformation = () => {
  const { handleSubmit } = useForm();
  const [roomType, setRoomType] = useState([]);
  const [wifi, setWifi] = useState(null);
  const [hotWater, setHotWater] = useState(null);
  const [drinkingWater, setDrinkingWater] = useState(null);
  const [hostelType, setHostelType] = useState();
  const [instructions, setInstructions] = useState();
  const [price, setPrice] = useState({
    from: 0,
    to: 0,
  });

  console.log(price);

  // Room types options
  const roomOptions = [
    { label: 'Single Bed', value: 'SingleBed' },
    { label: 'Double Beds', value: 'DoubleBeds' },
    { label: '3 Beds', value: 'ThreeBeds' },
    { label: '4 Beds', value: 'FourBeds' },
    { label: '>4 Beds', value: 'MoreThanFourBeds' },
  ];

  // Wifi Radio buttons
  const wifiOptions = [
    { id: '1', label: 'Yes', value: true },
    { id: '2', label: 'No', value: false },
  ];

  // Hot water Radio buttons
  const hotWaterOptions = [
    { id: '1', label: 'Yes', value: true },
    { id: '2', label: 'No', value: false },
  ];

  // Drinking water Radio buttons
  const drinkingWaterOptions = [
    { id: '1', label: 'Yes', value: true },
    { id: '2', label: 'No', value: false },
  ];

  // Handle check/uncheck of the checkbox
  const handleCheckboxChange = (value) => {
    if (roomType.includes(value)) {
      setRoomType(roomType.filter((type) => type !== value));
    } else {
      setRoomType([...roomType, value]);
    }
  };

  const dispatch = useDispatch();

  const onSubmit = (data) => {
    console.log('Data of Hostel Information', {
      roomType,
      wifi,
      hotWater,
      drinkingWater,
      hostelType,
      instructions,
      price,  // Include price in the submission
    });
    dispatch(setStep(3));
    dispatch(setHostelInfo({
      roomType,
      wifi,
      hotWater,
      drinkingWater,
      hostelType,
      instructions,
      price,  // Include price in the Redux state
    }));
  };

  const HostelType = useMemo(() => [
    { id: '1', label: 'Boys', value: 'Boys' },
    { id: '2', label: 'Girls', value: 'Girls' },
    { id: '3', label: 'Both', value: 'Both' }
  ], []);

  const [selectedId, setSelectedId] = useState(null);

  // Function to handle selection of the hostel type
  const onPressHandler = (newSelectedId) => {
    const selectedItem = HostelType.find(item => item.id === newSelectedId);
    if (selectedItem) {
      setHostelType(selectedItem.value);
      setSelectedId(newSelectedId);
    }
  };

  const { hostelInfo } = useSelector((state) => state.hostelForm);

  useEffect(() => {
     console.log("HI " ,hostelInfo);
    if (Object.keys(hostelInfo).length !== 0) {
      setRoomType(hostelInfo.roomType || []);
      setWifi(hostelInfo.wifi);
      setHotWater(hostelInfo.hotWater);
      setDrinkingWater(hostelInfo.drinkingWater);
      setHostelType(hostelInfo.hostelType);
      setInstructions(hostelInfo.instructions || '');
      setPrice(hostelInfo.price || { from: 0, to: 0 });
      const selectedHostelType = HostelType.find(item => item.value === hostelInfo.hostelType);
      if (selectedHostelType) {
        setSelectedId(selectedHostelType.id);
      }
      
    }
  }, [hostelInfo]);

  return (
    <ScrollView
      className="mx-2 bg-white flex-col gap-y-2 my-4 py-2 px-3"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      <View>
        <Text className="text-center text-xl font-semibold my-2 text-black">
          Hostel Details
        </Text>
      </View>

      {/* Hostel Type Dropdown */}
      <Text className="text-black py-1 font-semibold">Hostel Type <Text className=' text-red-900'>* </Text> </Text>
      <RadioGroup 
        containerStyle={{ flexDirection: 'row' }}
        labelStyle={{ color: 'black' }}
        radioButtons={HostelType} 
        onPress={(newSelectedId) => onPressHandler(newSelectedId)} 
        selectedId={selectedId} 
      />

      {/* Room Type Checkboxes */}
      <View>
        <Text className="text-black py-1 font-semibold">Room Types <Text className=' text-red-900'>* </Text> </Text>
        <View className="flex-row flex-wrap gap-x-2">
          {roomOptions.map((room, index) => (
            <View key={index} className="flex flex-row items-center">
              <CheckBox
                value={roomType.includes(room.value)}
                onValueChange={() => handleCheckboxChange(room.value)}
                tintColors={{ true: '#4970bf', false: '#4970bf' }}
              />
              <Text className="text-black">{room.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Wifi Availability */}
      <View>
        <Text className="text-black font-semibold">Is Wi-Fi available? <Text className=' text-red-900'>* </Text> </Text>
        <RadioGroup 
          labelStyle={{ color: 'black' }}
          containerStyle={{ flexDirection: 'row' }}
          radioButtons={wifiOptions} 
          onPress={(selectedId) => {
            const selectedOption = wifiOptions.find((opt) => opt.id === selectedId);
            setWifi(selectedOption ? selectedOption.value : null);
          }}
          selectedId={wifiOptions.find(option => option.value === wifi)?.id}
        />
      </View>

      {/* Hot Water Availability */}
      <View>
        <Text className="text-black font-semibold">Is hot water available for bathing? <Text className=' text-red-900'>* </Text> </Text>
        <RadioGroup 
          labelStyle={{ color: 'black' }}
          containerStyle={{ flexDirection: 'row' }}
          radioButtons={hotWaterOptions} 
          onPress={(selectedId) => {
            const selectedOption = hotWaterOptions.find((opt) => opt.id === selectedId);
            setHotWater(selectedOption ? selectedOption.value : null);
          }}
          selectedId={hotWaterOptions.find(option => option.value === hotWater)?.id}
        />
      </View>

      {/* Purified Drinking Water */}
      <View>
        <Text className="text-black font-semibold">Is purified drinking water available? <Text className=' text-red-900'>* </Text> </Text>
        <RadioGroup 
          containerStyle={{ flexDirection: 'row' }}
          labelStyle={{ color: 'black' }}
          radioButtons={drinkingWaterOptions} 
          onPress={(selectedId) => {
            const selectedOption = drinkingWaterOptions.find((opt) => opt.id === selectedId);
            setDrinkingWater(selectedOption ? selectedOption.value : null);
          }}
          selectedId={drinkingWaterOptions.find(option => option.value === drinkingWater)?.id}
        />
      </View>

      {/* Price Range */}
      <View>
        <Text className='text-black font-semibold'>Price Range of Hostel (in Rs )</Text>
        <View className='flex-row items-center justify-between px-2 my-2'>
          <TextInput
            placeholder='Price from'
            placeholderTextColor={'gray'}
            className='border w-[50%]  px-4 rounded-full text-black border-blue-500 bg-blue-50'
            keyboardType={'number-pad'}
            value={price.from.toString()}
            onChangeText={(value) => setPrice((prevPrice) => ({ ...prevPrice, from: parseInt(value, 10) || 0 }))}
          />
          <Text>to</Text>
          <TextInput
            placeholder='Price to'
            placeholderTextColor={'gray'}
            className='border px-4  w-[50%] rounded-full text-black border-blue-500 bg-blue-50'
            keyboardType={'number-pad'}
            value={price.to.toString()}
            onChangeText={(value) => setPrice((prevPrice) => ({ ...prevPrice, to: parseInt(value, 10) || 0 }))}
          />
        </View>
      </View>

      {/* Instructions */}
      <View>
        <Text className='text-black font-semibold'>Additional Instructions for Room</Text>
        <TextInput
          placeholder='E.g. No smoking inside, Pets not allowed'
          placeholderTextColor={'gray'}
          className='bg-blue-50 text-black  px-2 py-1 w-full border border-blue-500 rounded-md'
          multiline={true}
          numberOfLines={5}
          textAlignVertical='top'
          value={instructions}
          onChangeText={setInstructions}
        />
      </View>

      {/* Navigation Buttons */}
      <View className="w-full flex-row items-center justify-between gap-x-4">
        <TouchableOpacity
          className="flex-row  items-center justify-center border border-blue-600 rounded-full px-4 py-2"
          onPress={() => dispatch(setStep(1))}
        >
          <ChevronLeftIcon color={'#4970bf'} size={22} />
          <Text className="text-base font-semibold text-[#4970bf]">Back</Text>
        </TouchableOpacity>
  {
     wifi !== null && hotWater !== null && hostelType !== null && drinkingWater !== null &&  (
      <TouchableOpacity
      className="flex-row items-center justify-center border border-blue-600 bg-blue-600 rounded-full px-4 py-2"
      onPress={handleSubmit(onSubmit)}
    >
      <Text className="text-base font-semibold text-white">Next</Text>
      <ChevronRightIcon color={'white'} size={22} />
    </TouchableOpacity>
     )
  }
        
      </View>
    </ScrollView>
  );
};

export default HostelInformation;
