import { createSlice} from '@reduxjs/toolkit';

const initialState = { currentUser: {}, err: null, loading: false };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reqStart: (state) => {
     state.loading = true, 
      state.err = null
    },
    reqFailure: (state, action) => {
      state.loading = false,
      state.err = action.payload,
      state.currentUser = {}
    },
    signInSuccess:(state,action)=>{
      state.loading = false,
      state.err = null,
      state.currentUser = action.payload
    }
  },
});

export const {reqFailure,reqStart,signInSuccess} = userSlice.actions;
export default userSlice.reducer;
