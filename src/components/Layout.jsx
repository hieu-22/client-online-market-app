import React, { useState, useEffect } from "react"
import {
    Outlet,
    useNavigate,
    useLocation,
    Link,
    NavLink,
    ScrollRestoration,
} from "react-router-dom"

// react-icons
import { MdPostAdd } from "react-icons/md"
import { FiSearch } from "react-icons/fi"
import { BiUser, BiBell, BiChat, BiUserCircle } from "react-icons/bi"
import { AiFillControl, AiFillWechat, AiFillBell } from "react-icons/ai"
import { MdHelpCenter } from "react-icons/md"
import { AiFillHeart, AiFillSetting } from "react-icons/ai"
import { BsFillBookmarkFill, BsStarFill } from "react-icons/bs"
import { RiPencilFill } from "react-icons/ri"
import { RxTriangleDown, RxExit } from "react-icons/rx"
import { FaUserCircle } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { FaUserFriends } from "react-icons/fa"
//
import CustomToastify from "./CustomToastify"
import ErrorPage from "../features/Error/ErrorPage"

// redux
import {
    logout,
    selectAuthError,
    selectError,
} from "../features/Auth/authSlice"
import {
    selectPostError,
    fetchPostsBySearchKeysThunk,
} from "../features/Post/postSlice"
import { selectChatError } from "../features/Chat/chatSlice"
import { selectUserError } from "../features/User/userSlice"

import { selectLocationError } from "../features/Post/locationSlice"
import { selectSearchedPosts } from "../features/Post/postSlice"
import Loader from "./Loader"
import { ToastContainer, toast } from "react-toastify"

import {
    selectAuthStatus,
    updateUserIsOnline,
} from "../features/Auth/authSlice"
import { socket } from "../socket"
const Layout = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    // COMPONENT'S STATES
    const [isfullScreenAndNoScroll, setIsfullScreenAndNoScroll] = useState(null)
    const [isAccountWindowShowed, setIsAccountWindowShowed] = useState(false)
    const [isNotificationWindowShowed, setIsNotificationWindowShowed] =
        useState(false)
    const [Loading, setLoading] = useState(false)
    const [footerHidden, setFooterHidden] = useState(false)
    const [searchkeys, setSearchKeys] = useState("")
    const [notificationWindowStatus, setNotificationWindowStatus] =
        useState("onActivities") // onActivities or onNews
    const [searchHintsShowed, setSearchHintsShowed] = useState(false)
    const [isToastActive, setIsToastActive] = useState(false)

    // REDUX STATES
    const user = useSelector((state) => state.auth.user)
    const followingUsers = user?.followingUsers
    const followers = user?.followers
    const authStatus = useSelector(selectAuthStatus)
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
    const searchedPosts = useSelector(selectSearchedPosts)
    const authError = useSelector(selectAuthError)
    const chatError = useSelector(selectChatError)
    const userError = useSelector(selectUserError)
    const postError = useSelector(selectPostError)

    // EFFECTS
    // + navigate to add phoneNumber page if user don't have phoneNumber
    useEffect(() => {
        if (user) {
            if (!user.phoneNumber) {
                navigate("/add-phone-number")
            }
        }
    }, [user])
    useEffect(() => {
        setIsAccountWindowShowed(false)
        setIsNotificationWindowShowed(false)
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 200)
    }, [location.pathname])

    useEffect(() => {
        socket.on("updateIsOnline", () => {
            if (user?.isOnline) return
            dispatch(updateUserIsOnline())
        })
        return () => {
            socket.off("updateIsOnline")
        }
    }, [])
    useEffect(() => {
        const currentUrl = window.location.href
        if (currentUrl.startsWith("http://localhost:3000/chat")) {
            setFooterHidden(true)
            setIsfullScreenAndNoScroll(true)
            return
        }
        setFooterHidden(false)
        setIsfullScreenAndNoScroll(false)
    }, [location.pathname])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [location.pathname])

    useEffect(() => {
        let timerId
        ;(async () => {
            // Cancel any previous timer
            clearTimeout(timerId)
            // Set a new timer to trigger the API call after a certain delay (e.g., 500ms)
            timerId = setTimeout(async () => {
                const res = await dispatch(
                    fetchPostsBySearchKeysThunk(searchkeys)
                ).unwrap()
            }, 500)
        })()
        // Cleanup function to cancel the timer if the component is unmounted or query changes
        return () => clearTimeout(timerId)
    }, [searchkeys])

    /**HANDLERS */
    const handleShowToast = (message, status) => {
        if (!isToastActive) {
            if (status === "info") {
                toast.info(message, {
                    autoClose: 1000,
                })
            } else if (status === "warn") {
                toast.warn(message, {
                    autoClose: 1000,
                })
            } else if (status === "error") {
                toast.error(message, {
                    autoClose: 1000,
                })
            } else {
                toast(message, {
                    autoClose: 1000,
                })
            }

            setIsToastActive(true)
            setTimeout(() => {
                setIsToastActive(false)
            }, 3000)
        }
    }
    const handleReload = () => {
        window.location.reload()
    }

    const handleCloseAllWindows = (event) => {
        if (
            isAccountWindowShowed ||
            isNotificationWindowShowed ||
            searchHintsShowed
        ) {
            setIsAccountWindowShowed(false)
            setIsNotificationWindowShowed(false)
            setSearchHintsShowed(false)
        }
    }

    const handleShowAccountWindow = (event) => {
        event.stopPropagation()
        setIsNotificationWindowShowed(false)
        setIsAccountWindowShowed(!isAccountWindowShowed)
    }

    const handleShowNotificationWindow = (event) => {
        event.stopPropagation()
        setIsAccountWindowShowed(false)
        setIsNotificationWindowShowed(!isNotificationWindowShowed)
    }

    const handleAddNewPost = () => {
        if (!isLoggedIn) {
            if (window.location.href === "http://localhost:3000/login") {
                return handleShowToast("Vui lòng đăng nhập!")
            }
            return navigate("/login")
        }
        navigate("/posts/new-post")
    }

    const handleLogout = async () => {
        socket.disconnect()
        dispatch(logout())
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 200)
        setIsAccountWindowShowed(false)
        navigate("/")
    }

    /*Components */
    const LogoBox = (
        <div
            className=""
            onClick={() => {
                if (window.location.href === "http://localhost:3000/") {
                    return handleReload()
                }
                navigate("/")
            }}
        >
            <div className="relative cursor-pointer select-none rounded-50 py-2  text-primary text-2xl font-extrabold">
                <span>eMarket</span>
            </div>
        </div>
    )
    const AccountWindow = (
        <div
            className="bg-white z-[9999] absolute top-10 right-0 w-[300px] py-2 shadow-boxMd"
            onClick={(event) => {
                event.stopPropagation()
            }}
        >
            <div className="flex items-center justify-start pt-2 pb-3  px-4">
                {isLoggedIn ? (
                    <>
                        <div className="cursor-pointer flex items-center gap-x-4">
                            <div
                                className={`relative h-10 w-10 rounded-[50%] `}
                            >
                                {user?.avatar ? (
                                    <img
                                        className="w-full h-full object-cover rounded-[50%]"
                                        src={user.avatar}
                                        alt="avatar"
                                    />
                                ) : (
                                    <>
                                        <FaUserCircle className="w-full h-full text-gray-600 rounded-[50%]"></FaUserCircle>
                                    </>
                                )}
                                <div
                                    className="absolute bottom-0 -right-1 flex items-center justify-center z-10 h-5 w-5 rounded-[50%] bg-gray-500 hover:scale-[1.1]"
                                    onClick={() => {
                                        navigate("/user/setting/profile")
                                    }}
                                >
                                    <RiPencilFill className="h-3 w-3 text-white" />
                                </div>
                            </div>
                            <div className="flex-1  ">
                                <div
                                    className="text-base font-medium hover:opacity-70 truncate"
                                    onClick={(event) => {
                                        handleCloseAllWindows()
                                        const currentUrl = location.pathname
                                        if (!isLoggedIn) {
                                            if (
                                                window.location.href ===
                                                "http://localhost:3000/login"
                                            ) {
                                                return handleShowToast(
                                                    "Vui lòng đăng nhập"
                                                )
                                            }
                                            return navigate("/login")
                                        }
                                        if (
                                            currentUrl.startsWith(
                                                "http://localhost:3000/user/myProfile"
                                            )
                                        ) {
                                            return
                                        }
                                        navigate(`/user/myProfile`)
                                    }}
                                >
                                    {user?.userName ? user.userName : ""}
                                </div>

                                <div className=" inline-flex items-center text-2xs">
                                    <div className="font-medium hover:opacity-70">
                                        Người theo dõi{" "}
                                        <span className="font-bold ml-1">
                                            {followers?.length || 0}
                                        </span>
                                    </div>
                                    <span className="px-2">|</span>
                                    <div className="font-medium hover:opacity-70">
                                        Đang theo dõi{" "}
                                        <span className="font-bold ml-1">
                                            {followingUsers?.length || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="">
                            <BiUserCircle className="m-auto w-10 h-10 object-contain text-text" />
                        </div>
                        <div className="ml-3 text-lg font-semibold">
                            <NavLink
                                to={"/login"}
                                className="hover:underline hover:text-primary cursor-pointer"
                            >
                                Đăng nhập
                            </NavLink>
                            /{" "}
                            <NavLink
                                to={"/register"}
                                className="hover:underline hover:text-primary cursor-pointer"
                            >
                                Đăng ký
                            </NavLink>
                        </div>
                    </>
                )}
                <div></div>
            </div>

            {/* Quản lí đơn */}
            {/* <div>
                <div className="px-3 py-1 bg-primary text-base text-white font-semibold">
                    Quản lí đơn hàng
                </div>
                <div className="flex items-center gap-x-2 py-2 px-4 bg-stale hover:bg-background cursor-pointer">
                    <div className="flex items-center justify-center w-6 h-6 rounded-[50%] bg-blue-400">
                        <GiShoppingBag className="text-white" />
                    </div>
                    <div className="font-light">Đơn mua</div>
                </div>
                <div className="flex items-center gap-x-2 py-2 px-4 bg-stale hover:bg-background cursor-pointer">
                    <div className="flex items-center justify-center w-6 h-6 rounded-[50%] bg-green-500">
                        <MdStickyNote2 className="text-white" />
                    </div>
                    <div className="font-light">Đơn bán</div>
                </div>
            </div> */}
            {/* Tiện ích    */}
            <div>
                <div className="px-3 py-1 bg-primary text-base text-white font-semibold">
                    Tiện ích
                </div>
                <div
                    className="flex items-center gap-x-2 py-2 px-4 bg-stale hover:bg-background cursor-pointer"
                    onClick={() => {
                        if (!isLoggedIn) {
                            if (
                                window.location.href ===
                                "http://localhost:3000/login"
                            ) {
                                return handleShowToast("Vui lòng đăng nhập")
                            }
                            return navigate("/login")
                        }
                        navigate("/posts/my-saved-posts")
                    }}
                >
                    <div className="flex items-center justify-center w-6 h-6 rounded-[50%] bg-red-500">
                        <AiFillHeart className="text-white" />
                    </div>
                    <div className="font-light">Tin đăng đã lưu</div>
                </div>
                <div
                    className="flex items-center gap-x-2 py-2 px-4 bg-stale hover:bg-background cursor-pointer"
                    onClick={() => {
                        if (!isLoggedIn) {
                            if (
                                window.location.href ===
                                "http://localhost:3000/login"
                            ) {
                                return handleShowToast("Vui lòng đăng nhập")
                            }
                            return navigate("/login")
                        }
                        handleShowToast("Chức năng đang cập nhật!", "info")
                    }}
                >
                    <div className="flex items-center justify-center w-6 h-6 rounded-[50%] bg-blue-400">
                        <BsFillBookmarkFill className="text-white scale-[0.85]" />
                    </div>
                    <div className="font-light">Tìm kiếm đã lưu</div>
                </div>
                <div
                    className="flex items-center gap-x-2 py-2 px-4 bg-stale hover:bg-background cursor-pointer"
                    onClick={() => {
                        if (!isLoggedIn) {
                            if (
                                window.location.href ===
                                "http://localhost:3000/login"
                            ) {
                                return handleShowToast("Vui lòng đăng nhập")
                            }
                            return navigate("/login")
                        }
                        handleShowToast("Chức năng đang cập nhật!", "info")
                    }}
                >
                    <div
                        className="flex items-center justify-center w-6 h-6 rounded-[50%] bg-yellow-500"
                        onClick={() => {
                            if (!isLoggedIn) {
                                if (
                                    window.location.href ===
                                    "http://localhost:3000/login"
                                ) {
                                    return handleShowToast("Vui lòng đăng nhập")
                                }
                                return navigate("/login")
                            }
                            handleShowToast("Chức năng đang cập nhật!", "info")
                        }}
                    >
                        <BsStarFill className="text-white" />
                    </div>
                    <div className="font-light">Đánh giá từ tôi</div>
                </div>
            </div>
            {/* Khác */}
            <div>
                <div className="px-3 py-1 bg-primary text-base text-white font-semibold">
                    Khác
                </div>
                <div
                    className="flex items-center gap-x-2 py-2 px-4 bg-stale hover:bg-background cursor-pointer"
                    onClick={() => {
                        if (!isLoggedIn) {
                            if (
                                window.location.href ===
                                "http://localhost:3000/login"
                            ) {
                                return handleShowToast("Vui lòng đăng nhập")
                            }
                            return navigate("/login")
                        }
                        navigate("user/setting/profile")
                    }}
                >
                    <div className="flex items-center justify-center w-6 h-6 rounded-[50%] bg-gray-400">
                        <AiFillSetting className="text-white" />
                    </div>
                    <div className="font-light">Cài đặt tài khoản</div>
                </div>
                <div
                    className="flex items-center gap-x-2 py-2 px-4 bg-stale hover:bg-background cursor-pointer"
                    onClick={() => {
                        if (!user) {
                            return navigate("/login")
                        }
                        handleShowToast("Chức năng đang cập nhật!", "info")
                    }}
                >
                    <div className="flex items-center justify-center w-6 h-6 rounded-[50%]  bg-gray-400">
                        <MdHelpCenter className="text-white" />
                    </div>
                    <div className="font-light">Trợ giúp</div>
                </div>
                {isLoggedIn ? (
                    <div
                        className="flex items-center gap-x-2 py-2 px-4 bg-stale hover:bg-background cursor-pointer"
                        onClick={handleLogout}
                    >
                        <div className="flex items-center justify-center w-6 h-6 rounded-[50%]  bg-gray-400">
                            <RxExit className="text-white" />
                        </div>
                        <div className="font-light">Đăng xuất</div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    )
    const NotificationWindow = (
        <div
            className="bg-white z-10 absolute top-10 right-0 w-[360px] shadow-boxMd"
            onClick={(event) => {
                event.stopPropagation()
            }}
        >
            <div className="flex items-center border-b-[1px] border-gray-600">
                <div
                    className={`${
                        notificationWindowStatus === "onActivities"
                            ? " border-primary border-b-2"
                            : ""
                    }  py-3 w-6/12 text-center text-base font-semibold cursor-pointer hover:bg-blue-100`}
                    onClick={() => setNotificationWindowStatus("onActivities")}
                >
                    Hoạt động
                </div>
                <div
                    className={`${
                        notificationWindowStatus === "onNews"
                            ? " border-primary border-b-2"
                            : ""
                    } py-3 w-6/12 text-center  text-base font-semibold cursor-pointer  hover:bg-blue-100`}
                    onClick={() => setNotificationWindowStatus("onNews")}
                >
                    Tin mới
                </div>
            </div>
            {notificationWindowStatus === "onActivities" ? (
                <>
                    {user ? (
                        <div className="p-3">
                            <div className="text-center">
                                Chức năng đang được cập nhật!
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="p-3">
                                <div className="text-center">
                                    Vui lòng đăng nhập để xem hoạt động
                                </div>
                            </div>
                            <div
                                className="py-3 flex justify-center"
                                onClick={() => {
                                    navigate("/login")
                                }}
                            >
                                <span className="text-white bg-primary text-base font-semibold py-2 px-3 rounded-md hover:opacity-70 active:opacity-100 cursor-pointer">
                                    Đăng ký/Đăng nhập
                                </span>
                            </div>
                        </>
                    )}
                </>
            ) : (
                <></>
            )}
            {notificationWindowStatus === "onNews" ? (
                <>
                    {user ? (
                        <div className="p-3">
                            <div className="text-center">
                                Hiện bạn không có cập nhật nào
                            </div>
                        </div>
                    ) : (
                        <div className="p-3">
                            <div className="text-center">
                                Hiện bạn không có cập nhật nào
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <></>
            )}
        </div>
    )

    const Navbar = (
        <nav>
            <ul className="flex items-center justify-around gap-x-8">
                <li className="">
                    <div
                        className="flex items-center gap-x-1 hover:opacity-70 cursor-pointer "
                        onClick={() => {
                            if (!isLoggedIn) {
                                if (
                                    window.location.href ===
                                    "http://localhost:3000/login"
                                ) {
                                    return handleShowToast("Vui lòng đăng nhập")
                                }
                                return navigate("/login")
                            }
                            navigate("/dashboard/posts")
                        }}
                    >
                        <div className="">
                            <AiFillControl className="w-6 h-6 text-slate-700" />
                        </div>
                        <div className="text-text">Quản lí tin</div>
                    </div>
                </li>
                <li className="">
                    <div
                        className="flex items-center gap-x-1 hover:opacity-70 cursor-pointer "
                        onClick={() => {
                            if (!isLoggedIn) {
                                if (
                                    window.location.href ===
                                    "http://localhost:3000/login"
                                ) {
                                    return handleShowToast("Vui lòng đăng nhập")
                                }
                                return navigate("/login")
                            }
                            navigate("/users")
                        }}
                    >
                        <div className="">
                            <FaUserFriends className="w-6 h-6 text-slate-700 " />
                        </div>
                        <div className="text-text">Người dùng</div>
                    </div>
                </li>
                <li className="">
                    <div
                        className="flex items-center gap-x-1 hover:opacity-70 cursor-pointer"
                        onClick={() => {
                            if (!isLoggedIn) {
                                if (
                                    window.location.href ===
                                    "http://localhost:3000/login"
                                ) {
                                    return handleShowToast("Vui lòng đăng nhập")
                                }

                                return navigate("/login")
                            }
                            navigate("/chat")
                        }}
                    >
                        <div className="">
                            <AiFillWechat className="w-7 h-7 text-slate-700" />
                        </div>
                        <div className="text-text">Chat</div>
                    </div>
                </li>
                <li className="relative">
                    <div
                        className="flex items-center gap-x-1 hover:opacity-70 cursor-pointer"
                        onClick={(event) => handleShowNotificationWindow(event)}
                    >
                        <div className="">
                            <AiFillBell className="w-6 h-6 text-slate-700" />
                        </div>
                        <div className="text-text">Thông báo</div>
                    </div>
                    {isNotificationWindowShowed ? NotificationWindow : <></>}
                </li>
                <li className="relative  ">
                    <div
                        className="flex items-center gap-x-1  hover:opacity-70 cursor-pointer"
                        onClick={(event) => handleShowAccountWindow(event)}
                    >
                        {isLoggedIn ? (
                            <>
                                <div className="inline-flex items-center gap-x-1">
                                    <div className="w-6 h-6 rounded-[50%]">
                                        {user?.avatar ? (
                                            <img
                                                className="w-full h-full object-cover rounded-[50%]"
                                                src={user.avatar}
                                                alt="avatar"
                                            />
                                        ) : (
                                            <>
                                                <FaUserCircle className="w-full h-full text-gray-600 rounded-[50%]"></FaUserCircle>
                                            </>
                                        )}
                                    </div>
                                    <div className="text-text">
                                        {user?.userName ? user.userName : ""}
                                    </div>
                                    <div>
                                        <RxTriangleDown />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <BiUser className="w-6 h-6 " />
                                </div>
                                <div className="text-text  ">Tài khoản</div>
                            </>
                        )}
                    </div>
                    {isAccountWindowShowed ? AccountWindow : <></>}
                </li>
            </ul>
        </nav>
    )

    const Header = (
        <header className=" h-full bg-background ">
            <div className="">
                <div className="laptop:w-laptop  m-auto flex justify-between items-center py-4 ">
                    {LogoBox}
                    {Navbar}
                </div>
            </div>

            <div
                className=" flex justify-between items-center mx-auto laptop:w-laptop w-100 "
                onClick={(event) => {
                    event.stopPropagation()
                }}
            >
                <div className="flex items-center  w-full relative">
                    <input
                        className="px-4 w-full rounded border-[1px] border-gray-200 shadow-boxMd py-2  text-sm p-1 focus:outline-4 outline-primary"
                        type="text"
                        placeholder="Tìm kiếm bài đăng . . ."
                        name="searchkey"
                        value={searchkeys}
                        onChange={(event) => {
                            setSearchKeys(event.target.value)
                        }}
                        onFocus={() => {
                            if (!searchHintsShowed) {
                                setSearchHintsShowed(true)
                            }
                        }}
                    />
                    <span className="absolute  right-0  inline-flex items-center justify-center  rounded-r  bg-button h-9 w-9 bg-primary active:opacity-80 cursor-pointer ">
                        <FiSearch className="text-white "></FiSearch>
                    </span>
                    {searchHintsShowed ? (
                        <div
                            className="absolute z-20 top-[40px] shadow-big w-full bg-white rounded-sm pb-2"
                            onClick={(event) => {
                                event.stopPropagation()
                            }}
                        >
                            <div className="text-gray-400 font-normal text-sm pl-4 mt-2 mb-1">
                                Kết quả:
                            </div>
                            {searchedPosts?.length > 0 ? (
                                <div className="">
                                    {searchedPosts.map((post, index) => {
                                        return (
                                            <div
                                                className="cursor-pointer hover:bg-slate-100 py-2 pl-4 text-sm text-gray-800"
                                                key={index}
                                                onClick={() => {
                                                    setSearchHintsShowed(false)
                                                    setSearchKeys(post.title)
                                                }}
                                            >
                                                {post?.title ? post.title : ""}
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <>
                                    {searchedPosts ? (
                                        <div className="bg-hover-primary py-2 pl-4 text-sm text-gray-800">
                                            Không tìm thấy nội dung phù hợp
                                        </div>
                                    ) : (
                                        <div className="pb-1 pl-4 text-sm text-gray-800">
                                            {" "}
                                            Nhập từ khóa để tìm kiếm
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
                <div className="flex items-center justify-end gap-x-1 flex-row min-w-[160px]">
                    <div
                        onClick={handleAddNewPost}
                        className="flex items-center text-sm py-[6px] px-2  text-white bg-primary hover:bg-light-primary rounded cursor-pointer"
                    >
                        <MdPostAdd className="h-6 w-6" />
                        <span className="ml-2 font-semibold">ĐĂNG TIN</span>
                    </div>
                </div>
            </div>
        </header>
    )

    const Footer = (
        <footer>
            <div className=" laptop:px-6 bg-neutral-700 px-12 py-6 text-gray-300 ">
                <div className="laptop:w-laptop m-auto">
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
                <div className="laptop:w-laptop m-auto text-sm flex flex-col items-center">
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

    // RETURN ERROR PAGE IF MATCH CONDITIONS
    if (authError?.statusCode === 503 || authError?.statusCode === 400) {
        return (
            <ErrorPage
                statusCode={authError.statusCode}
                message={authError.statusText}
            />
        )
    }
    if (postError?.statusCode === 503 || postError?.statusCode === 400) {
        return (
            <ErrorPage
                statusCode={postError.statusCode}
                message={postError.statusText}
            />
        )
    }
    if (chatError?.statusCode === 503 || chatError?.statusCode === 400) {
        return (
            <ErrorPage
                statusCode={chatError.statusCode}
                message={chatError.statusText}
            />
        )
    }
    if (userError?.statusCode === 503 || userError?.statusCode === 400) {
        return (
            <ErrorPage
                statusCode={userError.statusCode}
                message={userError.statusText}
            />
        )
    }

    return (
        <>
            <div
                onClick={(event) => handleCloseAllWindows(event)}
                className={`${
                    isfullScreenAndNoScroll ? "h-screen" : ""
                } flex flex-col`}
            >
                {Loading ? <Loader /> : <></>}
                <div className="h-[140px]">{Header}</div>
                <div className="flex-1 h-outlet">
                    <Outlet />
                </div>
                <div>{footerHidden ? <></> : Footer}</div>
                <CustomToastify />
            </div>
        </>
    )
}

export default Layout
