import 'react-native-gesture-handler';
// import { NavigationContainer } from '@react-navigation/native';
// import { createDrawerNavigator } from '@react-navigation/drawer';
import React, { useState } from 'react';
import { View, Image, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import AnimatedCarousel from 'react-native-reanimated-carousel'; // Import the carousel
// import Dashboard from './Dashboard';
// import Settings from './Settings';
// import ImageSlider from '../components/ImageSlider';
const { width,height } = Dimensions.get('window'); // Get the screen width

const ImageSlider = ({images})=>  {
    const [currentIndex, setCurrentIndex] = useState(0); // State to track the current index
   
  
    return (
      <SafeAreaView  className=' relative'>
        <AnimatedCarousel
         className=' absolute top-0'
          loop
          width={width}
          height={height *0.48}
          autoPlay={true}
          data={images}
          scrollAnimationDuration={5000}
          onSnapToItem={(index) => setCurrentIndex(index)} // Update the current index on snap
          renderItem={({ item }) => (
            <View style={styles.carouselItem}>
              <Image source={{ uri: item }} style={styles.image} />
            </View>
          )}
        />
  
        {/* Dots Indicator - Positioned absolutely on the image */}
        <View 
         className=' flex flex-row absolute left-[40%]   top-[320px]'
        >
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.activeDot : styles.inactiveDot, // Apply style based on active index
              ]}
            />
          ))}
        </View>
      </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    carouselItem: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      borderRadius: 10,
      overflow: 'hidden',
      position: 'relative', // Make sure the item is positioned relatively for the absolute dots
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    // Dot styles
    dotContainer: {
      position: 'absolute', // Position the dots absolutely
      bottom: 10, // Place the dots near the bottom of the image
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginHorizontal: 5,
    },
    inactiveDot: {
      backgroundColor: '#888', // Inactive dot color
    },
    activeDot: {
      backgroundColor: '#fff', // Active dot color (set to white for better contrast on images)
    },
  });
  
export default ImageSlider
