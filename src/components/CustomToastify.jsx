import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Slide, ToastContainer, Zoom, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const CustomToastify = ({ status }) => {
    const dispatch = useDispatch()

    // const Msg = ({ closeToast, toastProps }) => <span>error here</span>
    // useEffect(() => {
    //     toast.warn(<Msg />)
    // }, [])
    return (
        <ToastContainer
            position="top-right"
            autoClose={1000}
            limit={1}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            transition={Slide}
            theme="light"
        />
    )
}

export default CustomToastify
