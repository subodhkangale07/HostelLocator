import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useRef } from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import { sendOtp, signUp } from '../services/apiCaller';


const OTPInput = ({ length = 6, onCodeFilled }) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < length - 1) {
      // Move to next input field if the current field is filled
      inputRefs.current[index + 1]?.focus();
    }

    if (index === length - 1) {
      // Call the onCodeFilled callback when the last field is filled
      onCodeFilled(newOtp.join(''));
    }
  };

  const handleKeyPress = (e, index) => {
    // Move to previous field if backspace is pressed
    if (e.nativeEvent.key === 'Backspace' && index > 0 && !otp[index]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.otpContainer}>
      {otp.map((_, index) => (
        <TextInput
         className='text-black '
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          style={styles.otpInput}
          maxLength={1}
          keyboardType='numeric'
          value={otp[index]}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          blurOnSubmit={false} // Prevent input from losing focus on submit
        />

      ))}
    </View>
  );
};

const VerifyOtp = () => {
    const navigation = useNavigation();
    const showToastWithGravityAndOffset = () => {
        ToastAndroid.showWithGravityAndOffset(
          'Sign up successful ! ',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          25,
          50,
        );
      };
  const route = useRoute();
  const formData = route.params;
  const [otp, setOtp] = useState('');

  const handleCodeFilled = (code) => {
    setOtp(code);
  };

  const handleSubmit = () => {
    if (otp.length === 6) {
      const updatedFormData = { ...formData, otp,contactNumber:"9730375652" };
      console.log("Updated Form Data:", updatedFormData);
      // Here you can handle the form submission, e.g., send data to the server
      signUp(updatedFormData,showToastWithGravityAndOffset,navigation);
      
    } else {
      Alert.alert('Validation Error', 'Please enter a valid OTP.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <OTPInput length={6} onCodeFilled={handleCodeFilled} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.resendButton}
         onPress={()=>sendOtp(formData.email)}
        
        >
          <Text style={styles.resendText}>Resend OTP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signUpButton} onPress={handleSubmit}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  otpContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginHorizontal: 5,
    textAlign: 'center',
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  resendButton: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  resendText: {
    color: '#fff',
    fontSize: 16,
  },
  signUpButton: {
    padding: 10,
    backgroundColor: '#28a745',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  signUpText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VerifyOtp;
