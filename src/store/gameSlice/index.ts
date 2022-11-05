import { createSlice } from '@reduxjs/toolkit';
import { GAME_STATUS, GAME_SIZE, CURRENT_PLAYER } from './../../constant';
import { AuthState } from "../authSlice";

export interface Player extends AuthState {
    type: String,
    socketId: String,
}

export interface GameState {
    cellValues: String[],
    currentPlayer: String | null,
    cellSelect: number | null,
    winPosition: number[],
    competitor: Player | null,
    me: Player | null,
    gameStatus: string,
    winner: Player | null,
    winStats: String[]
}

const initialState: GameState = {
    cellValues: Array(GAME_SIZE * GAME_SIZE).fill(""),
    currentPlayer: null,
    cellSelect: null,
    winPosition: [],
    competitor: null,
    me: null,
    gameStatus: GAME_STATUS.NOT_STARTED,
    winner: null,
    winStats: []
}

const GameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {

        outGameRoom: (state, action) => {
            state.cellValues = Array(GAME_SIZE * GAME_SIZE).fill("");
            state.currentPlayer = null;
            state.cellSelect = null;
            state.winPosition = [];
            state.competitor = null;
            state.me = null;
            state.gameStatus = GAME_STATUS.NOT_STARTED;
            state.winner = null;
            state.winStats = [];
        },
        replaceGame: (state, action) => {
            state.cellValues = Array(GAME_SIZE * GAME_SIZE).fill("");
            state.currentPlayer = state.winStats[state.winStats.length - 1] === CURRENT_PLAYER.CROSS ? CURRENT_PLAYER.CIRCLE : CURRENT_PLAYER.CROSS;
            state.cellSelect = null;
            state.winPosition = [];
            state.gameStatus = GAME_STATUS.STARTED;
            state.winner = null;
        },
        gameRequest: (state, action) => {
            state.currentPlayer = CURRENT_PLAYER.CROSS;
            state.competitor = action.payload.competitor;
            state.me = action.payload.me;
        },
        acceptGamePlay: (state, action) => {
            state.currentPlayer = CURRENT_PLAYER.CROSS;
            state.competitor = action.payload.competitor;
            state.me = action.payload.me;
            state.gameStatus = GAME_STATUS.STARTED;
        },
        changeGameStatus: (state, action) => {
            state.gameStatus = action.payload;
        },
        setWinGame: (state, action) => {
            state.gameStatus = GAME_STATUS.END_GAME;
            state.winPosition = action.payload.winPosition;
            state.winner = action.payload.winner;
            state.winStats.push(action.payload.winner.type)
        },

        setCurrentPlayer: (state, action) => {
            state.currentPlayer = action.payload

        },
        cellClick: (state, action) => {
            state.cellSelect = action.payload.cellSelect;
            state.cellValues = action.payload.cellValues;
        }

    }
})

export const { gameRequest, acceptGamePlay, changeGameStatus, setWinGame, setCurrentPlayer, cellClick, replaceGame, outGameRoom } = GameSlice.actions;
export default GameSlice.reducer;
