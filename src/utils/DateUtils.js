import {
    differenceInHours,
    differenceInMinutes,
    differenceInDays,
    differenceInMonths,
    differenceInYears,
    format,
    differenceInSeconds,
} from "date-fns"

export const addTimeAgo = async (array, itemProp) => {
    const updatedArray = await array.map((item) => {
        const now = new Date()
        const from = new Date(item[itemProp])

        const timeAgoInMinutes = differenceInMinutes(now, from)
        if (timeAgoInMinutes < 61) {
            return {
                ...item,
                timeAgo: `${timeAgoInMinutes.toString()} phút trước`,
            }
        }

        const timeAgoInHours = differenceInHours(now, from)
        if (timeAgoInHours < 25) {
            return {
                ...item,
                timeAgo: `${timeAgoInHours.toString()} giờ trước`,
            }
        }

        const timeAgoInDays = differenceInDays(now, from)
        if (timeAgoInDays < 31) {
            return {
                ...item,
                timeAgo: `${timeAgoInDays.toString()} ngày trước`,
            }
        }

        const timeAgoInMonths = differenceInMonths(now, from)
        if (timeAgoInMonths < 13) {
            return {
                ...item,
                timeAgo: `${timeAgoInMonths.toString()} tháng trước`,
            }
        }

        const timeAgoInYears = differenceInYears(now, from)
        return {
            ...item,
            timeAgo: `${timeAgoInYears.toString()} năm trước`,
        }
    })
    return updatedArray
}
export const toTimeAgo = (timeStamp) => {
    const now = new Date()
    const from = new Date(timeStamp)

    const timeAgoInSeconds = differenceInSeconds(now, from)
    if (timeAgoInSeconds < 61) {
        if (timeAgoInSeconds === 0) return `1 giây trước`
        return `${timeAgoInSeconds} giây trước`
    }

    const timeAgoInMinutes = differenceInMinutes(now, from)
    if (timeAgoInMinutes < 61) {
        if (timeAgoInMinutes === 0) return `1 phút trước`
        return `${timeAgoInMinutes} phút trước`
    }

    const timeAgoInHours = differenceInHours(now, from)
    if (timeAgoInHours < 25) {
        return `${timeAgoInHours} giờ trước`
    }

    const timeAgoInDays = differenceInDays(now, from)
    if (timeAgoInDays < 31) {
        return `${timeAgoInDays} ngày trước`
    }

    const timeAgoInMonths = differenceInMonths(now, from)
    if (timeAgoInMonths < 13) {
        return `${timeAgoInMonths} tháng trước`
    }

    const timeAgoInYears = differenceInYears(now, from)
    return `${timeAgoInYears} năm trước`
}
export const formatToString = (timeStamp, type) => {
    const date = new Date(timeStamp)

    const formattedDate = format(date, type)

    return formattedDate
}