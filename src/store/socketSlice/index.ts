import { AuthState } from './../authSlice/index';
import { Socket } from 'socket.io-client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';



export interface SocketInterface {
    value: any;
    player: {
        id: string;
        socketId: string;
        name: string;
    }[]
}

const initialState: SocketInterface = {
    value: null,
    player: [],
};

const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        setSocket: (state, action: PayloadAction<Socket>) => {
            state.value = action.payload
        },
        setPlayer: (state, action) => {
            state.player = action.payload
        },

    }
})
export const { setSocket, setPlayer } = socketSlice.actions;

export default socketSlice.reducer;