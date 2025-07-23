import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity ,PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { NavigationContainer, DrawerActions  } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Entypo';
import Home from './screens/Home';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import VerifyOtp from './screens/VerifyOtp';
import DrawerContent from './DrawerContent';
import { clearAsyncStorage, getData } from './utils/getAndSetData';
import { Bars3BottomLeftIcon } from 'react-native-heroicons/solid';
import Profile from './screens/Profile';
import GetGeoLocation from './components/GetGeoLocation';
import RegisterHostel from './screens/RegisterHostel';
import { Provider, useSelector } from 'react-redux'
import store from './store';
import UpdateHostelDetails from './screens/UpdateHostelDetails';
import UpdateHostelOccupancy from './screens/UpdateHostelOccupancy';
import HostelScreen from './screens/HostelScreen';
import Map from './screens/Map';
import SearchScreen from './screens/SearchScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
// clearAsyncStorage();


const StackNav = () => {
  const {update} = useSelector((state)=>state.hostelForm);
  const [user, setUser] = useState(null);
  // const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      const res = await getData('user');
      // console.log("Result -- >", res);
      setUser(res);

      



    };
    fetchUser();
  }, []);
   let initialRouteName;

  //  useEffect(()=>{
  //   console.log("User in AppStack -->",user);
  //     if(user && user?.accountType === 'Student'){
  //       initialRouteName='Home'
  //     }
  //     else{
  //       initialRouteName='UpdateHostelDetails'
  //     }

  //  },[user])

   useEffect(() => {
    const fetchUser = async () => {
      const res = await AsyncStorage.getItem('user');
      setUser(res ? JSON.parse(res) : null);
    };
    fetchUser();
  }, []);


    
   
  return (
    <Stack.Navigator
    initialRouteName={'Home'}
    screenOptions={{
        statusBarColor: '#0163d2',
        headerStyle: { backgroundColor: '#0163d2' },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
      }}>
      

       <Stack.Screen
        name="Profile"
        component={Profile}
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            >
              <Bars3BottomLeftIcon
              size={30}
              color="#fff"
              
            />
            </TouchableOpacity>
            
          ),
        })}
      />

     
     <Stack.Screen
        name="Home"
        component={Home}
        options={({ navigation }) => ({
          headerShown:false,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            >
              <Bars3BottomLeftIcon
              size={30}
              color="#fff"
              
            />
            </TouchableOpacity>
            
          ),
        })}
      />

      <Stack.Screen
        name="RegisterHostel"
        component={RegisterHostel}
        options={({ navigation }) => ({
          title:update=== false ?" Register Hostel":"Update Hostel Details",
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            >
              <Bars3BottomLeftIcon
              size={30}
              color="#fff"
              
            />
            </TouchableOpacity>
            
          ),
        })}
      />

       <Stack.Screen
        name="UpdateHostelDetails"
        component={UpdateHostelDetails}
        options={({ navigation }) => ({
           title:"Update Hostel Details ",
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            >
              <Bars3BottomLeftIcon
              size={30}
              color="#fff"
              
            />
            </TouchableOpacity>
            
          ),
        })}
      />

      <Stack.Screen
        name="UpdateHostelOccupancy"
        component={UpdateHostelOccupancy}
        options={({ navigation }) => ({
          title:"Update Hostel Occupancy ",
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            >
              <Bars3BottomLeftIcon
              size={30}
              color="#fff"
              
            />
            </TouchableOpacity>
            
          ),
        })}
      />

        <Stack.Screen
        name="HostelScreen"
        component={HostelScreen}
        options={{headerShown:false}}   
      />


       <Stack.Screen
        name="MapScreen"
        component={Map}
        options={({ navigation }) => ({
          headerShown:false,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            >
              <Bars3BottomLeftIcon
              size={30}
              color="#fff"
              
            />
            </TouchableOpacity>
            
          ),
        })}
      />


       <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{headerShown:false}}
        
      />





      
    </Stack.Navigator>
  );
};

const DrawerNav = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="x" component={StackNav} />
      {/* Add other drawer screens here if needed */}
    </Drawer.Navigator>
  );
};

function AppStack(): React.JSX.Element {
  

  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<'Drawer' | 'Login'>('Login');

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          setInitialRoute('Drawer'); // Navigate to Drawer if token exists
        } else {
          setInitialRoute('Login'); // Navigate to Login if no token
        }
      } catch (error) {
        console.error('Error reading token from AsyncStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Provider
     store={store}
    >

    
    <NavigationContainer
    >
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name='VerifyOtp' component={VerifyOtp} />
        <Stack.Screen name="Drawer" component={DrawerNav} />
        {/* Ensure 'Drawer' is the key for the drawer navigator */}
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppStack;
