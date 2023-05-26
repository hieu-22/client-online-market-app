import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit"
import { addChat, getConversationsByUserId } from "./chatApi"

const initialState = {
    chats: [],
    currentChat: null,
    status: "idle",
    error: null,
}

/**THUNKS */
/**CREATE */
export const addChatThunk = createAsyncThunk(
    "chat/addChatThunk",
    async ({ userId, postId }, { rejectWithValue }) => {
        try {
            const data = await addChat({ userId, postId })
            return data
        } catch (error) {
            if (error.response) {
                console.log(
                    ">>> Error at getPostByUrlThunk, response: ",
                    error.response
                )
                return rejectWithValue({
                    data: error.response.data,
                    status: error.response.status,
                    headers: error.response.headers,
                })
            } else if (error.request) {
                console.log(
                    ">>> Error at getPostByUrlThunk, request: ",
                    error.request
                )
                rejectWithValue(error.request)
            } else {
                console.log("Error", error.message)
                rejectWithValue(error.request)
            }
        }
    }
)
/**READ */
export const getConversationsByUserIdThunk = createAsyncThunk(
    "chat/getConversationsByUserIdThunk",
    async ({ userId }, { rejectWithValue }) => {
        try {
            const data = await getConversationsByUserId({ userId })
            return data
        } catch (error) {
            if (error.response) {
                console.log(
                    ">>> Error at getPostByUrlThunk, response: ",
                    error.response
                )
                return rejectWithValue({
                    data: error.response.data,
                    status: error.response.status,
                    headers: error.response.headers,
                })
            } else if (error.request) {
                console.log(
                    ">>> Error at getPostByUrlThunk, request: ",
                    error.request
                )
                rejectWithValue(error.request)
            } else {
                console.log("Error", error.message)
                rejectWithValue(error.request)
            }
        }
    }
)
/**UPDATE */
/**DELETE */

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        resetChatStatus(state, action) {
            state.status = "idle"
        },
        setCurrentChat(state, action) {
            const { chatId } = action.payload
            const chats = state.chats

            for (const chat of chats) {
                if (chat.id === +chatId) {
                    state.currentChat = chat
                    break
                }
            }
        },
        addMessage(state, action) {
            state.currentChat.messages = [
                ...state.currentChat.messages,
                action.payload,
            ]
        },
        updateMessage(state, action) {
            const { id, content } = action.payload
            const messages = state.currentChat.messages
            ;(() => {
                for (var i = 0; i < state.currentChat.messages.length; i++) {
                    if (messages[i].id === id) {
                        state.currentChat.messages[i].content = content
                        break
                    }
                }
            })()
        },
    },
    extraReducers: (builder) => {
        builder
            // addChatThunk
            .addCase(addChatThunk.pending, (state) => {
                state.status = "loading"
                state.error = null
            })
            .addCase(addChatThunk.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.error = null
                state.chats = [...state.chats, action.payload.chat]
            })
            .addCase(addChatThunk.rejected, (state, action) => {
                state.status = "failed"
                // console.log(">>>rejected payload: ", action.payload)
                state.error = action.payload
            })
            // getConversationsByUserIdThunk
            .addCase(getConversationsByUserIdThunk.pending, (state) => {
                state.status = "loading"
                state.error = null
            })
            .addCase(
                getConversationsByUserIdThunk.fulfilled,
                (state, action) => {
                    state.status = "succeeded"
                    state.error = null
                    state.chats = action.payload.conversations
                }
            )
            .addCase(
                getConversationsByUserIdThunk.rejected,
                (state, action) => {
                    state.status = "failed"
                    // console.log(">>>rejected payload: ", action.payload)
                    state.error = action.payload
                }
            )
    },
})

export const selectAllChats = (state) => state.chat.chats
export const selectCurrentChat = (state) => state.chat.currentChat

export const { resetChatStatus, setCurrentChat, addMessage, updateMessage } =
    chatSlice.actions

export default chatSlice.reducer
