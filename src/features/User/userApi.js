import axios from "../../axios"
import {
    differenceInHours,
    differenceInMinutes,
    differenceInDays,
    differenceInMonths,
    differenceInYears,
} from "date-fns"

export const getUserById = async (userId) => {
    const response = await axios.get(`/user/${userId}`)
    const user = response.data.user
    const updatedPosts = await user.posts.map((post) => {
        const now = new Date()
        const postCreatedTime = new Date(post.createdAt)
        const timeAgoInMinutes = differenceInMinutes(now, postCreatedTime)
        if (timeAgoInMinutes < 61) {
            return {
                ...post,
                timeAgo: `${timeAgoInMinutes.toString()} phút`,
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
    const updatedUser = { ...user, posts: updatedPosts }
    return updatedUser
}

export const getOtherUsers = async (userId) => {
    const response = await axios.get(`user/get-other-users?userId=${userId}`)
    return response.data.users
}
