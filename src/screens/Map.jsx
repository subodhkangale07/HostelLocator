import { useNavigation, useRoute } from '@react-navigation/native';
import React, { Component } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const Map = ()=>{
      const route = useRoute();
      const {latitude,longitude,name} = route.params;
      console.log("Lat  long , name ", latitude,longitude,name);
      const navigation = useNavigation();
    return(
        <View style={{ flex: 1 }}
         className=' relative'
        >
            {/* Map Section */}
            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                provider={PROVIDER_GOOGLE}
            >
                <Marker
                    coordinate={{
                        latitude: latitude,
                        longitude: longitude,
                    }}
                    title={name}
                    description={name}
                />
            </MapView>

            {/* Bottom Section */}
            
               <TouchableOpacity
                onPress={()=>navigation.goBack()}
                 className=' absolute z-10  bg-white self-start p-2  rounded-md m-3'
                 color={'black'}
               >
                <ArrowLeftIcon
                   color={'black'}
                />
               </TouchableOpacity>
            
            
        </View>
    )
}

export default Map
