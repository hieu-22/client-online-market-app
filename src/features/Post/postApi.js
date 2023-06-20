import axios from "../../axios"
import { addTimeAgo } from "../../utils/DateUtils"

export const getPostByUrl = async (postUrl) => {
    const responses = await axios.get(`/posts/${postUrl}`)
    const post = responses.data.post
    const updatedPosts = await addTimeAgo([post], "createdAt")
    return updatedPosts[0]
}

export const getFirstPosts = async (limit) => {
    const responses = await axios.get(`/posts/first?limit=${limit}`)
    const posts = responses.data?.posts
    if (!posts) {
        return responses.data
    }
    const updatedPosts = await addTimeAgo(posts, "createdAt")
    const updatedReponse = { ...responses.data, posts: updatedPosts }
    return updatedReponse
}

export const getNextPosts = async ({ limit, lastPostCreatedAt }) => {
    const responses = await axios.get(
        `/posts/next?lastPostCreatedAt=${lastPostCreatedAt}&limit=${limit}`
    )
    const posts = responses.data?.posts
    if (!posts) {
        return responses.data
    }
    const updatedPosts = await addTimeAgo(posts, "createdAt")
    const updatedReponse = { ...responses.data, posts: updatedPosts }
    return updatedReponse
}

export const updatePost = async (newPost, postId) => {
    const response = await axios.patch(`/posts/${postId}/update`, newPost)
    return response.data
}
