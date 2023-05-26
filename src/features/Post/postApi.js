import axios from "../../axios"
import {
    differenceInHours,
    differenceInMinutes,
    differenceInDays,
    differenceInMonths,
    differenceInYears,
} from "date-fns"

export const getPostByUrl = async (postUrl) => {
    const responses = await axios.get(`/posts/${postUrl}`)
    return responses.data
}

export const getFirstPosts = async (limit) => {
    const responses = await axios.get(`/posts/first?limit=${limit}`)
    const posts = responses.data?.posts
    if (!posts) {
        return responses.data
    }
    const updatedPosts = await posts.map((post) => {
        const now = new Date()
        const postCreatedTime = new Date(post.createdAt)
        const timeAgoInMinutes = differenceInMinutes(now, postCreatedTime)
        if (timeAgoInMinutes < 61) {
            return {
                ...post,
                timeAgo: `${timeAgoInMinutes.toString()} phút trước`,
            }
        }

        const timeAgoInHours = differenceInHours(now, postCreatedTime)
        if (timeAgoInHours < 25) {
            return {
                ...post,
                timeAgo: `${timeAgoInHours.toString()} giờ trước`,
            }
        }

        const timeAgoInDays = differenceInDays(now, postCreatedTime)
        if (timeAgoInDays < 31) {
            return {
                ...post,
                timeAgo: `${timeAgoInDays.toString()} ngày trước`,
            }
        }

        const timeAgoInMonths = differenceInMonths(now, postCreatedTime)
        if (timeAgoInMonths < 13) {
            return {
                ...post,
                timeAgo: `${timeAgoInMonths.toString()} tháng trước`,
            }
        }

        const timeAgoInYears = differenceInYears(now, postCreatedTime)
        return {
            ...post,
            timeAgo: `${timeAgoInYears.toString()} năm trước`,
        }
    })
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
    const updatedPosts = await posts.map((post) => {
        const now = new Date()
        const postCreatedTime = new Date(post.createdAt)
        const timeAgoInMinutes = differenceInMinutes(now, postCreatedTime)
        if (timeAgoInMinutes < 61) {
            return {
                ...post,
                timeAgo: `${timeAgoInMinutes.toString()} phút trước`,
            }
        }

        const timeAgoInHours = differenceInHours(now, postCreatedTime)
        if (timeAgoInHours < 25) {
            return {
                ...post,
                timeAgo: `${timeAgoInHours.toString()} giờ trước`,
            }
        }

        const timeAgoInDays = differenceInDays(now, postCreatedTime)
        if (timeAgoInDays < 31) {
            return {
                ...post,
                timeAgo: `${timeAgoInDays.toString()} ngày trước`,
            }
        }

        const timeAgoInMonths = differenceInMonths(now, postCreatedTime)
        if (timeAgoInMonths < 13) {
            return {
                ...post,
                timeAgo: `${timeAgoInMonths.toString()} tháng trước`,
            }
        }

        const timeAgoInYears = differenceInYears(now, postCreatedTime)
        return {
            ...post,
            timeAgo: `${timeAgoInYears.toString()} năm trước`,
        }
    })
    const updatedReponse = { ...responses.data, posts: updatedPosts }
    return updatedReponse
}

export const fetchPostsBySearchKeys = async (searchKeys) => {
    const responses = await axios.get(`/posts/search?searchKeys=${searchKeys}`)
    const posts = responses.data?.matchedPosts
    if (!posts) {
        return responses.data
    }
    const updatedPosts = await posts.map((post) => {
        const now = new Date()
        const postCreatedTime = new Date(post.createdAt)
        const timeAgoInMinutes = differenceInMinutes(now, postCreatedTime)
        if (timeAgoInMinutes < 61) {
            return {
                ...post,
                timeAgo: `${timeAgoInMinutes.toString()} phút trước`,
            }
        }

        const timeAgoInHours = differenceInHours(now, postCreatedTime)
        if (timeAgoInHours < 25) {
            return {
                ...post,
                timeAgo: `${timeAgoInHours.toString()} giờ trước`,
            }
        }

        const timeAgoInDays = differenceInDays(now, postCreatedTime)
        if (timeAgoInDays < 31) {
            return {
                ...post,
                timeAgo: `${timeAgoInDays.toString()} ngày trước`,
            }
        }

        const timeAgoInMonths = differenceInMonths(now, postCreatedTime)
        if (timeAgoInMonths < 13) {
            return {
                ...post,
                timeAgo: `${timeAgoInMonths.toString()} tháng trước`,
            }
        }

        const timeAgoInYears = differenceInYears(now, postCreatedTime)
        return {
            ...post,
            timeAgo: `${timeAgoInYears.toString()} năm trước`,
        }
    })
    const updatedReponse = { ...responses.data, matchedPosts: updatedPosts }
    return updatedReponse
}
