import React from "react"

const UnreachableServerErrorPage = ({ statusCode, message }) => {
    return (
        <div className="bg-customWhite">
            <div className="laptop:w-laptop m-auto py-[20vh] flex items-center justify-around">
                <div className="text-[200px] text-gray-500 font-mono">
                    {statusCode}
                </div>
                <div className="">
                    <p className="text-[26px] text-gray-500">{message}</p>
                    <p className="text-[26px] text-gray-500">
                        Please, try again later!
                    </p>
                </div>
            </div>
        </div>
    )
}

export default UnreachableServerErrorPage
