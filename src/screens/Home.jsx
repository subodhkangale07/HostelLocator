import 'react-native-gesture-handler';
import { DrawerActions, NavigationContainer, useFocusEffect, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Image, StyleSheet, SafeAreaView, Dimensions, ActivityIndicator, TouchableOpacity, Text, Modal, Alert, Pressable } from 'react-native';
import AnimatedCarousel from 'react-native-reanimated-carousel'; // Import the carousel
import Dashboard from './Dashboard';
import Settings from './Settings';
import ImageSlider from '../components/ImageSlider';
import { getAllHostelsApiCaller } from '../services/apiCaller';
import HostelCard from '../components/HostelCard';
import { ScrollView } from 'react-native-gesture-handler';
import { Bars3BottomLeftIcon, FunnelIcon, MagnifyingGlassCircleIcon, MagnifyingGlassIcon, XMarkIcon } from 'react-native-heroicons/outline';
import CheckBox from '@react-native-community/checkbox';
import { RadioButton } from 'react-native-radio-buttons-group';
import { getData } from '../utils/getAndSetData';

const Drawer = createDrawerNavigator();
const { width,height } = Dimensions.get('window'); // Get the screen width

export default function Home() {
    const[hostels,setHostels] = useState([]);
    const [loading,setLoading]=useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [wifi,setWifi] = useState(false);
    const [pWater,setPWater] = useState(false);
    const [hWater,setHWater] = useState(false);
    const [lowToHigh ,setLowToHigh] = useState(true);
    const [data,setData] = useState([]);
     const navigation = useNavigation();

     const handleApplyFilters = async () => {
      console.log("Filters Boolean --->> ", wifi, pWater, hWater, lowToHigh);
    
      let filteredHostels = data.filter(hostel => {
        let matchesWifi= true;
        let matchesHWater=true;
        let matchesPWater=true;
        if(wifi === true){
           matchesWifi =  hostel.wifi === wifi;
        }

        if(pWater === true){
          matchesPWater =  hostel.drinkingWater === pWater;
       }

       if(hWater === true){
        matchesHWater = hostel.hotWater === hWater;
     }
        return matchesWifi && matchesPWater && matchesHWater;
      });
    
      // Step 2: Sort based on price
      filteredHostels.sort((a, b) => {
        // If price is not available, assume it's the highest to ensure it's shown
        const priceA = a.price !== null && a.price !== undefined ? a.price : Number.MAX_VALUE;
        const priceB = b.price !== null && b.price !== undefined ? b.price : Number.MAX_VALUE;
    
        if (lowToHigh) {
          return priceA - priceB; // Sort from low to high
        } else {
          return priceB - priceA; // Sort from high to low
        }
      });

      console.log("Filtered Hostels :: ",filteredHostels)
    
      // Step 3: Set the filtered and sorted hostels
      setHostels(filteredHostels);
    };
    

    const handleRemoveAllFilters = async()=>{
      setWifi(false);
      setPWater(false);
      setHWater(false);
      setLowToHigh(true);
      setHostels(data);

    } 
    useEffect(()=>{
      const fetchData = async () => {
        try {
          const result = await getAllHostelsApiCaller(setLoading);
          // console.log("Data in Caller", result);
          setData(result);
          console.log("Data Of All the Hostels ",data);
          setHostels(result);
        } catch (error) {
          console.error("Error fetching hostels", error);
        }
      };
    
      fetchData();
     
    },[]);

    const [user, setUser] = useState(null);
    // const dispatch = useDispatch();

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

    const navigate = useNavigation();


    if(user?.accountType === 'Hostel'){
      return(
        <View
         className=' flex-col h-screen  items-center justify-center '
        >
          <TouchableOpacity
          onPress={()=>navigate.navigate('RegisterHostel')}
           className=' bg-blue-300 px-2 py-1  rounded-full '
          >
            <Text
             className=' text-black'
            >Register a Hostel </Text>
          </TouchableOpacity>
        </View>
      )
    }
   if(loading || !hostels){
    return(
      <View
       className=' flex-1 w-full h-full  items-center justify-center'
      >
         <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
   }
   if(user?.accountType !== 'Hostel')
  return(
    
  <ScrollView

  //  className=' flex items-center justify-center'
  >

    <View
     className=' flex-row justify-between items-center py-4 '
    >
      {/* Header */}
      <TouchableOpacity
       className=' px-2'
       onPress={()=>{navigation.dispatch(DrawerActions.openDrawer())}}
      >
      <Bars3BottomLeftIcon
       color={'black'}
       strokeWidth={2}
      />
      </TouchableOpacity>

      <View>
        <Text className=' text-slate-600 font-semibold  text-xl '> <Text className=' text-blue-700 font-bold text-2xl   '>H</Text>ostel<Text className=' text-blue-700 font-bold text-2xl   '>L</Text>ocator</Text>
      </View>

      <View
       className='  flex-row justify-between items-center px-2  gap-x-2 bg-blue-300 py-1 rounded-full mr-2'
      >
        <TouchableOpacity
         onPress={()=>navigation.navigate('SearchScreen')}
        >
           <MagnifyingGlassIcon
            color={'black'}
           />
        </TouchableOpacity>

        <TouchableOpacity
        onPress={()=>setModalVisible(true)}
        >
           <FunnelIcon
            color={'black'}
           />
        </TouchableOpacity>

      </View>
   
    </View>

    <Text
     className='  font-semibold text-xl text-black px-2'
    > Hostels  for You </Text>
   {
     hostels.map((hostel,index)=>(
        <HostelCard
         key={index}
         hostel={hostel}
        />
     ))
   }

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          
          <View 
           className= ' bg-gray-50 px-2 py-4  rounded-lg '
          >
          <Pressable
             className=' bg-red-600 self-end rounded-full   '
              onPress={() => setModalVisible(!modalVisible)}>
                <XMarkIcon
                 color={'white'}
                />
            </Pressable>
            <View
             className='py-2'
            >
            <Text  className=' text-black text-lg font-semibold'>Select  Filters as Your Wish</Text>
            <View>
              <View
               className=' flex-row items-center'
              >
                <Text className=' text-black '>Wifi</Text>
                <CheckBox
        value={wifi}
        onValueChange={() => setWifi((prev) => !prev)}
        boxType="square" // or 'circle' depending on what you prefer
        tintColors={{ true: 'blue', false: 'gray' }} // color when checked (true) or unchecked (false)
        onCheckColor='white'  // color of the check mark when checked
        onFillColor='blue'    // background color of the box when checked
        onTintColor='blue'    // border color of the box when checked
        tintColor='gray'      // border color of the box when unchecked
      />
              </View>

              <View
               className=' flex-row items-center'
              >
                <Text className=' text-black '>Purified Water  for Drinking </Text>
                <CheckBox
        value={pWater}
        onValueChange={() => setPWater((prev) => !prev)}
        boxType="square" // or 'circle' depending on what you prefer
        tintColors={{ true: 'blue', false: 'gray' }} // color when checked (true) or unchecked (false)
        onCheckColor='white'  // color of the check mark when checked
        onFillColor='blue'    // background color of the box when checked
        onTintColor='blue'    // border color of the box when checked
        tintColor='gray'      // border color of the box when unchecked
      />
              </View>

              <View
               className=' flex-row items-center'
              >
                <Text className=' text-black '>Hot water for Bath</Text>
                <CheckBox
        value={hWater}
        onValueChange={() => setHWater((prev) => !prev)}
        boxType="square" // or 'circle' depending on what you prefer
        tintColors={{ true: 'blue', false: 'gray' }} // color when checked (true) or unchecked (false)
        onCheckColor='white'  // color of the check mark when checked
        onFillColor='blue'    // background color of the box when checked
        onTintColor='blue'    // border color of the box when checked
        tintColor='gray'      // border color of the box when unchecked
      />
              </View>

            </View>
            <View
              className=' border-t border-t-gray-600'
            ></View>
            </View>

            <View>
      <Text className='text-black font-semibold text-lg'>Sort according to price</Text>

      {/* Low to High Radio Button */}
      <View className='flex-row items-center'>
        <RadioButton
          color='black'
          value="lowToHigh"
          selected={lowToHigh} // If true, this is selected
          onPress={() => setLowToHigh(true)} // Set Low to High on press
          containerStyle={styles.radioContainer}
          radioStyle={lowToHigh ? styles.radioChecked : styles.radioUnchecked}
          labelStyle={styles.radioLabel}
        />
        <Text className='text-black px-2'>Low To High</Text>
      </View>

      {/* High to Low Radio Button */}
      <View className='flex-row items-center'>
        <RadioButton
          color='black'
          value="highToLow"
          selected={!lowToHigh} // If false, this is selected
          onPress={() => setLowToHigh(false)} // Set High to Low on press
          containerStyle={styles.radioContainer}
          radioStyle={!lowToHigh ? styles.radioChecked : styles.radioUnchecked}
          labelStyle={styles.radioLabel}
        />
        <Text className='text-black px-2'>High To Low</Text>
      </View>
    </View>

            <View
               className=' flex-row justify-between items-center'
              >
                <TouchableOpacity
                 onPress={()=>{handleApplyFilters()}}
                 className=' py-1 px-2 bg-blue-100 rounded-md '
                > 
                 <Text  className=' text-black' > Apply Filters</Text>
                </TouchableOpacity>

                <TouchableOpacity
                onPress={()=>handleRemoveAllFilters()}
                 className=' py-1 px-2 bg-red-100 rounded-md ml-2'
                > 
                 <Text className=' text-black'> Remove All  Filters</Text>
                </TouchableOpacity>
              </View>


          </View>
        </View>
      </Modal>
  </ScrollView>
 )
}


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});