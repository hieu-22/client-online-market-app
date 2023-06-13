import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { selectAuthStatus, selectUser } from "../Auth/authSlice"
import { useNavigate } from "react-router-dom"
import numeral from "numeral"
// components
import Breadcrumb from "../../components/Breadcrumb"
import {
    getPostByUserIdThunk,
    deletePostByIdThunk,
    resetStatus,
} from "../Auth/authSlice"
import ConfirmationWindow from "../../components/ConfirmationWindow"

//icons
import { FaUserCircle } from "react-icons/fa"
import { MdPostAdd } from "react-icons/md"
import { BiHide } from "react-icons/bi"
import { AiOutlineEdit } from "react-icons/ai"
import { AiOutlineShareAlt } from "react-icons/ai"
import { toast } from "react-toastify"
import { formatToString } from "../../utils/DateUtils"

const PostDashboard = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [postType, setPostType] = useState(1)
    const [expiredPosts, setExpiredPosts] = useState([])
    const [nonexpiredPosts, setNonexpiredPosts] = useState([])
    const user = useSelector(selectUser)
    const userPosts = user?.posts
    const authStatus = useSelector(selectAuthStatus)
    const [showDeletPostByIdConfirmation, setShowDeletPostByIdConfirmation] =
        useState(false)
    const [deleteConfirmationResult, setDeleteConfirmationResult] =
        useState(null)
    const [aimDeletedPostId, setAimDeletedPostId] = useState(null)

    useEffect(() => {
        if (authStatus === "Đang ẩn bài đăng ...") {
            toast.info(authStatus, {
                autoClose: 5000,
            })
        }
        if (authStatus === "Ẩn bài đăng thành công") {
            toast.dismiss()
        }
        if (authStatus === "Ẩn bài đăng thất bại") {
            toast.dismiss()
            toast.error(authStatus, {
                hideProgressBar: false,
            })
        }
    }, [authStatus])

    useEffect(() => {
        if (!userPosts) return
        const filterdPosts = userPosts.filter(
            (post) => new Date(post.expiryDate) <= new Date()
        )
        setExpiredPosts(filterdPosts)
    }, [userPosts])

    useEffect(() => {
        if (!userPosts) return
        const filterdPosts = userPosts.filter(
            (post) => new Date(post.expiryDate) > new Date()
        )
        setNonexpiredPosts(filterdPosts)
    }, [user])

    useEffect(() => {
        if (deleteConfirmationResult === null) {
            return
        }

        if (deleteConfirmationResult === false) {
            return () => {
                setDeleteConfirmationResult(null)
            }
        }

        handleDeletePostById(aimDeletedPostId)
        return () => {
            setDeleteConfirmationResult(null)
        }
    }, [deleteConfirmationResult])

    /**EFFECTS */
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

    /**HANDLERS */
    const handleConfirmDeletePost = () => {
        setShowDeletPostByIdConfirmation(false)
        setDeleteConfirmationResult(true)
    }
    const handleCancelDeletePost = () => {
        setShowDeletPostByIdConfirmation(false)
        setDeleteConfirmationResult(false)
    }

    const handleSetPostType = (type) => {
        if (postType === type) {
            return
        }
        setPostType(type)
    }

    const handleDeletePostById = async (postId) => {
        const userId = user.id
        const res = await dispatch(
            deletePostByIdThunk({ postId, userId })
        ).unwrap()
        console.log("=> At handleDeletePostById, res: ", res)
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
    // tailwindcss styles variables
    const style_active = "!text-black !border-b-[3px] !border-primary"

    const UserField = (
        <div className="flex items-center">
            <div
                className={`rounded-[50%] h-20  w-20 border-2 border-primary cursor-pointer hover:opacity-90 `}
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
            </div>
            <div className="pl-4">
                <div className="text-lg my-1 font-semibold text-ellipsis line-clamp-1">
                    {user?.userName ? user.userName : ""}
                    <span
                        className={
                            `ml-3 inline-block mx-1  w-2 h-2 rounded-[50%] ` +
                            (user?.isOnline ? "bg-green-600" : "bg-gray-600")
                        }
                    ></span>
                </div>
                <div>
                    <button
                        className="block rounded-md border border-primary text-primary py-1 px-2 hover:bg-slate-100 cursor-pointer"
                        onClick={() => {
                            navigate("/user/myProfile")
                        }}
                    >
                        Trang cá nhân{" "}
                    </button>
                </div>
            </div>
        </div>
    )

    const PostControlField = (
        <div className="flex gap-x-[2px] justify-center border-b border-gray-200">
            <div
                className={`py-2 px-3 text-sm text-gray-400 font-semibold cursor-pointer hover:bg-slate-100 border-b-[3px] border-transparent hover:border-gray-400  ${
                    postType === 1 ? style_active : ""
                }`}
                onClick={() => handleSetPostType(1)}
            >
                TIN ĐANG ĐĂNG (<span>{nonexpiredPosts?.length || 0}</span>)
            </div>
            <div
                className={`py-2 px-3 text-sm text-gray-400 font-semibold cursor-pointer hover:bg-slate-100 border-b-[3px] border-transparent hover:!border-gray-400 ${
                    postType === 2 ? style_active : ""
                }`}
                onClick={() => handleSetPostType(2)}
            >
                TIN HẾT HẠN (<span>{expiredPosts?.length || 0}</span>)
            </div>
        </div>
    )

    // TIN ĐANG ĐĂNG
    const nonExpiredPostsField = (
        <div className="w-full">
            <div>
                {nonexpiredPosts?.length > 0 ? (
                    // show posts
                    <>
                        {nonexpiredPosts.map((post, index) => {
                            return (
                                <div
                                    className={`${
                                        deviceType === "smallMobile" ||
                                        deviceType === "mobile"
                                            ? "mx-0"
                                            : "mx-10"
                                    } hover:bg-gray-100 mb-2 relative`}
                                >
                                    <div
                                        key={index}
                                        className="p-4 w-full h-[116px] border border-gray-300 border-t-0 border-b-0 cursor-pointer"
                                        onClick={() => {
                                            navigate(`/posts/${post.post_url}`)
                                        }}
                                    >
                                        <div className="flex gap-x-4 h-full">
                                            <div
                                                className={`${
                                                    deviceType ===
                                                        "smallMobile" ||
                                                    deviceType === "mobile"
                                                        ? "w-[84px] h-[84px]"
                                                        : "w-[15%] h-full"
                                                } rounded-sm`}
                                            >
                                                <img
                                                    src={
                                                        post?.images
                                                            ? post.images[0]
                                                                  .imageUrl
                                                            : ""
                                                    }
                                                    alt="post image"
                                                    className="w-full h-full object-cover rounded-sm"
                                                />
                                            </div>
                                            <div className="w-[70%] truncate inline-flex flex-col justify-between">
                                                <div>
                                                    <div className="font-semibold text-gray-800 text-base">
                                                        {post.title}
                                                    </div>
                                                    <div className="text-red-500 text-sm">
                                                        {numeral(post.price)
                                                            .format("0,0 ₫")
                                                            .replaceAll(
                                                                ",",
                                                                "."
                                                            )}
                                                        &nbsp;đ
                                                    </div>
                                                    <div className="text-sm w-full truncate text-gray-600">
                                                        Hiển thị đến:{" "}
                                                        <span className="text-gray-400 font-normal">
                                                            {formatToString(
                                                                post.expiryDate,
                                                                "hh:mm dd/mm/yyyy"
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="inline-flex items-center gap-x-2 text-sm text-gray-500 ">
                                                    <div>{post.timeAgo}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div
                                            className="text-blue-400 flex w-[50%] py-2 border border-gray-300 justify-center cursor-pointer "
                                            onClick={(event) => {
                                                event.stopPropagation()
                                                setAimDeletedPostId(post.id)
                                                setShowDeletPostByIdConfirmation(
                                                    true
                                                )
                                            }}
                                        >
                                            <div className="mr-2">
                                                <BiHide className="w-6 h-6"></BiHide>
                                            </div>
                                            <div className="font-semibold  hover:underline">
                                                Đã bán/Ẩn tin
                                            </div>
                                        </div>
                                        <div
                                            className="text-blue-400 flex  w-[50%] py-2 border border-gray-300 justify-center cursor-pointer"
                                            onClick={(event) => {
                                                event.stopPropagation()
                                                navigate(
                                                    `/update-post/${post.post_url}`
                                                )
                                            }}
                                        >
                                            <div className="mr-2">
                                                <AiOutlineEdit className="w-6 h-6" />
                                            </div>
                                            <div className="font-semibold  hover:underline">
                                                Sửa tin
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="absolute top-3 right-3 cursor-pointer"
                                        onClick={(event) => {
                                            event.stopPropagation()
                                            const postUrl = post.post_url

                                            navigator.clipboard
                                                .readText()
                                                .then((clipboardText) => {
                                                    if (
                                                        clipboardText ===
                                                        `http://localhost:3000/posts/${postUrl}`
                                                    )
                                                        return
                                                    navigator.clipboard.writeText(
                                                        `http://localhost:3000/posts/${postUrl}`
                                                    )
                                                    toast(
                                                        "Đã copy link bài đăng"
                                                    )
                                                })
                                        }}
                                    >
                                        <AiOutlineShareAlt className="w-7 h-7 text-gray-700"></AiOutlineShareAlt>
                                    </div>
                                </div>
                            )
                        })}
                    </>
                ) : (
                    // no post

                    <div className="flex justify-center my-2">
                        <div className="w-[50%] py-2 my-2 rounded-sm text-sm text-center bg-background text-gray-500 ">
                            Bạn chưa có tin đăng trong mục này.
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
    const expiredPostsField = (
        <div className="w-full">
            <div>
                {expiredPosts?.length > 0 ? (
                    // show posts
                    <>
                        {expiredPosts.map((post, index) => {
                            return (
                                <div
                                    className={`${
                                        deviceType === "smallMobile" ||
                                        deviceType === "mobile"
                                            ? "mx-0"
                                            : "mx-10"
                                    } bg-gray-200 mb-2  relative`}
                                >
                                    <div
                                        key={index}
                                        className="p-4 w-full h-[116px] border border-gray-300 border-t-0 border-b-0"
                                        onClick={() => {
                                            // navigate(`/posts/${post.post_url}`)
                                        }}
                                    >
                                        <div className="flex gap-x-4 h-full">
                                            <div
                                                className={`${
                                                    deviceType ===
                                                        "smallMobile" ||
                                                    deviceType === "mobile"
                                                        ? "w-[84px] h-[84px]"
                                                        : "w-[15%] h-full"
                                                } rounded-sm`}
                                            >
                                                <img
                                                    src={
                                                        post.images[0]?.imageUrl
                                                    }
                                                    alt="post image"
                                                    className="w-full h-full object-cover rounded-sm"
                                                />
                                            </div>
                                            <div className="w-[70%] truncate inline-flex flex-col justify-between">
                                                <div>
                                                    <div className="font-semibold text-gray-800 text-base">
                                                        {post.title}
                                                    </div>
                                                    <div className="text-red-500 text-sm">
                                                        {numeral(post.price)
                                                            .format("0,0 ₫")
                                                            .replaceAll(
                                                                ",",
                                                                "."
                                                            )}
                                                        &nbsp;đ
                                                    </div>
                                                    <div className="text-sm w-full truncate text-red-500">
                                                        {/* Hiển thị đến:{" "}
                                                        <span className="text-gray-400 font-normal">
                                                            {formatToString(
                                                                post.expiryDate,
                                                                "hh:mm dd/mm/yyyy"
                                                            )}
                                                        </span> */}
                                                        Tin đã hết hạn từ{" "}
                                                        {formatToString(
                                                            post.expiryDate,
                                                            "hh:mm dd/mm/yyyy"
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="inline-flex items-center gap-x-2 text-sm text-gray-500 ">
                                                    <div>{post.timeAgo}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="flex">
                                        <div
                                            className="text-blue-400 flex w-[50%] py-2 border border-gray-300 justify-center cursor-pointer "
                                            onClick={(event) => {
                                                event.stopPropagation()
                                                setAimDeletedPostId(post.id)
                                                setShowDeletPostByIdConfirmation(
                                                    true
                                                )
                                            }}
                                        >
                                            <div className="mr-2">
                                                <BiHide className="w-6 h-6"></BiHide>
                                            </div>
                                            <div className="font-semibold  hover:underline">
                                                Đã bán/Ẩn tin
                                            </div>
                                        </div>
                                        <div className="text-blue-400 flex  w-[50%] py-2 border border-gray-300 justify-center cursor-pointer ">
                                            <div className="mr-2">
                                                <AiOutlineEdit className="w-6 h-6" />
                                            </div>
                                            <div className="font-semibold  hover:underline">
                                                Sửa tin
                                            </div>
                                        </div>
                                    </div> */}
                                    <div
                                        className="absolute top-3 right-3 cursor-pointer"
                                        onClick={(event) => {
                                            event.stopPropagation()
                                            const postUrl = post.post_url
                                            navigator.clipboard.writeText(
                                                `http://localhost:3000/posts/${postUrl}`
                                            )
                                            alert("Đã copy post")
                                        }}
                                    >
                                        <AiOutlineShareAlt className="w-7 h-7 text-gray-700"></AiOutlineShareAlt>
                                    </div>
                                </div>
                            )
                        })}
                    </>
                ) : (
                    // no post

                    <div className="flex justify-center my-2">
                        <div className="w-[50%] py-2 my-2 rounded-sm text-sm text-center bg-background text-gray-500 ">
                            Bạn chưa có tin đăng trong mục này.
                        </div>
                    </div>
                )}
            </div>
        </div>
    )

    return (
        <>
            <div className="bg-customWhite pb-20">
                <Breadcrumb
                    title1={"Quản lí tin"}
                    link1={"/dashboard/posts"}
                    title2={
                        postType === 1
                            ? "Tin đang đăng"
                            : postType === 2
                            ? "Tin hết hạn"
                            : ""
                    }
                ></Breadcrumb>
                <div
                    className={`laptop:max-w-[1024px] ${
                        deviceType === "desktop" ? "px-0" : "px-6"
                    } m-auto  px-6`}
                >
                    <div className="bg-white">
                        {" "}
                        <div className="text-base font-semibold text-gray-800 border-b border-gray-200 p-2">
                            Quản lí tin
                        </div>
                        {/* // user field  */}
                        <div className="py-2 px-6">{UserField}</div>
                        <div>{PostControlField}</div>
                        <div className="pb-4">
                            {postType === 1
                                ? nonExpiredPostsField
                                : postType === 2
                                ? expiredPostsField
                                : ""}
                        </div>{" "}
                    </div>
                </div>
                {showDeletPostByIdConfirmation ? (
                    <ConfirmationWindow
                        message={"Bạn có chắc muốn xóa bài viết"}
                        confirmText={"Xóa"}
                        onConfirm={handleConfirmDeletePost}
                        cancelText={"Hủy"}
                        onCancel={handleCancelDeletePost}
                    />
                ) : (
                    <></>
                )}
            </div>
        </>
    )
}

export default PostDashboard
