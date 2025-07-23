import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Dashboard from './screens/Dashboard';
import Settings from './screens/Settings';

const Drawer = createDrawerNavigator();

export default function App(){
    // comment 
 return(
    <NavigationContainer>
        <Drawer.Navigator>
            <Drawer.Screen 
             name='DashBoard'
             component={Dashboard}
            />
            <Drawer.Screen
             name='Settings'
             component={Settings}
            />

        </Drawer.Navigator>
    </NavigationContainer>
 )
}