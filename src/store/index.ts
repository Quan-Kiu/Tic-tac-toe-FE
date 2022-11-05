import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import socketReducer from './socketSlice'
import gameReducer from './gameSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        socket: socketReducer,
        game: gameReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    'socket/setSocket',
                ],
                ignoredPaths: ['socket'],
            },
        }),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch