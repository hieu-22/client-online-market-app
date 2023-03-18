import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import storage from "redux-persist/lib/storage"
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2"
import { persistReducer } from "redux-persist"

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: "https://localhost:3001/api/" }),
    tagTypes: ["User"],
    endpoints: (build) => ({}),
})

const apiPersistConfig = {
    key: "api",
    storage,
    stateReconciler: autoMergeLevel2,
}

export default persistReducer(apiPersistConfig, apiSlice.reducer)
