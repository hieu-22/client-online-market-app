import axios from "../../axios"
import { addTimeAgo } from "../../utils/DateUtils"
import { toUnicodeCharacter } from "../../utils/emojis"

// check and remove hidden messages
// const removeHiddenMessage = (messages) => {
//     const checkMessageIsHidden = (message) => {
//         return (
//             (message.user_id === +userId && message.is_hidden_by_owner) ||
//             (message.user_id !== +userId && message.is_hidden_by_another)
//         )
//     }
//     let found = false
//     const newMessage = messages
//     for (let i = item.conversation.messages.length - 1; i >= 0; i--) {
//         const message = item.conversation.messages[i]
//         if (found) {
//             item.conversation.messages[i] = {}
//             continue
//         }

//         if (checkMessageIsHidden(message)) {
//             found = true
//         }
//     }
//     return newMessage
// }
export const addChat = async ({ userId, postId }) => {
    const response = await axios.post(
        `/conversations/create?userId=${userId}&postId=${postId}`
    )
    return response.data
}

export const addChatByUserId = async ({ userId, otherUserId }) => {
    const response = await axios.post(
        `conversations/createByUserId?userId=${userId}&otherUserId=${otherUserId}`
    )
    return response.data
}

export const getConversationsByUserId = async ({ userId }) => {
    const response = await axios.get(`/conversation/get-all?userId=${userId}`)
    const customeConversations = await response.data.conversations.map(
        (item) => {
            const newConversation = item.conversation
            return newConversation
        }
    )
    const updatedResponseData = {
        ...response.data,
        conversations: customeConversations,
    }

    const resData = await addTimeAgo(
        updatedResponseData.conversations,
        "createdAt"
    )
    return {
        ...updatedResponseData,
        conversations: resData,
    }
}

export const getEmojis = async () => {
    const response = await axios.get(
        "https://emoji-api.com/categories/smileys-emotion?access_key=814719656d44a2eb2f0ffca3dd3d7f198bb7a435"
    )
    const emojis = response.data
    return emojis
}
//DELETE
export const deleteChat = async ({ conversation_id, user_id }) => {
    const response = await axios.delete(
        `/conversations/delete?conversation_id=${conversation_id}&user_id=${user_id}`
    )
    return response.data
}
