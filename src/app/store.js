import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/Auth/authSlice"
import locationReducer from "../features/Post/locationSlice"
import postReducer from "../features/Post/postSlice"
import userReducer from "../features/User/userSlice"
import chatReducer from "../features/Chat/chatSlice"

import {
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        location: locationReducer,
        post: postReducer,
        user: userReducer,
        chat: chatReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
})

export const persistor = persistStore(store)
