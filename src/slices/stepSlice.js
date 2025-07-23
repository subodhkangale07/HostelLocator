import { createSlice } from '@reduxjs/toolkit'

export const stepSlice = createSlice({
  name: 'step',
  initialState: {
    step: 1,
  },
  reducers: {
    setStep: (state,action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes.
      // Also, no return statement is required from these functions.
       state.step = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setStep } = stepSlice.actions

export default stepSlice.reducer