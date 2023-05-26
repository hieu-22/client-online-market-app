import axios from "../../axios"
import { addTimeAgo } from "../../utils/DateUtils"
export const addChat = async ({ userId, postId }) => {
    const response = await axios.post(
        `/conversations/create?userId=${userId}&postId=${postId}`
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
