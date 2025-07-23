// slices/formSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  basicInfo: {},
  hostelInfo: {},
  pictures: {},
  locationInSlice: {}, // Add location field
  update:false,
  hostelId:null,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setBasicInfo: (state, action) => {
      state.basicInfo = action.payload;
    },
    setHostelInfo: (state, action) => {
      state.hostelInfo = action.payload;
    },
    setPictures: (state, action) => {
      state.pictures = { 
        ...state.pictures, 
        ...action.payload 
      };
    },
    setLocationInSlice: (state, action) => {
      state.locationInSlice = action.payload; // Add location to the state
    },
    setUpdate:(state,action)=>{
     state.update = action.payload;
    },
    resetForm: (state) => {
      state.basicInfo = {};
      state.hostelInfo = {};
      state.pictures = {};
      state.location = {}; // Reset location
    },
    setId:(state,action)=>{
       state.id = action.payload; 
    }
  },
});

export const { setBasicInfo, setHostelInfo, setId, setPictures, setLocationInSlice, resetForm ,setUpdate } = formSlice.actions;
export default formSlice.reducer;
