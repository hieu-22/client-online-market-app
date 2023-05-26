import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit"
import { getUserById } from "./userApi"
const initialState = {
    otherUser: null,
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
            // console.log(">>> Error at getUserByIdThunk: ", error)
            return rejectWithValue({
                code: error.code,
                message: error.response.data.message,
                statusCode: error.response.status,
                statusText: error.response.statusText,
            })
        }
    }
)

const userSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        resetUserStatus: (state, action) => {
            state.status = "idle"
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
    },
})

export const selectOtherUser = (state) => state.user.otherUser
export const selectUserError = (state) => state.user.error
export const selectUserStatus = (state) => state.user.status
export const { resetUserStatus } = userSlice.actions

export default userSlice.reducer
