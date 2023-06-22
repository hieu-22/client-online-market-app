import { io } from "socket.io-client"

// "undefined" means the URL will be computed from the `window.location` object
const URL =
    process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_BACKEND_URL
        : "http://localhost:3001"

export const socket = io(URL, {
    autoConnect: false,
    transports: ["websocket", "pooling"],
})
