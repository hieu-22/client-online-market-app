import axios from "../../axios"
import { addTimeAgo } from "../../utils/DateUtils"

export const search = async (searchKey) => {
    const response = await axios.get(`/posts/search?q=${searchKey}`)
    const users = response.data.searchResult.users
    const posts = response.data.searchResult.posts
    const updatedPosts = await addTimeAgo(posts, "createdAt")

    const searchResult = { users, posts: updatedPosts }
    return searchResult
}
