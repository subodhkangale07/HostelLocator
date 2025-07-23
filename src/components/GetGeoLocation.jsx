import React, { useState } from 'react';
import { Linking, PermissionsAndroid, Text, TouchableOpacity, View, Alert } from 'react-native';
import { MapPinIcon } from 'react-native-heroicons/outline';
import Geolocation from '@react-native-community/geolocation';

const GetGeoLocation = () => {
  const [location, setLocation] = useState(null);

  // Request location permission for Android
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

  const openGoogleMaps = (startLatitude, startLongitude, endLatitude, endLongitude) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${startLatitude},${startLongitude}&destination=${endLatitude},${endLongitude}`;
    
    Linking.openURL(url)
      .catch(err => console.error('An error occurred', err));
  };

  return (
    <View className="flex-1 justify-center items-center">
      <TouchableOpacity
        className="px-1 py-2 bg-blue-500 my-2"
        onPress={requestLocationPermission}
      >
        <View className="flex-row gap-x-2">
          <Text className="text-black">Grant Permission</Text>
          <MapPinIcon size={24} color={"white"} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        className="py-2 px-1 bg-gray-600"
        onPress={getCurrentLocation}
      >
        <Text className="text-black">Get Location</Text>
      </TouchableOpacity>

      {location && (
        <View>
          <Text className="text-black">Latitude: {location.latitude} & Longitude: {location.longitude}</Text>

          <TouchableOpacity className="py-2 px-1 bg-pink-300">
            <Text
              className="text-black"
              onPress={() => openGoogleMaps(location.latitude, location.longitude, 16.856742491654074, 74.58375560054392)}
            >
              See in Maps
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default GetGeoLocation;
