import React, { useEffect, useState } from "react"
// components
import Breadcrumb from "../../components/Breadcrumb"
import Dropzone from "../../components/Dropzone"
import Loader from "../../components/Loader"
import numeral from "numeral"
import { toTimeAgo } from "../../utils/DateUtils"
// icons
import {
    BsStar,
    BsCalendar4Event,
    BsShare,
    BsFillCameraFill,
} from "react-icons/bs"
import { BsTelephoneForward } from "react-icons/bs"
import { AiOutlineMail } from "react-icons/ai"
import { MdPostAdd } from "react-icons/md"
import { FaUserCircle } from "react-icons/fa"
import { IoOptions } from "react-icons/io5"

import {
    selectUser,
    selectError,
    selectAuthStatus,
    updateAvatarThunk,
    resetStatus,
    selectAuthError,
} from "./authSlice"
import { getPostByUserIdThunk } from "./authSlice"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"

const AuthorizedUserPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()
    const [userMenuShowed, setUserMenuShowed] = useState(false)
    const [avatarImage, setAvatarImage] = useState([])
    const user = useSelector(selectUser)
    const followers = user?.followers
    const followingUsers = user?.followingUsers
    const userPosts = user?.posts || []

    const [showImageUploader, setShowImageUploader] = useState(false)
    const error = useSelector(selectAuthError)
    const status = useSelector(selectAuthStatus)

    // useEffect(() => {
    //     ;(async () => {
    //         const { userId } = params
    //         const result = await dispatch(getUserByIdThunk({ userId })).unwrap()
    //         console.log(">>> At handleLookPoster, result: ", result)
    //     })()
    // }, [])
    useEffect(() => {
        ;(async () => {
            const userId = user?.id
            const result = await dispatch(
                getPostByUserIdThunk({ userId })
            ).unwrap()
            // console.log(
            //     ">>> At AuthorizedUserPage, getPostByUserIdThunk result: ",
            //     result
            // )
        })()
    }, [])
    useEffect(() => {
        dispatch(resetStatus())
    }, [window.performance.navigation.type])

    useEffect(() => {
        if (status === "Đang cập nhật ảnh ...") {
            toast.dismiss()
            toast.info(status, {
                autoClose: 5000,
            })
        }
        if (status === "Cập nhật ảnh thành công") {
            toast.dismiss()
            toast.success(status, {
                hideProgressBar: true,
            })
        }
        if (status === "Cập nhật ảnh thất bại") {
            toast.dismiss()
            toast.error(status, {
                hideProgressBar: true,
            })
        }
    }, [status])

    const handleCloseAllWindows = () => {
        if (userMenuShowed) {
            setUserMenuShowed(false)
        }
    }

    const handleCloseImageUploader = () => {
        if (showImageUploader) {
            setShowImageUploader(false)
        }
    }

    const handleSwitchUserMenu = (e) => {
        e.stopPropagation()
        setUserMenuShowed(!userMenuShowed)
    }

    const handleUpdateAvatar = async (e) => {
        e.preventDefault()
        const formData = new FormData()

        for (let i = 0; i < avatarImage.length; i++) {
            const file = avatarImage[i].file
            // Append the file to the FormData object
            formData.append("avatar", file, file.name)
        }
        const userId = user.id

        const result = await dispatch(
            updateAvatarThunk({ formData, userId })
        ).unwrap()
        handleCloseImageUploader()
        setAvatarImage([])
        dispatch(resetStatus())
    }

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

    /**COMPONENTS */
    const userInformatiion = (
        <div
            className={`bg-white grid ${
                deviceType === "laptop" ||
                deviceType === "desktop" ||
                deviceType === "tablet"
                    ? "grid-cols-2"
                    : "grid-cols-1 gap-y-6"
            } py-5 rounded-md shadow-md`}
        >
            {/* left side*/}
            <div
                className={`flex ${
                    deviceType === "smallMobile" ||
                    deviceType === "mobile" ||
                    deviceType === "tablet"
                        ? "text-sm"
                        : ""
                }`}
            >
                <div
                    className={`${
                        deviceType === "smallMobile"
                            ? "w-16 h-16 mx-4"
                            : "w-20 h-20 mx-4"
                    }   flex justify-center`}
                >
                    <div
                        className={`rounded-[50%] ${
                            deviceType === "smallMobile"
                                ? "w-16 h-16"
                                : "w-20 h-20"
                        } border-2 border-primary translate-y-2 cursor-pointer hover:opacity-90 `}
                        onClick={(event) => {
                            event.stopPropagation()
                            setShowImageUploader(true)
                        }}
                    >
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt="avatar"
                                className="object-cover w-full h-full rounded-[50%]"
                            />
                        ) : (
                            <FaUserCircle className="w-full h-full text-gray-400 rounded-[50%]"></FaUserCircle>
                        )}
                        <div className="absolute bottom-0 right-0 rounded-[50%] w-6 h-6 bg-gray-300 flex items-center justify-center shadow-boxMd hover:bg-gray-200 cursor-pointer">
                            <BsFillCameraFill className="" />
                        </div>
                    </div>
                </div>
                <div
                    className={` ${
                        deviceType === "laptop" ||
                        deviceType === "desktop" ||
                        deviceType === "tablet"
                            ? "w-[100%] border-r border-gray-200"
                            : "flex-1 pr-4"
                    } relative `}
                >
                    <div className="text-lg w-[80%] font-semibold">
                        <div className="translate-y-2 text-ellipsis line-clamp-1">
                            {user?.userName ? user.userName : ""}
                        </div>
                        <div className="">
                            <span
                                className={
                                    `inline-block mr-1 w-2 h-2 rounded-[50%] ` +
                                    (user?.isOnline
                                        ? "bg-green-600"
                                        : "bg-gray-600")
                                }
                            ></span>
                            {user?.isOnline ? (
                                <span className=" text-green-600 text-xs">
                                    Đang hoạt động
                                </span>
                            ) : (
                                <span className=" text-gray-600 text-xs">
                                    {toTimeAgo(user?.updatedAt)}
                                </span>
                            )}
                        </div>
                    </div>
                    <div
                        className={`flex justify-left gap-x-2 mt-[1px] ${
                            deviceType === "smallMobile" ? "text-xs" : ""
                        }`}
                    >
                        <div>
                            <span className="font-semibold">
                                {followers?.length || 0}
                            </span>{" "}
                            Người theo dõi
                        </div>
                        <div className="w-[1px] h-4 translate-y-[2px] bg-gray-400"></div>
                        <div>
                            <span className="font-semibold">
                                {followingUsers?.length || 0}
                            </span>{" "}
                            Đang theo dõi
                        </div>
                    </div>
                    <div className=" flex gap-x-4 mt-3">
                        <button
                            className="select-none cursor-pointer block text-gray-500 border-[1px] border-gray-300 py-1 px-3 rounded-3xl hover:opacity-70 "
                            onClick={() => {
                                navigate("/user/setting/profile")
                            }}
                        >
                            Chỉnh sửa trang cá nhân
                        </button>
                    </div>
                    <button
                        onClick={handleSwitchUserMenu}
                        className="group w-8 h-8 absolute top-1 right-3 select-none cursor-pointer rounded-[20px] border-gray-500 font-extrabold text-center"
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
                                            const url = `${window.location.hostname}/user/${user.id}`
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
            <div
                className={` px-6 ${
                    deviceType === "smallMobile" || deviceType === "mobile"
                        ? "border-t border-gray-200 pt-4"
                        : ""
                }`}
            >
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
                {/* <div className="flex items-center gap-x-2 py-1">
                    <div>
                        <RiMessage2Line className="text-gray-400 w-5 h-5" />
                    </div>
                    <div className="text-gray-400 text-sm">Phản hồi chat:</div>
                    <div className="text-sm text-text">72% (Trong 3 giờ)</div>
                </div> */}

                <div className="flex items-center gap-x-2 py-1">
                    <div>
                        <AiOutlineMail className="text-gray-400 w-5 h-5" />
                    </div>
                    <div className="text-gray-400 text-sm">Email: </div>
                    <div className="text-sm text-text">
                        <a href={`mailto:${user.email}`}>{user.email}</a>
                    </div>
                </div>
            </div>
        </div>
    )

    const UserPostsField = (
        <div className={`bg-white px-4 pt-0 pb-5 rounded-md shadow-mds`}>
            <div className="py-2  border-b-[1px] border-gray-300">
                <span>Tin đang đăng</span>
                <span className="px-2">-</span>
                <span className="text-gray-400">
                    {userPosts ? userPosts.length : 0}
                </span>
            </div>
            <div>
                {userPosts?.length > 0 ? (
                    // show posts
                    <>
                        {userPosts.map((post, index) => {
                            return (
                                <div
                                    key={index}
                                    className={`${
                                        deviceType === "mobile" ||
                                        deviceType === "smallMobile"
                                            ? "h-[100px] p-2"
                                            : "h-[140px] p-4"
                                    }   w-full flex gap-x-4 border-b border-gray-300 cursor-pointer hover:bg-slate-100`}
                                    onClick={() => {
                                        navigate(`/posts/${post.post_url}`)
                                    }}
                                >
                                    <div
                                        className={`${
                                            deviceType === "mobile" ||
                                            deviceType === "smallMobile"
                                                ? "w-[80px] h-[80px]"
                                                : "w-[15%] h-full"
                                        }  rounded-[8px]`}
                                    >
                                        <img
                                            src={post.images[0]?.imageUrl}
                                            alt="post image"
                                            className="w-full h-full object-cover rounded-[8px] shadow-boxMd"
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
                                        <div
                                            className={`${
                                                deviceType === "mobile" ||
                                                deviceType === "smallMobile"
                                                    ? "hidden"
                                                    : "inline-flex"
                                            }  items-center gap-x-2 text-sm text-gray-500 `}
                                        >
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
                    // no post

                    <div className="w-[50%] m-auto">
                        <div className="my-5 flex justify-center">
                            <MdPostAdd className="w-20 h-20 text-gray-500"></MdPostAdd>
                        </div>
                        <div className="my-5 p-5 bg-background text-gray-500">
                            Bạn chưa có tin đăng cá nhân nào đang bán, thử đăng
                            bán ngay
                        </div>
                        <div
                            className="my-5 border-[1px] border-primary hover:bg-primary hover:text-white cursor-pointer py-2 text-center rounded-md"
                            onClick={() => {
                                navigate("../posts/new-post")
                            }}
                        >
                            Đăng tin
                        </div>
                    </div>
                )}
            </div>
        </div>
    )

    const ImageUploader = (
        <div
            className="flex flex-col items-center justify-center absolute h-[1400px] top-0 bottom-0 left-0 right-0 z-[50] bg-black-0.1 shadow-sm"
            onClick={handleCloseImageUploader}
        >
            <Dropzone
                className={"top-[120px]"}
                text="Tải ảnh lên"
                title="Cập nhật ảnh đại diện"
                setImages={setAvatarImage}
                images={avatarImage}
                isCircle="true"
                closeDropzone={handleCloseImageUploader}
                saveImages={handleUpdateAvatar}
                deviceType={deviceType}
            />
        </div>
    )

    return (
        <div className="bg-customWhite " onClick={handleCloseAllWindows}>
            <Breadcrumb title1={`Trang cá nhân của ${user?.userName}`} />
            <div
                className={` laptop:max-w-[1024px] m-auto   ${
                    deviceType === "desktop" ? "px-0" : "px-6"
                }  my-5 `}
            >
                {userInformatiion}
            </div>

            <div
                className={` laptop:max-w-[1024px] m-auto   ${
                    deviceType === "desktop" ? "px-0" : "px-6"
                }  my-5 `}
            >
                {UserPostsField}
            </div>

            {showImageUploader ? ImageUploader : <></>}
        </div>
    )
}

export default AuthorizedUserPage
