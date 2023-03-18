import { createSlice } from "@reduxjs/toolkit"
import storage from "redux-persist/lib/storage"
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2"
import { persistReducer } from "redux-persist"

const initialState = {
    isLoggedIn: false,
    token: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
})

// configure Redux-Persist reducer
export const authPersistConfig = {
    key: "auth",
    storage,
    stateReconciler: autoMergeLevel2,
}

// export authReducer
export default persistReducer(authPersistConfig, authSlice.reducer)
