import React from "react"
import { Link } from "react-router-dom"
import { AiOutlineHome } from "react-icons/ai"
import { BgLinegradianet } from "../styles/customStyles"
import { TbMathGreater } from "react-icons/tb"

const Breadcrumb = ({ title1, title2, title3 }) => {
    const arrow = (
        <>
            <TbMathGreater className="text-xs mx-2" />
        </>
    )
    return (
        <div
            className={`breadcrumb text-gray-600 pt-[10px] pb-1 px-2 rounded bg-gray-200 `}
        >
            <p className="desktop:w-desktop m-auto flex items-center text-sm">
                <span className="flex items-center ">
                    <Link
                        to={""}
                        className="flex items-center font-medium hover:text-primary hover:underline cursor-pointer "
                    >
                        <AiOutlineHome className="w-[28px] h-[28px] translate-y-[-4px]"></AiOutlineHome>
                        <span>eMarket</span>
                    </Link>
                </span>
                {title1 ? (
                    <>
                        {arrow}
                        <span>
                            <Link
                                to=""
                                className=" font-medium hover:text-primary hover:underline cursor-pointer"
                            >
                                {title1}
                            </Link>
                        </span>
                    </>
                ) : (
                    <></>
                )}
                {title2 ? (
                    <>
                        {arrow}
                        <span>
                            <Link
                                to=""
                                className=" font-medium hover:text-primary hover:underline cursor-pointer"
                            >
                                {title2}
                            </Link>
                        </span>
                    </>
                ) : (
                    <></>
                )}
                {title3 ? (
                    <>
                        {arrow}
                        <span>
                            <Link
                                to=""
                                className=" font-medium hover:text-primary hover:underline cursor-pointer"
                            >
                                {title3}
                            </Link>
                        </span>
                    </>
                ) : (
                    <></>
                )}
            </p>
        </div>
    )
}

export default Breadcrumb
