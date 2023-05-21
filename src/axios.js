import axios from "axios"

const instance = axios.create({
    baseURL: "http://localhost:3001/api",
})

instance.interceptors.request.use(
    (config) => {
        // Add authentication token to the request headers
        const auth = JSON.parse(localStorage.getItem("persist:auth"))
        const token = auth.token.replaceAll('"', "")
        // console.log("===> token: ", token)

        config.headers.token = `Bearer ${token}`

        return config
    },
    (error) => Promise.reject(error)
)

export default instance
