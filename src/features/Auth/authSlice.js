import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit"
import storage from "redux-persist/lib/storage"
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2"
import { persistReducer } from "redux-persist"

import {
    login,
    register,
    updatePhoneNumber,
    updateAvatar,
    getPostByUserId,
    savePost,
    getSavedPostsByUserId,
    deleteSavedPost,
    deletePostById,
    updateUserInfo,
    updatePassword,
} from "./authApi"

const initialState = {
    isLoggedIn: false,
    token: null,
    user: null,
    status: "idle",
    error: null,
    message: null,
}

/**CREATE */
export const loginThunk = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await login(credentials)
            // console.log(">>> data returned: ", data)
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

export const registerThunk = createAsyncThunk(
    "auth/register",
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await register(credentials)
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

export const savePostThunk = createAsyncThunk(
    "auth/savePostThunk",
    async ({ userId, postId }, { rejectWithValue }) => {
        try {
            const data = await savePost({ userId, postId })
            // console.log(">>> At savePostThunk, data: ", data)
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

/**READ */
export const getPostByUserIdThunk = createAsyncThunk(
    "auth/getPostByUserIdThunk",
    async ({ userId }, { rejectWithValue }) => {
        try {
            const data = await getPostByUserId({ userId })
            // console.log(">>> At getPostByUserIdThunk, data: ", data)
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

export const getSavedPostsByUserIdThunk = createAsyncThunk(
    "auth/getSavedPostsByUserIdThunk",
    async ({ userId }, { rejectWithValue }) => {
        try {
            const data = await getSavedPostsByUserId(userId)
            // console.log(">>> At getSavedPostsByUserIdThunk, data: ", data)
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
export const updatePhoneNumberThunk = createAsyncThunk(
    "auth/updatePhoneNumber",
    async ({ phoneNumber, userId }, { rejectWithValue }) => {
        try {
            const data = await updatePhoneNumber(phoneNumber, userId)
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

export const updateAvatarThunk = createAsyncThunk(
    "auth/updateAvatar",
    async ({ formData, userId }, { rejectWithValue }) => {
        try {
            const data = await updateAvatar(formData, userId)
            // console.log("==> data: ", data)
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

export const updateUserInfoThunk = createAsyncThunk(
    "auth/updateUserInfoThunk",
    async ({ updatedInfo, userId }, { rejectWithValue }) => {
        try {
            const data = await updateUserInfo(updatedInfo, userId)
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

export const updatePasswordThunk = createAsyncThunk(
    "auth/updatePasswordThunk",
    async ({ password, newPassword, userId }, { rejectWithValue }) => {
        try {
            const data = await updatePassword({ password, newPassword }, userId)
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
/**DELETE */
export const deleteSavedPostThunk = createAsyncThunk(
    "auth/deleteSavedPostThunk",
    async ({ userId, postId }, { rejectWithValue }) => {
        try {
            const data = await deleteSavedPost({ userId, postId })
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
export const deletePostByIdThunk = createAsyncThunk(
    "auth/deletePostByIdThunk",
    async ({ postId, userId }, { rejectWithValue }) => {
        try {
            const data = await deletePostById({ postId, userId })
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

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state, action) => {
            state.user = null
            state.isLoggedIn = false
        },
        deleteErrorMessage: (state, action) => {
            if (state.error) {
                state.error.message = null
            }
        },
        resetStatus: (state, action) => {
            state.status = "idle"
        },
        updateUserIsOnline: (state, action) => {
            state.user.isOnline = true
        },
        resetError: (state, action) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            // loginThunk
            .addCase(loginThunk.pending, (state) => {
                state.status = "Đăng đăng nhập ..."
                state.error = null
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.status = "Đăng nhập thành công"
                state.error = null
                state.user = action.payload.user
                state.token = action.payload.token
                state.isLoggedIn = true
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.status = "Đăng nhập thất bại"
                console.log(">>>rejected payload: ", action.payload)
                state.error = action.payload
            })

            // registerThunk
            .addCase(registerThunk.pending, (state) => {
                state.status = "Đang đăng ký tài khoản ..."
                state.error = null
            })
            .addCase(registerThunk.fulfilled, (state, action) => {
                state.status = "Đăng ký tài khoản thành công!"
                state.error = null
                state.user = action.payload.user
                state.token = action.payload.token
                state.isLoggedIn = true
            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.status = "Đăng ký tài khoản thất bại!"
                state.error = action.payload
            })

            // updatePhoneNumberThunk
            .addCase(updatePhoneNumberThunk.pending, (state) => {
                state.status = "Đang cập nhật ..."
            })
            .addCase(updatePhoneNumberThunk.fulfilled, (state, action) => {
                state.status = "Cập nhật thành công!"
                state.user = action.payload.user
            })
            .addCase(updatePhoneNumberThunk.rejected, (state, action) => {
                state.status = "Cập nhật thất bại!"
                state.error = action.payload
            })

            // updateAvatarThunk
            .addCase(updateAvatarThunk.pending, (state) => {
                state.status = "Đang cập nhật ảnh ..."
            })
            .addCase(updateAvatarThunk.fulfilled, (state, action) => {
                state.status = "Cập nhật ảnh thành công"
                state.error = null
                state.user = action.payload.user
            })
            .addCase(updateAvatarThunk.rejected, (state, action) => {
                state.status = "Cập nhật ảnh thất bại"
                state.error = action.payload
            })

            //getPostByUserIdThunk
            .addCase(getPostByUserIdThunk.pending, (state) => {
                state.status = "loading"
                state.error = null
            })
            .addCase(getPostByUserIdThunk.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.error = null
                state.user.posts = action.payload.posts
            })
            .addCase(getPostByUserIdThunk.rejected, (state, action) => {
                state.status = "failed"
                console.log(">>>rejected payload: ", action.payload)
                state.error = action.payload
            })

            //savePostThunk
            .addCase(savePostThunk.pending, (state) => {
                state.status = "loading"
                state.error = null
            })
            .addCase(savePostThunk.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.error = null
                state.user.savedPosts.unshift(action.payload.savedPost)
            })
            .addCase(savePostThunk.rejected, (state, action) => {
                state.status = "failed"
                console.log(">>>rejected payload: ", action.payload)
                state.error = action.payload
            })

            //getSavedPostsByUserIdThunk
            .addCase(getSavedPostsByUserIdThunk.pending, (state) => {
                state.status = "loading"
                state.error = null
            })
            .addCase(getSavedPostsByUserIdThunk.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.error = null
                if (state.user) {
                    state.user.savedPosts = action.payload
                }
            })
            .addCase(getSavedPostsByUserIdThunk.rejected, (state, action) => {
                state.status = "failed"
                console.log(">>>rejected payload: ", action.payload)
                state.error = action.payload
            })

            //deleteSavedPostThunk
            .addCase(deleteSavedPostThunk.pending, (state) => {
                state.status = "loading"
                state.error = null
            })
            .addCase(deleteSavedPostThunk.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.error = null
                state.user.savedPosts = action.payload.updatedSavedPosts
                state.message = action.payload.message
            })
            .addCase(deleteSavedPostThunk.rejected, (state, action) => {
                state.status = "failed"
                console.log(">>>rejected payload: ", action.payload)
                state.error = action.payload
            })

            //deletePostByIdThunk
            .addCase(deletePostByIdThunk.pending, (state) => {
                state.status = "Đang ẩn bài đăng ..."
                state.error = null
            })
            .addCase(deletePostByIdThunk.fulfilled, (state, action) => {
                state.status = "Ẩn bài đăng thành công"
                state.error = null
                state.user.posts = action.payload.posts
                state.message = action.payload.message
            })
            .addCase(deletePostByIdThunk.rejected, (state, action) => {
                state.status = "Ẩn bài đăng thất bại"
                // console.log(">>>rejected payload: ", action.payload)
                state.error = action.payload
            })
            // updateUserInfoThunk
            .addCase(updateUserInfoThunk.pending, (state) => {
                state.status = "Đang cập nhật thông tin ..."
                state.error = null
            })
            .addCase(updateUserInfoThunk.fulfilled, (state, action) => {
                state.status = "Cập nhật thông tin thành công"
                state.error = null
                state.user = action.payload.user
            })
            .addCase(updateUserInfoThunk.rejected, (state, action) => {
                state.status = "Cập nhật thông tin thất bại"
                // console.log(">>>rejected payload: ", action.payload)
                state.error = action.payload
            })
            // updatePasswordThunk
            .addCase(updatePasswordThunk.pending, (state) => {
                state.status = "Đang cập nhật mật khẩu ..."
                state.error = null
            })
            .addCase(updatePasswordThunk.fulfilled, (state, action) => {
                state.status = "Cập nhật mật khẩu thành công"
                state.error = null
            })
            .addCase(updatePasswordThunk.rejected, (state, action) => {
                state.status = "Cập nhật mật khẩu thất bại"
                // console.log(">>>rejected payload: ", action.payload)
                state.error = action.payload
            })
    },
})

// configure Redux-Persist reducer
export const authPersistConfig = {
    key: "auth",
    storage,
    whitelist: ["isLoggedIn", "token", "user"],
    blacklist: ["status", "error", "message"],
    stateReconciler: autoMergeLevel2,
}

export const selectAuthStatus = (state) => state.auth.status
export const selectUser = (state) => state.auth.user
export const selectAuthError = (state) => state.auth.error
export const {
    logout,
    deleteErrorMessage,
    resetStatus,
    updateUserIsOnline,
    resetError,
} = authSlice.actions

// export authReducer
export default persistReducer(authPersistConfig, authSlice.reducer)
