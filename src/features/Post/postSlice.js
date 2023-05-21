import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit"
import { getPostByUrl, getFirstPosts, getNextPosts } from "./postApi"
import {
    differenceInHours,
    differenceInMinutes,
    differenceInDays,
    differenceInMonths,
    differenceInYears,
} from "date-fns"

const initialState = {
    post: null,
    fetchedPosts: [],
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
            console.log(">>> Error at getPostByUrlThunk: ", error)
            return rejectWithValue({
                code: error.code,
                message: error.response.data.message,
                statusCode: error.response.status,
                statusText: error.response.statusText,
            })
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
            console.log(">>> Error at getFirstPostsThunk: ", error)
            return rejectWithValue({
                code: error.code,
                message: error.response.data.message,
                statusCode: error.response.status,
                statusText: error.response.statusText,
            })
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
            console.log(">>> Error at getNextPostsThunk: ", error)
            return rejectWithValue({
                code: error.code,
                message: error.response.data.message,
                statusCode: error.response.status,
                statusText: error.response.statusText,
            })
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
                // add timeAgo
                action.payload.post.timeAgo = (() => {
                    const post = action.payload.post
                    const now = new Date()
                    const postCreatedTime = new Date(post?.createdAt)

                    const timeAgoInMinites = differenceInMinutes(
                        now,
                        postCreatedTime
                    )
                    if (timeAgoInMinites < 61) return `${timeAgoInMinites} phút`

                    const timeAgoInHours = differenceInHours(
                        now,
                        postCreatedTime
                    )
                    if (timeAgoInHours < 25) return `${timeAgoInHours} giờ`

                    const timeAgoInDays = differenceInDays(now, postCreatedTime)
                    if (timeAgoInDays < 31) return `${timeAgoInDays} ngày`

                    const timeAgoInMonths = differenceInMonths(
                        now,
                        postCreatedTime
                    )
                    if (timeAgoInDays < 13) return `${timeAgoInMonths} tháng`

                    const timeAgoInYears = differenceInYears(
                        now,
                        postCreatedTime
                    )
                    return `${timeAgoInYears} năm`
                })()
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
    },
})

export const selectPost = (state) => state.post.post?.post
export const selectFetchedPosts = (state) => state.post.fetchedPosts
export const selectPostImagesUrls = (state) => state.post.post?.imageUrls
export const selectPostStatus = (state) => state.post.status
export const selectPostError = (state) => state.post.error

export const { resetPostStatus } = postSlice.actions

export default postSlice.reducer
