import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query"

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: "https://localhost:3001/api/" }),
    endpoints: (builder) => ({}),
})
