import React, { useState } from "react"
import { Outlet } from "react-router-dom"
import { Link, NavLink } from "react-router-dom"
import Breadcrumb from "./Breadcrumb"
// react-icons
import { MdPostAdd } from "react-icons/md"
import { FaBell } from "react-icons/fa"
import { FiSearch } from "react-icons/fi"
import { AiFillMessage } from "react-icons/ai"

// styles
import { BgLinegradianet } from "../styles/customStyles"
import LoginForm from "../features/Auth/LoginForm"
import RegisterForm from "../features/Auth/RegisterForm"
import { useDispatch, useSelector } from "react-redux"

const Layout = () => {
    const dispatch = useDispatch()
    const [isLoggining, setIsLogining] = useState(false)
    const [isRegistering, setIsRegistering] = useState(false)

    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)

    const switchLoginUI = () => {
        setIsRegistering(false)
        setIsLogining(!isLoggining)
    }

    const switchRegisterUI = () => {
        setIsLogining(false)
        setIsRegistering(!isRegistering)
    }

    const Header = (
        <header>
            <div className=" flex justify-between items-center h-[100px] m-auto desktop:w-desktop w-100 m-auto">
                <div className=" bg-primary rounded-50 px-4 py-2 mx-4 pb-3 text-gray-100 text-xl ">
                    eMarket
                </div>
                <div className="flex items-center  w-full px-2 relative">
                    <input
                        className=" w-full rounded border-2 border-gray-300 py-2  text-sm p-1 focus:outline-4 outline-gray-400"
                        type="text"
                        placeholder="search"
                    />
                    <span className="absolute  right-1  inline-flex items-center justify-center rounded-r  bg-button h-10 w-10 bg-blue-200 hover:bg-buttonHover cursor-pointer ">
                        <FiSearch className="text-white "></FiSearch>
                    </span>
                </div>
                <div className="flex items-center gap-x-1 flex-row min-w-[320px] ml-8">
                    {isLoggedIn ? (
                        <>
                            <div className="userInfor flex items-center">
                                <span className="userImage inline-block border-2 border-primary w-8 h-8 rounded-50 mr-1 cursor-pointer"></span>
                                <span className="userName text-sm text-primary font-medium max-w-[60px] truncate cursor-pointer hover:underline">
                                    hieung180114
                                </span>
                            </div>
                            <div className="message mx-2">
                                <AiFillMessage className="fill-gray-400 w-7 h-7 hover:fill-gray-500 cursor-pointer" />
                            </div>
                            <div className="notification ml-2">
                                <FaBell className="fill-gray-400 opacity-90 w-7 h-7 hover:fill-gray-500 cursor-pointer" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div
                                className="px-2 font-medium hover:underline"
                                onClick={switchRegisterUI}
                            >
                                <NavLink>Đăng ký</NavLink>
                            </div>
                            <div
                                className="px-2 font-medium hover:underline"
                                onClick={switchLoginUI}
                            >
                                <NavLink>Đăng nhập</NavLink>
                            </div>
                        </>
                    )}

                    <div className={`px-2 ${BgLinegradianet()} rounded`}>
                        <NavLink className="flex items-center  p-2  text-white">
                            <MdPostAdd className="scale-1.75" />
                            <span className="ml-2 hover:underline">
                                Đăng bán
                            </span>
                        </NavLink>
                    </div>
                </div>
            </div>
        </header>
    )

    const Footer = (
        <footer>
            <div className=" bg-neutral-700 py-6 text-gray-300">
                <div className="desktop:w-desktop  m-auto">
                    <div className="flex items-center">
                        <Link
                            to=""
                            className="hover:underline hover:text-gray-400"
                        >
                            Trang chủ
                        </Link>
                        <span className="px-2"> | </span>
                        <Link
                            to=""
                            className="hover:underline hover:text-gray-400"
                        >
                            Hướng dẫn & Hỗ trợ
                        </Link>
                        <span className="px-2"> | </span>
                        <Link
                            to=""
                            className="hover:underline hover:text-gray-400"
                        >
                            Nội quy & quy chế
                        </Link>
                    </div>
                    <div className="grid grid-cols-4 py-4 text-sm">
                        <ul>
                            <li className="py-2">
                                <Link
                                    to=""
                                    className="hover:underline hover:text-gray-400"
                                >
                                    Điện thoại
                                </Link>
                            </li>
                            <li className="py-2">
                                <Link
                                    to=""
                                    className="hover:underline hover:text-gray-400"
                                >
                                    Điện thoại Android
                                </Link>
                            </li>
                            <li className="py-2">
                                <Link
                                    to=""
                                    className="hover:underline hover:text-gray-400"
                                >
                                    Iphone
                                </Link>
                            </li>
                        </ul>
                        <ul>
                            <li className="py-2">
                                <Link
                                    to=""
                                    className="hover:underline hover:text-gray-400"
                                >
                                    Điện thoại phổ thông
                                </Link>
                            </li>
                            <li className="py-2">
                                <Link
                                    to=""
                                    className="hover:underline hover:text-gray-400"
                                >
                                    Phụ kiện điện thoại
                                </Link>
                            </li>
                            <li className="py-2">
                                <Link
                                    to=""
                                    className="hover:underline hover:text-gray-400"
                                >
                                    Iphone cũ
                                </Link>
                            </li>
                        </ul>
                        <ul>
                            <li className="py-2">
                                <Link
                                    to=""
                                    className="hover:underline hover:text-gray-400"
                                >
                                    Laptop
                                </Link>
                            </li>
                            <li className="py-2">
                                <Link
                                    to=""
                                    className="hover:underline hover:text-gray-400"
                                >
                                    Ultrabook
                                </Link>
                            </li>
                            <li className="py-2">
                                <Link
                                    to=""
                                    className="hover:underline hover:text-gray-400"
                                >
                                    Workstation
                                </Link>
                            </li>
                        </ul>
                        <ul>
                            <li className="py-2">
                                <Link
                                    to=""
                                    className="hover:underline hover:text-gray-400"
                                >
                                    Camera
                                </Link>
                            </li>
                            <li className="py-2">
                                <Link
                                    to=""
                                    className="hover:underline hover:text-gray-400"
                                >
                                    Phụ kiện camera
                                </Link>
                            </li>
                            <li className="py-2">
                                <Link
                                    to=""
                                    className="hover:underline hover:text-gray-400"
                                >
                                    Ống kính
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="bg-neutral-800 text-gray-300 py-4">
                <div className="desktop:w-desktop m-auto text-sm flex flex-col items-center">
                    <p>©2023 by Nguyen Minh Hieu</p>
                    <p>
                        Email:{" "}
                        <a
                            className="hover:underline"
                            href="mailto:hieung180114@gmail.com"
                        >
                            hieung180114@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    )

    return (
        <>
            {isLoggining ? (
                <div className="absolute top-0 left-0 right-0 bottom-0 min-h-[200rem] z-40  bg-black/40">
                    {" "}
                    <LoginForm
                        closeUI={switchLoginUI}
                        toRegisterForm={switchRegisterUI}
                    />
                </div>
            ) : (
                <></>
            )}
            {isRegistering ? (
                <div className="absolute top-0 left-0 right-0 bottom-0 min-h-[200rem] z-40  bg-black/40">
                    {" "}
                    <RegisterForm
                        closeUI={switchRegisterUI}
                        toLoginForm={switchLoginUI}
                    />
                </div>
            ) : (
                <></>
            )}
            <>
                {Header}

                <Outlet />
                {Footer}
            </>
        </>
    )
}

export default Layout
