import axios from "../../axios"
import { addTimeAgo } from "../../utils/DateUtils"
const uniqueParam = new Date().getTime()

export const login = async (credentials) => {
    const responses = await axios.post("/login", credentials)
    // console.log(">>> server reponses: ", responses)
    return responses.data
}

export const register = async (credentials) => {
    const responses = await axios.post("/register", credentials)
    // console.log(">>> server reponses: ", responses)
    return responses.data
}

export const updatePhoneNumber = async (phoneNumber, userId) => {
    const responses = await axios.patch(
        `/user/${userId}/update-user-information?cacheBust=${uniqueParam}`,
        {
            phoneNumber,
        }
    )
    // console.log(">>> server reponses: ", responses)
    return responses.data
}

export const updateUserInfo = async (updatedInfo, userId) => {
    const response = await axios.patch(
        `user/${userId}/update-user-information?cacheBust=${uniqueParam}`,
        updatedInfo
    )
    return response.data
}

export const updatePassword = async (updatedInfo, userId) => {
    const response = await axios.patch(
        `user/${userId}/update-password`,
        updatedInfo
    )
    return response.data
}
export const updateAvatar = async (formData, userId) => {
    const responses = await axios.patch(
        `/user/${userId}/changeAvatar?cacheBust=${uniqueParam}`,

        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    )
    // console.log(">>> server reponses: ", responses)
    return responses.data
}

export const getPostByUserId = async ({ userId }) => {
    const responses = await axios.get(`/posts/getByUserId?userId=${userId}`)
    const posts = responses.data?.posts
    if (!posts) {
        return responses.data
    }
    const updatedPosts = await addTimeAgo(posts, "createAt")
    const updatedReponse = { ...responses.data, posts: updatedPosts }
    return updatedReponse
}

export const savePost = async ({ userId, postId }) => {
    const responses = await axios.post(
        `/user/${userId}/save-post?postId=${postId}`,
        {}
    )
    // console.log(">>> At savePost, server reponses: ", responses)
    return responses.data
}

export const getSavedPostsByUserId = async (userId) => {
    const responses = await axios.get(`/user/get-saved-posts?userId=${userId}`)
    // console.log(">>> At getSavedPostsByUserId, server reponses: ", responses)
    return responses.data.savedPosts
}

export const deleteSavedPost = async ({ userId, postId }) => {
    const responses = await axios.delete(
        `/user/delete-saved-post?userId=${userId}&postId=${postId}`
    )
    // console.log(">>> At deleteSavedPost, server reponses: ", responses)
    return responses.data
}

export const deletePostById = async ({ postId, userId }) => {
    const responses = await axios.delete(
        `/posts/${postId}/delete?userId=${userId}`
    )
    // console.log(">>> At deletePostById, server reponses: ", responses)
    const posts = responses.data?.posts
    if (!posts) {
        return responses.data
    }
    const updatedPosts = await addTimeAgo(posts, "createAt")
    const updatedReponse = { ...responses.data, posts: updatedPosts }
    return updatedReponse
}

export const getRelativeUsers = async (userId) => {
    const response = await axios.get(`user/${userId}/get-relative-users`)

    const followingUsers = response.data.users.followingUsers
    const newFollowingUsers = followingUsers.map((item) => {
        const newItem = item
        newItem.isFollowed = true
        return newItem
    })

    const followers = response.data.users.followers
    const newFollowers = followers.map((item) => {
        const newItem = item
        newItem.isFollowed = false
        return newItem
    })

    const customizedData = {
        followers: newFollowers,
        followingUsers: newFollowingUsers,
    }
    return customizedData
}
