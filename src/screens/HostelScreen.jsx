import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Linking, PermissionsAndroid, Text, TouchableOpacity, View, Image } from 'react-native';
import ImageSlider from '../components/ImageSlider';
import { ArrowLeftIcon, GlobeAltIcon, MapPinIcon } from 'react-native-heroicons/solid';
import { PhoneIcon } from 'react-native-heroicons/solid';
import Geolocation from '@react-native-community/geolocation';
import { SvgUri } from 'react-native-svg';
import { ScrollView } from 'react-native-gesture-handler';

const { height, width } = Dimensions.get('screen');

const HostelScreen = () => {
    const [location, setLocation] = useState(null);  // State for location
    const [loading, setLoading] = useState(false);   // State for loading
    const navigation = useNavigation();
    const [images, setImages] = useState([]);
    const route = useRoute();
    const hostel = route.params;

    useEffect(() => {
        const newImages = [];
        if (hostel?.bedImage) newImages.push(hostel.bedImage);
        if (hostel?.exteriorImage) newImages.push(hostel.exteriorImage);
        if (hostel?.roomImage) newImages.push(hostel.roomImage);

        setImages(newImages);
    }, []);

    // Log location when it updates
    useEffect(() => {
        console.log("Updated location: ", location);
    }, [location]);

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
                getCurrentLocation();
            } else {
                console.log('Location permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const getCurrentLocation = () => {
        Geolocation.requestAuthorization();
        Geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                console.log("Setting the location in useState: ", latitude, longitude);
                setLocation({ latitude, longitude });
                setLoading(false);  // Stop loader once location is fetched
            },
            (error) => {
                setLoading(false);  // Stop loader even if there's an error
                if (error.code === 1) {
                    Alert.alert(
                        'Permission Denied',
                        'You have denied location permissions. Please enable them in the settings.',
                        [{ text: 'Cancel' }, { text: 'Open Settings', onPress: () => Linking.openSettings() }]
                    );
                } else if (error.code === 2) {
                    Alert.alert(
                        'Location Unavailable',
                        'Location services are turned off. Please enable them in the settings.',
                        [{ text: 'Cancel' }, { text: 'Open Settings', onPress: () => Linking.openSettings() }]
                    );
                } else {
                    Alert.alert('Error', `Unable to get location: ${error.message}`);
                }
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 10000 }
        );
    };
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleGetDirections = async () => {
        setLoading(true);  // Start loader when fetching location
        await requestLocationPermission();
        console.log("Location after calling: ", location);
        // if(location === null)
        // await delay(7000);  // Wait for 7 seconds
     
        if (location && location.latitude && location.longitude ) {
            const url = `https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${hostel.latitude},${hostel.longitude}`;
            Linking.openURL(url).catch((err) => console.error('An error occurred', err));
        } else {
            Alert.alert(
                'Error',
                'Location data is not available. Please try again after few seconds '
            );
        }
        setLoading(false);  // Stop loader after attempting to get directions
    };
 console.log(hostel.hostelOwner.image);
    return (
        <View>
            {/* Image Slider */}
            <View>
                <ImageSlider images={images} />
                <TouchableOpacity onPress={() => navigation.goBack()} className="bg-white self-start p-1 m-3 rounded-md">
                    <ArrowLeftIcon color="black" />
                </TouchableOpacity>
            </View>

            {/* Hostel Info */}
            <ScrollView className="rounded-lg bg-white  px-2 "
             contentContainerStyle={{paddingBottom:50}}
             style={{marginTop:width*0.8}}
            >
                <Text className="font-semibold text-black text-center text-2xl">{hostel.hostelName}</Text>

                {/* Owner Details */}
                <View className="my-2 flex-row items-center">
                    {
                        hostel.hostelOwner.image.includes('svg') && (
                            <SvgUri
                     width={50}
                     height={50}
                     uri={hostel.hostelOwner.image}
                    />


                        )
                    }

                   {
                        !hostel.hostelOwner.image.includes('svg') && (
                            <Image
                            source={{ uri: hostel.hostelOwner.image }}
                            height={50}
                            width={50}
                            className="w-10 h-10 rounded-full"
                        />

                    

                        )
                    }
                    
                 
                    <Text className="ml-2 font-bold text-black">
                        Owner: {hostel.ownersFullName}
                    </Text>
                </View>

                <View className=' flex-row  items-center '>
                    <Text
                     className=' text-black  font-semibold px-4 text-lg'
                    > Price Range - </Text>
                     
                     {
                        hostel?.price?.from ===0 &&(
                            <View>
                                <Text className=' text-black ' >NA</Text>
                            </View>
                        )
                     }

                      {
                        hostel?.price?.from !==0 &&(
                            <View
                             className=' flex-row '
                            >
                                <Text
                     className=' text-black '
                    >

                        {hostel?.price.from} ₹
                    </Text>

                    <Text className=' text-black'> - </Text>
                    <Text
                     className=' text-black '
                    >
                        {hostel?.price.to} ₹
                    </Text>
                            </View>
                        )
                     }

                    

                </View>

                {/* Room Types and Availability */}
                <View className="p-4">
      <Text className="text-lg font-semibold text-black mb-2">Bed Types and Availability:</Text>
      
      <View className="border border-gray-300 rounded-lg">
        {/* Table Header */}
        <View className="flex flex-row bg-gray-200 border-b border-gray-300">
          <Text className="flex-1 text-black font-semibold p-2">Bed Type</Text>
          <Text className="flex-1 text-black font-semibold p-2 text-center">Available</Text>
          <Text className="flex-1 text-black font-semibold p-2 text-center">Total</Text>
        </View>

        {/* Table Row: Single Bed */}
        <View className="flex flex-row border-b border-gray-300">
          <Text className="flex-1 text-black p-2">Single Bed</Text>
          <Text className="flex-1 text-black p-2 text-center">{hostel.SingleBed.available}</Text>
          <Text className="flex-1 text-black p-2 text-center">{hostel.SingleBed.total}</Text>
        </View>

        {/* Table Row: Double Beds */}
        <View className="flex flex-row border-b border-gray-300">
          <Text className="flex-1 text-black p-2">Double Beds</Text>
          <Text className="flex-1 text-black p-2 text-center">{hostel.DoubleBeds.available}</Text>
          <Text className="flex-1 text-black p-2 text-center">{hostel.DoubleBeds.total}</Text>
        </View>

        {/* Table Row: Three Beds */}
        <View className="flex flex-row border-b border-gray-300">
          <Text className="flex-1 text-black p-2">Three Beds</Text>
          <Text className="flex-1 text-black p-2 text-center">{hostel.ThreeBeds.available}</Text>
          <Text className="flex-1 text-black p-2 text-center">{hostel.ThreeBeds.total}</Text>
        </View>

        {/* Table Row: Four Beds */}
        <View className="flex flex-row border-b border-gray-300">
          <Text className="flex-1 text-black p-2">Four Beds</Text>
          <Text className="flex-1 text-black p-2 text-center">{hostel.FourBeds.available}</Text>
          <Text className="flex-1 text-black p-2 text-center">{hostel.FourBeds.total}</Text>
        </View>

        {/* Table Row: More Than Four Beds */}
        <View className="flex flex-row">
          <Text className="flex-1 text-black p-2">More Than Four Beds</Text>
          <Text className="flex-1 text-black p-2 text-center">{hostel.MoreThanFourBeds.available}</Text>
          <Text className="flex-1 text-black p-2 text-center">{hostel.MoreThanFourBeds.total}</Text>
        </View>
      </View>
    </View>

                {/* Features */}
                <View className="p-4">
      <Text className="text-lg font-semibold text-black mb-2">Features:</Text>
      
      <View className="border border-gray-300 rounded-lg">
        {/* Table Header */}
        <View className="flex flex-row bg-gray-200 border-b border-gray-300">
          <Text className="flex-1 text-black font-semibold p-2">Feature</Text>
          <Text className="flex-1 text-black font-semibold p-2 text-center">Availability</Text>
        </View>

        {/* Table Row: Wi-Fi */}
        <View className="flex flex-row border-b border-gray-300">
          <Text className="flex-1 text-black p-2">Wi-Fi</Text>
          <Text className="flex-1 text-black p-2 text-center">{hostel.wifi ? 'Available' : 'Not Available'}</Text>
        </View>

        {/* Table Row: Hot Water */}
        <View className="flex flex-row border-b border-gray-300">
          <Text className="flex-1 text-black p-2">Hot Water</Text>
          <Text className="flex-1 text-black p-2 text-center">{hostel.hotWater ? 'Available' : 'Not Available'}</Text>
        </View>

        {/* Table Row: Drinking Water */}
        <View className="flex flex-row">
          <Text className="flex-1 text-black p-2">Drinking Water</Text>
          <Text className="flex-1 text-black p-2 text-center">{hostel.drinkingWater ? 'Available' : 'Not Available'}</Text>
        </View>
      </View>
    </View>

                {/* Instructions */}
                <View className="p-4">
      <Text className="text-lg font-semibold text-black mb-2">Instructions:</Text>
      
      {/* Instructions Card */}
      <View className="bg-gray-100 border border-gray-300 rounded-lg p-4 shadow-sm">
        <Text className="text-gray-700">{hostel.instructions}</Text>
      </View>
    </View>

                {/* Call Button */}
                <View>

                </View>
               

                {/* Map and Directions */}
                <View className="flex-row justify-between my-2">
                    <TouchableOpacity
                        onPress={() => navigation.navigate('MapScreen', { latitude: hostel.latitude, longitude: hostel.longitude, name: hostel.hostelName })}
                        className="text-black flex-row items-center self-start bg-blue-400 rounded-md py-2 px-1 mx-2"
                    >
                        <MapPinIcon color="black" />
                        <Text className="text-black">See in Maps</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={() => {
                        if (hostel?.contactNumber) {
                            const phoneNumber = `tel:${hostel.contactNumber}`;
                            Linking.openURL(phoneNumber).catch((err) => console.error('Error:', err));
                        }
                    }}
                    className="flex-row py-1 px-2 rounded-lg mx-2 bg-blue-400 self-start items-center"
                >
                    <View className="rounded-full p-1 mr-2">
                        <PhoneIcon color="black" />
                    </View>
                    <Text className="text-black">Call</Text>
                </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleGetDirections}
                        disabled={loading}  // Disable button while loading
                        className={`text-black flex-row items-center self-start bg-blue-400 rounded-md py-2 px-1 mx-2 ${loading ? 'opacity-50' : ''}`}
                    >
                        {loading ? <ActivityIndicator color="black" /> : <GlobeAltIcon color="black" />}
                        <Text className="text-black ml-2">Get Directions</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default HostelScreen;
