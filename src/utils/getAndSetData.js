import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value); // Convert the object to a JSON string
        await AsyncStorage.setItem(key, jsonValue);
        console.log('Data successfully stored');
      } catch (e) {
        console.log('Error storing data:', e);
      }
  };


  export const getData = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null; // Parse the JSON string back to an object
      } catch (e) {
        console.log('Error retrieving data:', e);
      }
  };

  export const clearAsyncStorage = async()=>{
    try{
       await AsyncStorage.clear();
    }
    catch(e)
    {
      console.log("Error While clearing the Async Storage ",e);
    }
  }
