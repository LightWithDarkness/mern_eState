import { createSlice} from '@reduxjs/toolkit';

const initialState = { currentUser: {}, err: null, loading: false };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reqStart: (state) => {
      (state.loading = true), (state.err = null);
    },
    reqFailure: (state, action) => {
      (state.loading = false), (state.err = action.payload);
    },
    signInSuccess: (state, action) => {
      (state.loading = false),
        (state.err = null),
        (state.currentUser = action.payload);
    },
    updateUserFailure: (state, action) => {
      state.loading = false,
      state.err = action.payload
    },
    updateUserSuccess:(state,action)=>{
      state.loading = false,
      state.err = null,
      state.currentUser = action.payload
    },
  },
});

export const {reqFailure,reqStart,signInSuccess,updateUserFailure,updateUserSuccess} = userSlice.actions;
export default userSlice.reducer;
