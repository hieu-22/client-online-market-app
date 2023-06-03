import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
    addChat,
    getConversationsByUserId,
    getEmojis,
    deleteChat,
} from "./chatApi"

const initialState = {
    chats: [],
    currentChat: null,
    emojis: null,
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
export const getEmojisThunk = createAsyncThunk(
    "chat/getEmojisThunk",
    async (undefined, { rejectWithValue }) => {
        try {
            const data = await getEmojis()
            return data
        } catch (error) {
            if (error.response) {
                console.log(
                    ">>> Error at getEmojisThunk, response: ",
                    error.response
                )
                return rejectWithValue({
                    data: error.response.data,
                    status: error.response.status,
                    headers: error.response.headers,
                })
            } else if (error.request) {
                console.log(
                    ">>> Error at getEmojisThunk, request: ",
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
            action.payload.messages.reverse()
            state.currentChat = action.payload
        },
        addChats(state, action) {
            state.chats = action.payload
        },
        addChatToChats(state, action) {
            const chat = action.payload
            state.chats.unshift(chat)
        },
        addMessageToCurrentChat(state, action) {
            state.currentChat.messages = [
                ...state.currentChat.messages,
                action.payload,
            ]
        },
        addMoreMessagesToCurrentChat(state, action) {
            const messages = action.payload
            state.currentChat.messages.splice(0, 0, ...messages)
        },
        addMessageToChatsById(state, action) {
            const { message, index } = action.payload
            state.chats[index].messages[0] = message
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
        giveDeletedFlagToMessage(state, action) {
            const messageId = action.payload
            const index = state.currentChat.messages.findIndex(
                (message) => message.id === +messageId
            )
            state.currentChat.messages[index].is_deleted = true
        },
        removeMessage(state, action) {
            const messageId = action.payload
            const index = state.currentChat.messages.findIndex(
                (message) => message.id === +messageId
            )
            state.currentChat.messages.splice(index, 1)
        },
        removeChatById(state, action) {
            const conversation_id = action.payload

            const index = state.chats.findIndex(
                (chat) => chat.id === conversation_id
            )
            if (index !== -1) {
                state.chats.splice(index, 1)
            }
            const newChats = state.chats.filter(Boolean)
            state.chats = newChats

            if (state.currentChat?.id === conversation_id) {
                state.currentChat = null
            }
        },
        moveUpdatedChatToTop: (state, action) => {
            const { chatId } = action.payload
            const chatIndex = state.chats.findIndex(
                (chat) => chat.id === chatId
            )
            if (chatIndex === -1) {
                return console.log("Chat is not found to update")
            }
            const chats = [...state.chats]
            const updatedChat = chats.splice(chatIndex, 1)[0]
            chats.unshift(updatedChat)
            state.chats = chats
        },
        updateMessageIsRead(state, action) {
            const { chatId } = action.payload
            const chatIndex = state.chats.findIndex(
                (chat) => chat.id === chatId
            )

            state.chats[chatIndex].messages[0].is_read_by_another = true
        },
    },
    extraReducers: (builder) => {
        builder
            //getEmojisThunk
            .addCase(getEmojisThunk.pending, (state) => {
                state.status = "loading"
                state.error = null
            })
            .addCase(getEmojisThunk.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.error = null
                state.emojis = action.payload
            })
            .addCase(getEmojisThunk.rejected, (state, action) => {
                state.status = "failed"
                // console.log(">>>rejected payload: ", action.payload)
                state.error = action.payload
            })
    },
})

export const selectAllChats = (state) => state.chat.chats
export const selectCurrentChat = (state) => state.chat.currentChat
export const selectEmojis = (state) => state.chat.emojis

export const {
    resetChatStatus,
    setCurrentChat,
    addMessageToCurrentChat,
    addMessageToChatsById,
    updateMessage,
    addChats,
    removeChatById,
    removeMessage,
    giveDeletedFlagToMessage,
    addChatToChats,
    moveUpdatedChatToTop,
    addMoreMessagesToCurrentChat,
    updateMessageIsRead,
} = chatSlice.actions

export default chatSlice.reducer
