import axios from "../../axios"
import { addTimeAgo } from "../../utils/DateUtils"

export const getUserById = async (userId) => {
    const response = await axios.get(`/user/${userId}`)
    const user = response.data.user
    const posts = user.posts
    const updatedPosts = await addTimeAgo(posts, "createAt")
    const updatedUser = { ...user, posts: updatedPosts }
    return updatedUser
}

export const getOtherUsers = async (userId) => {
    const response = await axios.get(`user/get-other-users?userId=${userId}`)

    const followedUsers = response.data.users.followedUsers
    const newFollowedUsers = followedUsers.map((item) => {
        const newItem = item
        newItem.isFollowed = true
        return newItem
    })

    const nonFollowedUsers = response.data.users.nonFollowedUsers
    const newNonFollowedUsers = nonFollowedUsers.map((item) => {
        const newItem = item
        newItem.isFollowed = false
        return newItem
    })

    const customizedData = {
        followedUsers: newFollowedUsers,
        nonFollowedUsers: newNonFollowedUsers,
    }
    return customizedData
}

export const followUser = async ({ followerId, followedUserId }) => {
    const response = await axios.post(
        `user/${followerId}/add-relationship?otherUserId=${followedUserId}`
    )
    return response.data
}
export const unfollowUser = async ({ followerId, followedUserId }) => {
    const response = await axios.delete(
        `user/${followerId}/remove-relationship?otherUserId=${followedUserId}`
    )
    return response.data
}
