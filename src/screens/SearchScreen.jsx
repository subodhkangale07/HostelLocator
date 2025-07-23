import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, TextInput, TouchableOpacity, Image } from 'react-native';
import { ScrollView, Text, View } from 'react-native';
import { ArrowLeftIcon, MagnifyingGlassIcon } from 'react-native-heroicons/solid';
import { searchHostelsApiCaller } from '../services/apiCaller';

const SearchScreen = () => {
    const navigation = useNavigation();
    const [keyword, setKeyword] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const search = async () => {
            setLoading(true);
            const result = await searchHostelsApiCaller(setLoading, keyword);
            console.log("Result from api ", result);
            setData(result);
            setLoading(false);
        };

        search();
    }, [keyword]);

    console.log(keyword);

    return (
        <ScrollView>
            {/* Search Bar */}
            <View className='flex-row py-4 px-2 items-center'>
                <TouchableOpacity
                    className='bg-blue-200 p-1 rounded-md'
                    onPress={() => navigation.goBack()}
                >
                    <ArrowLeftIcon color={'black'} />
                </TouchableOpacity>

                <View className='bg-white rounded-full flex-1 items-center ml-2 py-2 flex-row px-2'>
                    <MagnifyingGlassIcon color={'gray'} className='px-2' />
                    <TextInput
                        placeholder='Search by names ,address ,owner names ...'
                        placeholderTextColor={'gray'}
                        onChangeText={(text) => setKeyword(text)}
                        value={keyword}
                        className='text-black'
                    />
                </View>
            </View>

            {/* Loading Indicator */}
            {loading && (
                <View className='flex-col w-screen h-screen items-center justify-center'>
                    <ActivityIndicator color={'blue'} size={30} />
                </View>
            )}

            {/* No Results Found */}
            {!loading && data.length === 0 && (
                <View className='flex-col items-center justify-center h-40'>
                    <Text className='text-gray-500'>No hostels found matching your search.</Text>
                </View>
            )}

            {/* Hostel Cards */}
            {!loading && data.length > 0 && (
                <View className='flex-wrap flex-row justify-center'>
                    {data.map((hostel, index) => (
                        <TouchableOpacity
                        onPress={()=>navigation.navigate('HostelScreen',hostel)}
                            key={index}
                            className='w-1/2 p-2'
                        >
                            <View className='bg-white p-4 shadow-md rounded-lg'>
                                <Image
                                    source={{ uri: hostel.exteriorImage }}
                                    className='w-full h-40 rounded-lg'
                                />
                                <Text className='text-lg font-bold pt-2 text-gray-600'>
                                    {hostel.hostelName}
                                </Text>
                                <Text className='text-sm text-gray-600'>
                                    {hostel.hostelAddress}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </ScrollView>
    );
};

export default SearchScreen;
