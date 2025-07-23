import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';

const DropDown = ({ setHostelType }) => {
  // Memoize the hostel types to prevent unnecessary re-renders
  const HostelType = useMemo(() => [
    {
      id: '1',
      label: 'Boys',
      value: 'Boys'
    },
    {
      id: '2',
      label: 'Girls',
      value: 'Girls'
    },
    {
      id: '3',
      label: 'Both',
      value: 'Both'
    }
  ], []);

  const [selectedId, setSelectedId] = useState(null);

  // Function to handle selection of the hostel type
  const onPressHandler = (newSelectedId) => {
    const selectedItem = HostelType.find(item => item.id === newSelectedId);
    if (selectedItem) {
      setHostelType(selectedItem.value); // Update the parent component with the selected hostel type
      setSelectedId(newSelectedId); // Update the selected ID state
    }
  };

  return (
    <RadioGroup 
      containerStyle={{ flexDirection: 'row' }}
      labelStyle={{ color: 'black' }}
      radioButtons={HostelType} 
      onPress={(newSelectedId) => onPressHandler(newSelectedId)} // Pass the selected ID from onPress
      selectedId={selectedId} // Bind selectedId with the component
    />
  );
};

export default DropDown;
