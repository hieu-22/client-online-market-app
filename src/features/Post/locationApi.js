import axios from "../../axios"

export const getProvices = async () => {
    const response = await axios.get("https://vapi.vnappmob.com/api/province/")
    return response.data.results
}

export const getDistricts = async (id) => {
    const response = await axios.get(
        `https://vapi.vnappmob.com//api/province/district/${id}`
    )
    return response.data.results
}

export const getWards = async (id) => {
    const response = await axios.get(
        `https://vapi.vnappmob.com//api/province/ward/${id}`
    )
    return response.data.results
}

export const addPost = async (post) => {
    const response = await axios.post("/posts/add-post", post)
    console.log(">>> At addPost, response: ", response)
    return response.data
}
