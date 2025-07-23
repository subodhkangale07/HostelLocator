import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, Modal, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { ArrowPathIcon, ArrowRightStartOnRectangleIcon, CircleStackIcon, HomeIcon, UserCircleIcon } from 'react-native-heroicons/outline';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SvgUri } from 'react-native-svg'; // Import for rendering SVGs
import { clearAsyncStorage, getData } from './utils/getAndSetData';
import { setBasicInfo, setHostelInfo, setLocationInSlice, setPictures, setUpdate } from './slices/hostelFormSlice';
import { useDispatch } from 'react-redux';

function DrawerContent(props) {
  const [user, setUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // State for controlling modal visibility
  const dispatch = useDispatch();

  
    const fetchUser = async () => {
      const res = await getData('user');
      console.log("Result -- >", res);
      setUser(res);
    };


   
  useFocusEffect(
    useCallback(() => {
      fetchUser(); // Fetch the user data when screen comes into focus
    }, [])
  );
 

  const navigation = useNavigation(); // Using the useNavigation hook

  // Function to handle logout confirmation
  const handleLogout = async () => {
    setIsModalVisible(false); // Close the modal
    await clearAsyncStorage(); // Clear AsyncStorage
    const data = await getData('token'); // Fetch token after logout
    console.log("Data after logOut", data);
    navigation.navigate('Login'); // Navigate to Login screen
  };

  return (
    <View style={{ flex: 1 }}>
      {/* User Info Section */}
      {user && (
        <View className="py-2">
          <View className="px-2 rounded-full object-cover" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {user.image.includes('svg') ? (
              <View className="rounded-full px-2 object-contain">
                <SvgUri uri={user.image} height={50} width={50} />
              </View>
            ) : (
              <Image
                className="rounded-full object-cover shadow-2xl border"
                source={{ uri: user.image }}
                style={{ height: 80, width: 80 }}
              />
            )}
            <View className="flex-1 flex-row gap-x-2">
              <Text style={{ color: 'black', fontWeight: 'bold' }}>{user.firstName}</Text>
              <Text style={{ color: 'black' }}>{user.lastName}</Text>
            </View>
          </View>
          <View className="px-4  py-2 ">
            <Text className="text-black">{user.email}</Text>
          </View>
        </View>
      )}

      {/* Drawer Items */}
      <DrawerContentScrollView>
        {user && user.accountType === 'Student' && (
          <DrawerItem
            label="Home"
            icon={() => <HomeIcon color={'black'} size={24} />}
            onPress={() => navigation.navigate('Home')}
          />
        )}

        <DrawerItem
          label="Profile"
          icon={() => <UserCircleIcon color={'black'} size={24} />}
          onPress={() => navigation.navigate('Profile')}
        />

        {user && user.accountType === 'Hostel' && (
          <>
            <DrawerItem
              label="Register Hostel"
              icon={() => <CircleStackIcon color={'black'} size={24} />}
              onPress={() => {
                navigation.navigate('RegisterHostel');
                dispatch(setUpdate(false));
                dispatch(setPictures({}));
                dispatch(setLocationInSlice({}));
                dispatch(setHostelInfo({}));
                dispatch(setBasicInfo({}));
              }}
            />
            <DrawerItem
              label="Update Hostel Occupancy Details"
              icon={() => <ArrowPathIcon color={'black'} size={24} />}
              onPress={() => navigation.navigate('UpdateHostelDetails')}
            />
          </>
        )}
      </DrawerContentScrollView>

      {/* LogOut Drawer Item */}
      <DrawerItem
        label="LogOut"
        icon={() => <ArrowRightStartOnRectangleIcon color={'black'} size={24} />}
        onPress={() => setIsModalVisible(true)} // Show modal when LogOut is pressed
      />

      {/* Logout Confirmation Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)} // Close the modal on back press
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <View
            style={{
              width: 300,
              padding: 20,
              backgroundColor: 'white',
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 ,color:'black'}}>Are you sure you want to log out?</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <TouchableOpacity
                style={{ backgroundColor: 'green', padding: 10, borderRadius: 5, flex: 1, marginRight: 5 }}
                onPress={handleLogout}
              >
                <Text style={{ color: 'white', textAlign: 'center' }}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: 'red', padding: 10, borderRadius: 5, flex: 1, marginLeft: 5 }}
                onPress={() => setIsModalVisible(false)} // Close the modal on cancel
              >
                <Text style={{ color: 'white', textAlign: 'center' }}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default DrawerContent;
