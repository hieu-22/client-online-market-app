import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { selectUser } from "../Auth/authSlice"
import { useNavigate } from "react-router-dom"
import numeral from "numeral"
// components
import Breadcrumb from "../../components/Breadcrumb"
import {
    getPostByUserIdThunk,
    deletePostByIdThunk,
    resetStatus,
} from "../Auth/authSlice"

//icons
import { FaUserCircle } from "react-icons/fa"
import { MdPostAdd } from "react-icons/md"
import { BiHide } from "react-icons/bi"
import { AiOutlineEdit } from "react-icons/ai"
import { AiOutlineShareAlt } from "react-icons/ai"

const PostDashboard = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [postType, setPostType] = useState(1)
    const user = useSelector(selectUser)
    const userPosts = user?.posts

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
                <div className="text-lg my-1 font-semibold">
                    {user?.userName ? user.userName : ""}
                </div>
                <div>
                    <button className="block rounded-md border border-primary text-primary py-1 px-2 hover:bg-slate-100 cursor-pointer">
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
                TIN ĐANG ĐĂNG (<span>{userPosts?.length || 0}</span>)
            </div>
            <div
                className={`py-2 px-3 text-sm text-gray-400 font-semibold cursor-pointer hover:bg-slate-100 border-b-[3px] border-transparent hover:!border-gray-400 ${
                    postType === 2 ? style_active : ""
                }`}
                onClick={() => handleSetPostType(2)}
            >
                TIN HẾT HẠN (<span>{userPosts?.length || 0}</span>)
            </div>
        </div>
    )

    const UserPostsField = (
        <div className="w-full">
            <div>
                {userPosts?.length > 0 ? (
                    // show posts
                    <>
                        {userPosts.map((post, index) => {
                            return (
                                <div className="mx-20 hover:bg-slate-50 relative">
                                    <div
                                        key={index}
                                        className="p-4 w-full h-[116px] border border-gray-300 border-t-0 border-b-0 cursor-pointer"
                                        onClick={() => {
                                            navigate(`/posts/${post.post_url}`)
                                        }}
                                    >
                                        <div className="flex gap-x-4 h-full">
                                            <div className="w-[15%] h-full rounded-sm">
                                                <img
                                                    src={
                                                        post.images[0].imageUrl
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
                                                            13:47 21/07/23
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
                                                handleDeletePostById(post.id)
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
                                    </div>
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
                <div className="laptop:w-laptop bg-white m-auto px-6">
                    <Breadcrumb
                        title1={"Quản lí tin"}
                        link1={"/dashboard/posts"}
                        title2={"Tin đang đăng"}
                    ></Breadcrumb>
                </div>
                <div className="laptop:w-laptop m-auto bg-white px-6">
                    <div className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">
                        Quản lí tin
                    </div>
                    {/* // user field  */}

                    <div className="py-2">{UserField}</div>
                    <div>{PostControlField}</div>
                    <div className="pb-4">{UserPostsField}</div>
                </div>
            </div>
        </>
    )
}

export default PostDashboard
