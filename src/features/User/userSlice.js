import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit"
import { getUserById, getOtherUsers, followUser, unfollowUser } from "./userApi"
const initialState = {
    otherUser: null,
    followedUsers: null,
    nonFollowedUsers: null,

    status: "idle",
    error: null,
}
// write Thunk here
export const getUserByIdThunk = createAsyncThunk(
    "user/getUserByIdThunk",
    async ({ userId }, { rejectWithValue }) => {
        try {
            const data = await getUserById(userId)
            // console.log(">>> At getUserByIdThunk, data: ", data)
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

export const handleGetOtherUsersThunk = createAsyncThunk(
    "user/handleGetOtherUsersThunk",
    async (userId, { rejectWithValue }) => {
        try {
            const data = getOtherUsers(userId)
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

export const followUserThunk = createAsyncThunk(
    "user/followUserThunk",
    async ({ followerId, followedUserId }, { rejectWithValue }) => {
        try {
            const data = await followUser({ followerId, followedUserId })
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

export const unfollowUserThunk = createAsyncThunk(
    "user/unfollowUserThunk",
    async ({ followerId, followedUserId }, { rejectWithValue }) => {
        try {
            const data = await unfollowUser({ followerId, followedUserId })
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

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        resetUserStatus: (state, action) => {
            state.status = "idle"
        },
        toggleIsUserFollowed: (state, action) => {
            const index = action.payload
            state.nonFollowedUsers[index].isFollowed =
                !state.nonFollowedUsers[index].isFollowed
        },
        addVisitingUserToFollowers(state, action) {
            const addedUser = action.payload
            state.otherUser.followers.unshift(addedUser)
        },
        removeVisitingUserToFollowers(state, action) {
            state.otherUser.followers.shift()
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserByIdThunk.pending, (state) => {
                state.status = "loading"
                state.error = null
            })
            .addCase(getUserByIdThunk.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.error = null
                state.otherUser = action.payload
            })
            .addCase(getUserByIdThunk.rejected, (state, action) => {
                state.status = "failed"
                console.log(">>>rejected payload: ", action.payload)
                state.error = action.payload
            })
            //handleGetOtherUsersThunk
            .addCase(handleGetOtherUsersThunk.pending, (state) => {
                state.status = "loading"
                state.error = null
            })
            .addCase(handleGetOtherUsersThunk.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.error = null
                state.followedUsers = action.payload.followedUsers
                state.nonFollowedUsers = action.payload.nonFollowedUsers
            })
            .addCase(handleGetOtherUsersThunk.rejected, (state, action) => {
                state.status = "failed"
                console.log(">>>rejected payload: ", action.payload)
                state.error = action.payload
            })
            //followUserThunk
            .addCase(followUserThunk.pending, (state) => {
                state.status = "loading"
                state.error = null
            })
            .addCase(followUserThunk.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.error = null
            })
            .addCase(followUserThunk.rejected, (state, action) => {
                state.status = "failed"
                console.log(">>>rejected payload: ", action.payload)
                state.error = action.payload
            })
            // unfollowUserThunk
            .addCase(unfollowUserThunk.pending, (state) => {
                state.status = "loading"
                state.error = null
            })
            .addCase(unfollowUserThunk.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.error = null
            })
            .addCase(unfollowUserThunk.rejected, (state, action) => {
                state.status = "failed"
                console.log(">>>rejected payload: ", action.payload)
                state.error = action.payload
            })
    },
})

export const selectOtherUser = (state) => state.user.otherUser
export const selectUserError = (state) => state.user.error
export const selectUserStatus = (state) => state.user.status
export const selectNonFollowedUsers = (state) => state.user.nonFollowedUsers
export const {
    resetUserStatus,
    toggleIsUserFollowed,
    addVisitingUserToFollowers,
    removeVisitingUserToFollowers,
} = userSlice.actions

export default userSlice.reducer
