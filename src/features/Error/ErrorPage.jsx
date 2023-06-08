import React from "react"

const ErrorPage = ({ statusCode, message }) => {
    return (
        <div className="bg-customWhite">
            <div className="laptop:w-laptop m-auto h-screen flex items-center justify-center gap-x-16 translate-y-[-10%]">
                <div className="text-[160px] text-gray-500 font-mono">
                    {statusCode}
                </div>
                <div className="h-[100px] flex flex-col justify-end">
                    <div className="text-[36px] text-gray-500">{message}</div>
                    <div className="text-gray-500">
                        Please, try again later!
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ErrorPage
