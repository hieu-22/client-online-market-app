import React from "react"
import { Link } from "react-router-dom"
import { TbMathGreater } from "react-icons/tb"

const Breadcrumb = ({ title1, link1, title2, link2, title3, link3 }) => {
    const arrow = (
        <>
            <TbMathGreater className="text-2xs mx-1 translate-y-[1px] text-gray-400 " />
        </>
    )
    return (
        <div className={` text-xs text-text py-5 rounded font-medium `}>
            <p className="laptop:w-laptop m-auto flex items-center ">
                <span className="flex items-center ">
                    <Link
                        to={"http://localhost:3000/"}
                        className="flex items-center text-primary hover:underline cursor-pointer "
                    >
                        <span>eMarket</span>
                    </Link>
                </span>
                {title1 && !title2 ? (
                    <>
                        {arrow}
                        <span className="cursor-text ">{title1}</span>
                    </>
                ) : (
                    <></>
                )}
                {title1 && title2 ? (
                    <>
                        {arrow}
                        <Link
                            to={link1}
                            className="flex items-center text-primary hover:underline cursor-pointer "
                        >
                            <span className="">{title1}</span>
                        </Link>

                        {arrow}
                        <span className="cursor-text ">{title2}</span>
                    </>
                ) : (
                    <></>
                )}
            </p>
        </div>
    )
}

export default Breadcrumb
