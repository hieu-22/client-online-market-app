import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { selectUser } from "../Auth/authSlice"
import {
    handleGetOtherUsersThunk,
    selectNonFollowedUsers,
    followUserThunk,
    toggleIsUserFollowed,
    unfollowUserThunk,
} from "./userSlice"
import { toTimeAgo } from "../../utils/DateUtils"
import { toast } from "react-toastify"
// icons
import { FaUserCircle } from "react-icons/fa"
import { IoOptions } from "react-icons/io5"
import { BsChatFill } from "react-icons/bs"
import { MdOutlineDone } from "react-icons/md"
import { ImCancelCircle } from "react-icons/im"
//
import { Link, useNavigate } from "react-router-dom"
import Breadcrumb from "../../components/Breadcrumb"

const UsersListPage = () => {
    const dispath = useDispatch()
    const navigate = useNavigate()

    const user = useSelector(selectUser)
    const nonFollowingUsers = useSelector(selectNonFollowedUsers)
    const [endOfUsers, setEndOfUsers] = useState(true)

    const [userMenuShowed, setUserMenuShowed] = useState([])

    useEffect(() => {
        if (user) {
            const userId = user?.id
            dispath(handleGetOtherUsersThunk(userId))
        }
    }, [user])

    // handlers
    const handleFollowUser = async (userId, index) => {
        const followerId = user.id
        const followedUserId = userId
        await dispath(followUserThunk({ followerId, followedUserId })).unwrap()
        dispath(toggleIsUserFollowed(index))
    }

    const handleUnfollowUser = async (userId, index) => {
        const followerId = user.id
        const followedUserId = userId
        await dispath(
            unfollowUserThunk({ followerId, followedUserId })
        ).unwrap()
        dispath(toggleIsUserFollowed(index))
    }

    const toggleUserMenu = (index) => {
        setUserMenuShowed((prevMenuOpen) => {
            const updatedUserMenuShowed = [...prevMenuOpen] // Create a copy of the previous state

            // Check if the menu at the given index is open or closed
            if (updatedUserMenuShowed[index]) {
                updatedUserMenuShowed[index] = false // Close the menu
            } else {
                updatedUserMenuShowed[index] = true // Open the menu
            }

            return updatedUserMenuShowed // Return the updated state
        })
    }

    const userBlock = ({
        id,
        userName,
        avatar,
        isOnline,
        isFollowed,
        index,
    }) => {
        return (
            <div
                className="relative select-none flex gap-x-5 w-[500px] border rounded-lg bg-white px-5 py-5"
                onClick={() => {
                    if (userMenuShowed[index]) {
                        toggleUserMenu(index)
                    }
                }}
            >
                <div className="flex justify-center">
                    <Link
                        className={`rounded-[50%] h-20 w-20 border-2 border-primary cursor-pointer`}
                    >
                        {avatar ? (
                            <img
                                src={avatar}
                                alt="avatar"
                                className="object-cover w-full h-full rounded-[50%]"
                            />
                        ) : (
                            <FaUserCircle className="w-full h-full text-gray-400 rounded-[50%]"></FaUserCircle>
                        )}
                    </Link>
                </div>
                <div className="flex flex-col justify-between">
                    <Link className="text-lg my-2 font-semibold">
                        {userName ? userName : ""}
                        <span
                            className={
                                `ml-3 inline-block mx-1  w-2 h-2 rounded-[50%] ` +
                                (isOnline ? "bg-green-600" : "bg-gray-600")
                            }
                        ></span>
                        {isOnline ? (
                            <span className="text-green-600 text-xs">
                                Đang hoạt động
                            </span>
                        ) : (
                            <span className="text-gray-600 text-xs">
                                Không hoạt động
                            </span>
                        )}
                    </Link>
                    <div
                        className="flex gap-x-4"
                        onClick={(event) => {
                            event.stopPropagation()
                        }}
                    >
                        {isFollowed ? (
                            <button
                                className="group select-none cursor-pointer text-primary border border-primary bg-white hover:bg-white hover:border-red-600 pb-1 pt-[2px] px-3 rounded-3xl hover:opacity-70 "
                                onClick={() => {
                                    handleUnfollowUser(id, index)
                                }}
                            >
                                <span className="inline-flex group-hover:hidden items-end transition-all">
                                    <span>
                                        <MdOutlineDone />
                                    </span>{" "}
                                    <span className="translate-y-[2px]">
                                        Đang theo dõi
                                    </span>
                                </span>
                                <span className="hidden group-hover:inline-flex items-end transition-all text-red-600">
                                    <span>
                                        <ImCancelCircle />
                                    </span>{" "}
                                    <span className="translate-y-[2px]">
                                        Hủy theo dõi
                                    </span>
                                </span>
                            </button>
                        ) : (
                            <button
                                className="select-none cursor-pointer text-white border bg-primary pb-1 pt-[2px] px-3 rounded-3xl hover:opacity-70"
                                onClick={() => {
                                    handleFollowUser(id, index)
                                }}
                            >
                                <span className="text-lg">+</span> Theo dõi
                            </button>
                        )}

                        {/* <button className="group select-none cursor-pointer text-primary border border-primary bg-white hover:bg-white hover:border-red-600 pb-1 pt-[2px] px-3 rounded-3xl hover:opacity-70 ">
                            <span className="inline-flex group-hover:hidden items-end transition-all">
                                <span>
                                    <MdOutlineDone />
                                </span>{" "}
                                <span className="translate-y-[2px]">
                                    Đang theo dõi
                                </span>
                            </span>
                            <span className="hidden group-hover:inline-flex items-end transition-all text-red-600">
                                <span>
                                    <ImCancelCircle />
                                </span>{" "}
                                <span className="translate-y-[2px]">
                                    Hủy theo dõi
                                </span>
                            </span>
                        </button> */}
                        <button className="flex items-center gap-x-1 select-none cursor-pointer text-white border-[1px] border-primary pb-1 pt-[2px] px-3 rounded-3xl hover:opacity-70 ">
                            <div>
                                <BsChatFill className="text-primary"></BsChatFill>
                            </div>
                            <div className="text-primary">chat</div>
                        </button>
                    </div>
                </div>
                <button
                    onClick={(event) => {
                        event.stopPropagation()
                        toggleUserMenu(index)
                    }}
                    className="group w-8 h-8 absolute top-3 right-7 select-none cursor-pointer rounded-[20px] border-gray-500 font-extrabold text-center"
                >
                    <div
                        className={`w-8 h-8 text-slate-600 ${
                            !userMenuShowed[index]
                                ? "group-hover:text-slate-400"
                                : ""
                        }`}
                    >
                        <IoOptions className="text-[32px]"></IoOptions>
                    </div>
                    {userMenuShowed[index] ? (
                        <div
                            className="absolute z-10  top-10 right-0 border-[1px] rounded-md  shadow-md py-2 px-2 bg-white text-sm w-[160px] "
                            onClick={(event) => {
                                event.stopPropagation()
                            }}
                        >
                            <div className="flex items-center px-2 py-2 gap-x-2 hover:bg-background transition-all rounded-md">
                                <div
                                    className="font-normal flex-1 text-left"
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        toggleUserMenu(index)
                                        navigate(`/user/${id}`)
                                    }}
                                >
                                    Trang cá nhân
                                </div>
                            </div>
                            <div className="flex items-center px-2 py-2 gap-x-2 hover:bg-background transition-all rounded-md">
                                <div
                                    className="font-normal flex-1 text-left"
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        toggleUserMenu(index)
                                    }}
                                >
                                    Xóa, gỡ
                                </div>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </button>
            </div>
        )
    }

    return (
        <div className="bg-customWhite">
            <Breadcrumb
                title1={"Người dùng"}
                link1={"/users"}
                title2={"Gợi ý"}
            />
            <div className="laptop:w-laptop m-auto pb-10">
                <div className="grid grid-cols-2 gap-x-2 gap-y-2">
                    {nonFollowingUsers ? (
                        nonFollowingUsers.map((user, index) => {
                            return (
                                <div key={user?.id}>
                                    {userBlock({
                                        id: user?.id,
                                        avatar: user?.avatar,
                                        userName: user?.userName,
                                        isOnline: user?.isOnline,
                                        isFollowed: user?.isFollowed,
                                        index,
                                    })}
                                </div>
                            )
                        })
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UsersListPage
