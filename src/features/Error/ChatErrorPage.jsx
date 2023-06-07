import React from "react"
import { TbError404 } from "react-icons/tb"
import { Link } from "react-router-dom"

const ChatErrorPage = ({ statusCode, message }) => {
    return (
        <div className="bg-customWhite">
            <div className="laptop:w-laptop m-auto py-[20vh] flex items-center justify-around">
                <div className="text-[200px] text-gray-500 font-mono">
                    {statusCode}
                </div>
                <div className="">
                    <p className="text-[26px] text-gray-500">{message}</p>
                    <Link
                        className="text-primary hover:text-slate-300 hover:underline"
                        to={"/chat"}
                    >
                        Go chat
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ChatErrorPage
