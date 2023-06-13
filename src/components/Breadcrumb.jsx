import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { TbMathGreater } from "react-icons/tb"

const Breadcrumb = ({
    title1,
    link1,
    title2,
    link2,
    title3,
    link3,
    className,
}) => {
    const arrow = (
        <>
            <TbMathGreater className="text-2xs mx-1 translate-y-[1px] text-gray-400 " />
        </>
    )
    // -- HANDLE DEVICE TYPE
    const [deviceType, setDeviceType] = useState(null)
    useEffect(() => {
        handleSetDeviceType()
    }, [])
    useEffect(() => {
        window.addEventListener("resize", handleSetDeviceType)
        return () => {
            window.addEventListener("resize", handleSetDeviceType)
        }
    }, [])
    const handleSetDeviceType = () => {
        const width = window.innerWidth
        if (width < 576) {
            setDeviceType("smallMobile")
        } else if (width >= 576 && width < 786) {
            setDeviceType("mobile")
        } else if (width >= 786 && width < 1024) {
            setDeviceType("tablet")
        } else if (width >= 1024 && width < 1280) {
            setDeviceType("laptop")
        } else {
            setDeviceType("desktop")
        }
    }
    return (
        <div
            className={`${
                deviceType === "desktop" || deviceType === "laptop"
                    ? "max-w-[1024px]"
                    : "w-[100%]"
            } 
                ${deviceType === "desktop" ? "px-0" : "px-6"}
                }
            m-auto text-xs text-text pt-5 pb-2 rounded font-medium ${className}`}
        >
            <p className={` flex items-center `}>
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
                        <span className="cursor-text line-clamp-1">
                            {title1}
                        </span>
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
                            <span className="line-clamp-1">{title1}</span>
                        </Link>

                        {arrow}
                        <span className="cursor-text line-clamp-1">
                            {title2}
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
