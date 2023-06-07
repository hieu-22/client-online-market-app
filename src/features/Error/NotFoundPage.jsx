import React from "react"
import { TbError404 } from "react-icons/tb"

const NotFoundPage = () => {
    return (
        <div className="laptop:w-laptop m-auto py-[20vh] flex flex-col items-center">
            <div className="">
                <TbError404 className="w-[160px] h-[160px] text-gray-600" />
            </div>
            <h1 className="text-lg">Oops! Something went wrong.</h1>
            <p className="text-lg">
                We apologize for the inconvenience. Please try again later.
            </p>
        </div>
    )
}

export default NotFoundPage
