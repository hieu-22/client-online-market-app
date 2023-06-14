import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { search } from "./searchApi.js"

const initialState = {
    searchedPosts: null,
    searchedUsers: null,
    status: "idle",
    error: null,
}

/**THUNKS */
/**CREATE */
export const searchThunk = createAsyncThunk(
    "search/searchThunk",
    async (searchKey, { rejectWithValue }) => {
        try {
            const data = await search(searchKey)
            return data
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                return rejectWithValue({
                    code: error.code,
                    message: error.response.data.message,
                    statusCode: error.response.status,
                    statusText: error.response.statusText,
                })
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                return rejectWithValue({
                    code: error.code,
                    message: error.message,
                    statusCode: 503,
                    statusText: "Service Unavailable",
                })
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message)
                rejectWithValue({
                    code: error.code,
                    message: error.message,
                    statusCode: 400,
                    statusText: "Bad Request",
                })
            }
        }
    }
)
/**UPDATE */
/**DELETE */

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        resetSearchStatus(state, action) {
            state.error = null
        },
        sortPosts(state, action) {
            const sortType = action.payload
            if (sortType === "Tin mới trước") {
                const newPosts = state.searchedPosts.sort((a, b) => {
                    const dateA = new Date(a.createdAt)
                    const dateB = new Date(b.createdAt)

                    return dateB - dateA
                })
                state.searchedPosts = newPosts
            }
            if (sortType === "Giá thấp trước") {
                const newPosts = state.searchedPosts.sort((a, b) => {
                    const priceA = +a.price
                    const priceB = +b.price

                    return priceA - priceB
                })
                state.searchedPosts = newPosts
            }
            if (sortType === "Giá cao trước") {
                const newPosts = state.searchedPosts.sort((a, b) => {
                    const priceA = +a.price
                    const priceB = +b.price

                    return priceB - priceA
                })
                state.searchedPosts = newPosts
            }
        },
    },
    extraReducers: (builder) => {
        builder
            //searchThunk
            .addCase(searchThunk.pending, (state) => {
                state.status = "loading"
            })
            .addCase(searchThunk.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.searchedPosts = action.payload.posts
                state.searchedUsers = action.payload.users
            })
            .addCase(searchThunk.rejected, (state, action) => {
                state.status = "failed"
                // console.log(">>>rejected payload: ", action.payload)
                state.error = action.payload
            })
    },
})

export const selectSearchedPosts = (state) => state.search.searchedPosts
export const selectSearchedUsers = (state) => state.search.searchedUsers
export const selectSearchError = (state) => state.search.error
export const selectSearchStatus = (state) => state.search.status

export const { sortPosts, resetSearchStatus } = searchSlice.actions

export default searchSlice.reducer
