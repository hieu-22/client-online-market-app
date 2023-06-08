import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit"
import {
    getPostByUrl,
    getFirstPosts,
    getNextPosts,
    fetchPostsBySearchKeys,
    updatePost,
} from "./postApi"

const initialState = {
    post: null,
    fetchedPosts: [],
    searchedPosts: [],
    status: "idle",
    error: null,
}

export const getPostByUrlThunk = createAsyncThunk(
    "post/getPostByUrlThunk",
    async ({ postUrl }, { rejectWithValue }) => {
        try {
            const data = await getPostByUrl(postUrl)
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

export const getFirstPostsThunk = createAsyncThunk(
    "post/getFirstPostsThunk",
    async ({ limit }, { rejectWithValue }) => {
        try {
            const data = await getFirstPosts(limit)
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

export const getNextPostsThunk = createAsyncThunk(
    "post/getNextPostsThunk",
    async ({ limit, lastPostCreatedAt }, { rejectWithValue }) => {
        try {
            const data = await getNextPosts({ limit, lastPostCreatedAt })
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

export const fetchPostsBySearchKeysThunk = createAsyncThunk(
    "post/fetchPostsBySearchKeysThunk",
    async (searchKeys, { rejectWithValue }) => {
        try {
            const data = await fetchPostsBySearchKeys(searchKeys)
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

export const updatePostThunk = createAsyncThunk(
    "post/updatePostThunk",
    async ({ newPost, postId }, { rejectWithValue }) => {
        try {
            const data = await updatePost(newPost, postId)
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

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        resetPostStatus(state, action) {
            state.status = "idle"
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPostByUrlThunk.pending, (state) => {
                state.status = "loading"
                state.error = null
            })
            .addCase(getPostByUrlThunk.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.error = null
                state.post = action.payload
            })
            .addCase(getPostByUrlThunk.rejected, (state, action) => {
                state.status = "failed"
                // console.log(">>>rejected payload: ", action.payload)
                state.error = action.payload
            })
            .addCase(getFirstPostsThunk.pending, (state) => {
                state.status = "loading"
                state.error = null
            })
            .addCase(getFirstPostsThunk.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.error = null
                state.fetchedPosts = action.payload.posts
            })
            .addCase(getFirstPostsThunk.rejected, (state, action) => {
                state.status = "failed"
                // console.log(">>>rejected payload: ", action.payload)
                state.error = action.payload
            })
            .addCase(getNextPostsThunk.pending, (state) => {
                state.status = "loading"
                state.error = null
            })
            .addCase(getNextPostsThunk.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.error = null
                state.fetchedPosts = [
                    ...state.fetchedPosts,
                    ...action.payload.posts,
                ]
            })
            .addCase(getNextPostsThunk.rejected, (state, action) => {
                state.status = "failed"
                // console.log(">>>rejected payload: ", action.payload)
                state.error = action.payload
            })
            .addCase(fetchPostsBySearchKeysThunk.pending, (state) => {
                state.status = "loading"
            })
            .addCase(fetchPostsBySearchKeysThunk.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.searchedPosts = action.payload.matchedPosts
            })
            .addCase(fetchPostsBySearchKeysThunk.rejected, (state, action) => {
                state.status = "failed"
                // console.log(">>>rejected payload: ", action.payload)
            })
            // updatePostThunk
            .addCase(updatePostThunk.pending, (state) => {
                state.status = "Đang cập nhật tin ..."
                state.error = null
            })
            .addCase(updatePostThunk.fulfilled, (state, action) => {
                state.status = "Cập nhật tin thành công"
                state.error = null
            })
            .addCase(updatePostThunk.rejected, (state, action) => {
                state.status = "Cập nhật tin thất bại"
                // console.log(">>>rejected payload: ", action.payload)
                state.error = action.payload
            })
    },
})

export const selectPost = (state) => state.post?.post
export const selectFetchedPosts = (state) => state.post?.fetchedPosts
export const selectPostStatus = (state) => state.post.status
export const selectPostError = (state) => state.post.error
export const selectSearchedPosts = (state) => state.post?.searchedPosts

export const { resetPostStatus } = postSlice.actions

export default postSlice.reducer
