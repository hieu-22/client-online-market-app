import axios from "axios"

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
})

instance.interceptors.request.use(
    (config) => {
        // Add authentication token to the request headers
        const auth = JSON.parse(localStorage.getItem("persist:auth"))
        if (auth) {
            const token = auth.token.replaceAll('"', "")
            // console.log("===> token: ", token)

            config.headers.token = `Bearer ${token}`
        }

        return config
    },
    (error) => Promise.reject(error)
)

export default instance
