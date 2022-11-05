import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
    name?: string | null;
    id?: string | null;
}


const initialState = {
    name: null,
    id: null
}

const AuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.id = action.payload.id;
            state.name = action.payload.name;
        },
        logout: (state, action) => {
            state.id = null;
            state.name = null;
        },
    }
})

export const { login, logout } = AuthSlice.actions;

export default AuthSlice.reducer;