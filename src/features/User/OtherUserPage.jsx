import React, { useEffect, useState } from "react"
// components
import Breadcrumb from "../../components/Breadcrumb"
import Dropzone from "../../components/Dropzone"
import Loader from "../../components/Loader"
import numeral from "numeral"
import { toTimeAgo } from "../../utils/DateUtils"
import UserErrorPage from "../Error/UserErrorPage"
// icons
import {
    BsStar,
    BsCalendar4Event,
    BsShare,
    BsFillCameraFill,
} from "react-icons/bs"
import { HiOutlineLocationMarker } from "react-icons/hi"
import { AiOutlineMail } from "react-icons/ai"
import { TbMoodEmpty } from "react-icons/tb"
import { BsTelephoneForward } from "react-icons/bs"
import { FaUserCircle } from "react-icons/fa"
import { BsChatFill } from "react-icons/bs"
import { BsThreeDotsVertical } from "react-icons/bs"
import { IoOptions } from "react-icons/io5"
import { MdOutlineDone } from "react-icons/md"
import { ImCancelCircle } from "react-icons/im"
//
import {
    selectOtherUser,
    selectUserError,
    selectUserStatus,
    getUserByIdThunk,
    followUserThunk,
    unfollowUserThunk,
    addVisitingUserToFollowers,
    removeVisitingUserToFollowers,
} from "./userSlice"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { selectUser } from "../Auth/authSlice"

const OtherUserPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()
    const [userMenuShowed, setUserMenuShowed] = useState(false)
    const [isFollowedByCurrentUser, setIsFollowedByCurrentUser] = useState(null)
    const [isTheSameUser, setIsTheSameUser] = useState(null)

    const user = useSelector(selectOtherUser)
    const visitingUser = useSelector(selectUser)
    const followers = user?.followers
    const followingUsers = user?.followingUsers

    // console.log(">>> At user: ", user)
    const error = useSelector(selectUserError)
    const status = useSelector(selectUserStatus)

    // useEffect
    // - the same user with the page can't click to do some specific actions
    useEffect(() => {
        if (!visitingUser) {
            setIsTheSameUser(false)
            return
        }
        const visitingUserId = visitingUser?.id
        const userId = user?.id
        if (+visitingUserId === +userId) {
            setIsTheSameUser(true)
        } else {
            setIsTheSameUser(false)
        }
    }, [user])
    useEffect(() => {
        ;(async () => {
            const { userId } = params
            const result = await dispatch(getUserByIdThunk({ userId })).unwrap()
            // console.log(">>> At handleLookPoster, result: ", result)
        })()
    }, [])
    // showing api error
    useEffect(() => {}, [status, error])
    const handleCloseAllWindows = () => {
        if (userMenuShowed) {
            setUserMenuShowed(false)
        }
    }

    // - to check if is user followed by the visiting user
    useEffect(() => {
        // if visiting user id is included in followers, then true
        const followers = user?.followers
        const visitingUserId = visitingUser?.id
        if (!visitingUserId) {
            setIsFollowedByCurrentUser(false)
            return
        }
        if (followers?.some((user) => user.id === visitingUserId)) {
            setIsFollowedByCurrentUser(true)
        } else {
            setIsFollowedByCurrentUser(false)
        }
    }, [user])

    const handleSwitchUserMenu = (e) => {
        e.stopPropagation()
        setUserMenuShowed(!userMenuShowed)
    }

    const handleFollowUser = async () => {
        if (!visitingUser) {
            return navigate("/login")
        }
        const followerId = visitingUser.id
        const followedUserId = user.id
        await dispatch(followUserThunk({ followerId, followedUserId })).unwrap()
        const {
            id,
            email,
            userName,
            avatar,
            phoneNumber,
            isOnline,
            introduction,
            createdAt,
            updatedAt,
        } = visitingUser
        const addedUser = {
            id,
            email,
            userName,
            avatar,
            phoneNumber,
            isOnline,
            introduction,
            createdAt,
            updatedAt,
        }
        dispatch(addVisitingUserToFollowers(addedUser))
    }

    const handleUnfollowUser = async () => {
        if (!visitingUser) {
            return navigate("/login")
        }
        const followerId = visitingUser.id
        const followedUserId = user.id
        await dispatch(
            unfollowUserThunk({ followerId, followedUserId })
        ).unwrap()
        dispatch(removeVisitingUserToFollowers())
    }

    /**COMPONENTS */
    const userInformatiion = (
        <div className="laptop:w-laptop m-auto mb-5 bg-white grid grid-cols-2 ] py-5 rounded-md shadow-md">
            {/* left side*/}
            <div className="flex ">
                <div className="w-3/12 flex justify-center">
                    <div
                        className={`rounded-[50%] h-20 w-20 border-2 border-primary translate-y-2 cursor-pointer hover:opacity-90 `}
                    >
                        {user?.avatar ? (
                            <img
                                src={user?.avatar}
                                alt="avatar"
                                className="object-cover w-full h-full rounded-[50%]"
                            />
                        ) : (
                            <FaUserCircle className="w-full h-full text-gray-400 rounded-[50%]"></FaUserCircle>
                        )}
                    </div>
                </div>
                <div className="w-[70%] relative border-r border-gray-200">
                    <div className="text-lg font-semibold">
                        {user?.userName ? user.userName : ""}
                        <span
                            className={
                                `ml-3 inline-block mx-1  w-2 h-2 rounded-[50%] ` +
                                (user?.isOnline
                                    ? "bg-green-600"
                                    : "bg-gray-600")
                            }
                        ></span>
                        {user?.isOnline ? (
                            <span className="text-green-600 text-xs">
                                Đang hoạt động
                            </span>
                        ) : (
                            <span className="text-gray-600 text-xs">
                                {toTimeAgo(user?.updatedAt)}
                            </span>
                        )}
                    </div>
                    <div className="flex justify-left gap-x-2 text-sm mt-[1px] pr-[120px]">
                        <div>
                            <span className="font-semibold">
                                {followers?.length || 0}
                            </span>{" "}
                            Người theo dõi
                        </div>
                        <div className="w-[1px] h-4 translate-y-[2px] bg-gray-600"></div>
                        <div>
                            <span className="font-semibold">
                                {followingUsers?.length || 0}
                            </span>{" "}
                            Đang theo dõi
                        </div>
                    </div>
                    <div className="flex gap-x-4 mt-[10px]">
                        {isFollowedByCurrentUser ? (
                            <button
                                className="group select-none cursor-pointer text-primary border border-primary bg-white hover:bg-white hover:border-red-600 pb-1 pt-[2px] px-3 rounded-3xl hover:opacity-70 "
                                onClick={() => {
                                    handleUnfollowUser()
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
                                className="select-none cursor-pointer text-white border bg-primary pb-1 pt-[2px] px-3 rounded-3xl hover:opacity-70 disabled:cursor-not-allowed"
                                onClick={() => {
                                    handleFollowUser()
                                }}
                                disabled={isTheSameUser}
                            >
                                <span className="text-lg">+</span> Theo dõi
                            </button>
                        )}
                        <button
                            className="flex items-center gap-x-1 select-none cursor-pointer text-white border-[1px] border-primary pb-1 pt-[2px] px-3 rounded-3xl hover:opacity-70 disabled:cursor-not-allowed"
                            disabled={isTheSameUser}
                        >
                            <div>
                                <BsChatFill className="text-primary"></BsChatFill>
                            </div>
                            <div className="text-primary">chat</div>
                        </button>
                    </div>
                    <button
                        onClick={handleSwitchUserMenu}
                        className="group w-8 h-8 absolute top-0 right-4 select-none cursor-pointer rounded-[20px] border-gray-500 font-extrabold text-center"
                    >
                        <div
                            className={`w-8 h-8 text-slate-600 ${
                                !userMenuShowed
                                    ? "group-hover:text-slate-400"
                                    : ""
                            }`}
                        >
                            <IoOptions className="text-[32px]"></IoOptions>
                        </div>
                        {userMenuShowed ? (
                            <div
                                className="absolute z-10  top-10 right-0 border-[1px]  shadow-md py-2 bg-white text-sm w-[200px] "
                                onClick={(event) => event.stopPropagation()}
                            >
                                <div className="flex items-center px-2 py-2 gap-x-2 hover:bg-background">
                                    <div className="">
                                        <BsShare></BsShare>
                                    </div>
                                    <div
                                        className="font-normal flex-1 text-left"
                                        onClick={(event) => {
                                            event.stopPropagation()
                                            const url = window.location.href
                                            navigator.clipboard
                                                .readText()
                                                .then((clipboardText) => {
                                                    if (clipboardText === url) {
                                                        return setUserMenuShowed(
                                                            false
                                                        )
                                                    } else {
                                                        navigator.clipboard.writeText(
                                                            url
                                                        )
                                                        toast(
                                                            "Copy link successfully!"
                                                        )
                                                        setUserMenuShowed(false)
                                                    }
                                                })
                                        }}
                                    >
                                        Sao chép liên kết
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}
                    </button>
                </div>
            </div>
            {/* right side*/}
            <div>
                <div className="flex items-center gap-x-2 py-1">
                    <div>
                        <BsStar className="text-gray-400 w-5 h-5" />
                    </div>
                    <div className="text-gray-400 text-sm">Đánh giá:</div>
                    <div className="text-sm text-text">Chưa có đánh giá</div>
                </div>
                <div className="flex items-center gap-x-2 py-1">
                    <div>
                        <BsCalendar4Event className="text-gray-400 w-4 h-4" />
                    </div>
                    <div className="text-gray-400 text-sm">Ngày tham gia:</div>
                    <div className="text-sm text-text">
                        {new Date(user?.createdAt).toLocaleString("vi-VN", {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                        })}
                    </div>
                </div>
                <div className="flex items-center gap-x-2 py-1">
                    <div>
                        <BsTelephoneForward className="text-gray-400 w-5 h-5" />
                    </div>
                    <div className="text-gray-400 text-sm">Số điện thoại:</div>
                    <div className="text-sm text-text">
                        {user?.phoneNumber ? user.phoneNumber : "Chưa cung cấp"}
                    </div>
                </div>

                <div className="flex items-center gap-x-2 py-1">
                    <div>
                        <AiOutlineMail className="text-gray-400 w-5 h-5" />
                    </div>
                    <div className="text-gray-400 text-sm">Email: </div>
                    <div className="text-sm text-text">
                        {user?.email ? (
                            <a href={`mailto:${user.email}`}>{user.email}</a>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )

    const userPosts = (
        <div className="laptop:w-laptop m-auto bg-white py-5 px-4 rounded-md shadow-boxMd">
            <div className="py-2  border-b-[1px] border-gray-300">
                <span>Tin đang đăng</span>
                <span className="px-2">-</span>
                <span className="text-gray-400">
                    {user?.posts?.length || 0} tin
                </span>
            </div>
            {user?.posts?.length > 0 ? (
                // show posts
                <>
                    {user.posts.map((post, index) => {
                        return (
                            <div
                                key={index}
                                className="h-[140px] p-4 w-full flex gap-x-4 border-b border-gray-300 cursor-pointer hover:bg-slate-100"
                                onClick={() => {
                                    navigate(`/posts/${post.post_url}`)
                                }}
                            >
                                <div className="w-[15%] h-full">
                                    <img
                                        src={post.images[0]?.imageUrl}
                                        alt="post image"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="w-[70%] inline-flex flex-col justify-between">
                                    <div>
                                        <div className="font-semibold text-gray-800 text-lg ellipsis line-clamp-1">
                                            {post.title}
                                        </div>
                                        <div className="text-red-500 text-base">
                                            {numeral(post.price)
                                                .format("0,0 ₫")
                                                .replaceAll(",", ".")}
                                            &nbsp;đ
                                        </div>
                                        <div className="text-sm w-full truncate">
                                            {post.description}
                                        </div>
                                    </div>
                                    <div className="inline-flex items-center gap-x-2 text-sm text-gray-500 ">
                                        <div>{post.timeAgo}</div>

                                        <div className="w-[1px] h-[1rem] bg-gray-500"></div>
                                        <div>
                                            {post?.address
                                                ? post.address
                                                : "---"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </>
            ) : (
                // show that there's no post
                <>
                    <div>
                        <div className="w-[50%] m-auto">
                            <div className="my-5 flex justify-center">
                                <TbMoodEmpty className="w-20 h-20 text-gray-500"></TbMoodEmpty>
                            </div>
                            <div className="my-5 p-5 bg-background text-gray-500 text-center">
                                Người dùng chưa có tin đăng cá nhân nào đang bán
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )

    return error?.statusCode ? (
        <UserErrorPage statusCode={error.statusCode} message={error.message} />
    ) : (
        <div className="bg-customWhite pb-5" onClick={handleCloseAllWindows}>
            {status === "loadding" ? <Loader /> : <></>}
            <Breadcrumb title1={`Trang cá nhân của ${user?.userName}`} />
            {userInformatiion}
            {userPosts}
        </div>
    )
}

export default OtherUserPage
