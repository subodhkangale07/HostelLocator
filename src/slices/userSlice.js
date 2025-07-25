import { createSlice } from '@reduxjs/toolkit'
import { getData } from '../utils/getAndSetData';
const initialState =  getData('user') || null ;
export const userSlice = createSlice({
  name: 'step',
  initialState:initialState,
  reducers: {
    setUser: (state,action) => {
       state.user = action.payload;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setUser } = userSlice.actions
export default userSlice.reducer;
