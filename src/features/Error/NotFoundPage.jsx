import React from "react"
import { TbError404 } from "react-icons/tb"
import { Link } from "react-router-dom"

const NotFoundPage = () => {
    return (
        <div className="laptop:w-laptop m-auto py-[20vh] flex flex-col items-center">
            <div className="">
                <TbError404 className="w-[160px] h-[160px] text-gray-600" />
            </div>
            <h1 className="text-lg">Oops! Không tìm thấy trang phù hợp</h1>
            <Link
                to={"/"}
                className="text-base text-primary hover:text-slate-300 hover:underline"
            >
                Trở về trang chủ
            </Link>
        </div>
    )
}

export default NotFoundPage
