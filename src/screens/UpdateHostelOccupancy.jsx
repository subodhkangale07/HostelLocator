import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button } from 'react-native';
import axios from 'axios'; // Assuming you are using axios for API calls
import { updateHostelOccupancyApiCaller } from '../services/apiCaller';
import Toast from 'react-native-toast-message';

const UpdateHostelOccupancy = () => {
  const route = useRoute();
  const hostel = route.params;

  // Initialize state for each room type
  const [roomData, setRoomData] = useState({
    ...hostel,
  });

  // Handler for changing input values
  const handleInputChange = (roomType, field, value) => {
    setRoomData((prevData) => ({
      ...prevData,
      [roomType]: {
        ...prevData[roomType],
        [field]: value,
      },
    }));
  };

  // Function to submit changes to the database
  const submitChanges = async () => {
    // try {
    //   // Replace with your backend API endpoint
    //   const response = await axios.put(`https://your-backend-api/hostel/${hostel._id}`, roomData);
    //   console.log('Update successful', response.data);
    // } catch (error) {
    //   console.error('Error updating hostel data', error);
    // }

    roomData.id=hostel._id;

    const res = await updateHostelOccupancyApiCaller(roomData);
     if(res){
      Toast.show({
        text1:"Hostel occupancy updated !! "
      })
     }
     else{
      Toast.show({
        text1:"Failed to update server error  !! "
      }
    )
     }

    console.log(roomData)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{hostel.hostelName}</Text>

      {/* Table Headers */}
      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Room Type</Text>
        <Text style={styles.headerCell}>Available Beds</Text>
        <Text style={styles.headerCell}>Total Beds</Text>
      </View>

      {/* Table Rows */}
      <View>
        {hostel?.roomType?.map((room, index) => {
          const roomInfo = roomData[room]; // Access dynamic room data
          return (
            <View key={index} style={styles.tableRow}>
              {/* Room Type */}
              <Text style={styles.tableCell}>
                {room === 'MoreThanFourBeds'
                  ? " >4 beds /room"
                  : room === "DoubleBeds"
                  ? "2 Beds /room"
                  : room === "SingleBed"
                  ? "1 Bed /room"
                  : room === "FourBeds"
                  ? "4 Beds /room"
                  : room === "ThreeBeds"
                  ? "3 Beds /room"
                  : ""}
              </Text>

              {/* Available Beds Input */}
              <TextInput
                value={roomInfo?.available?.toString() || ""}
                style={[styles.tableCell, styles.inputCell]}
                placeholder="Available Beds"
                placeholderTextColor={'gray'}
                keyboardType="numeric"
                onChangeText={(value) => handleInputChange(room, 'available', value)}
              />

              {/* Total Beds Input */}
              <TextInput
                value={roomInfo?.total?.toString() || ""}
                style={[styles.tableCell, styles.inputCell]}
                placeholder="Total Beds"
                placeholderTextColor={'gray'}
                keyboardType="numeric"
                onChangeText={(value) => handleInputChange(room, 'total', value)}
              />
            </View>
          );
        })}

      </View>

      {/* Submit Button */}
      <Button title="Submit Changes" onPress={submitChanges} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: '#000',
  },
  inputCell: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    borderRadius: 5,
  },
});

export default UpdateHostelOccupancy;
