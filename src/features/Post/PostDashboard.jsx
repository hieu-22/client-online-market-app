import React, { useState } from "react"
import { useSelector } from "react-redux"
import { selectUser } from "../Auth/authSlice"
import { useNavigate } from "react-router-dom"
import numeral from "numeral"
// components
import Breadcrumb from "../../components/Breadcrumb"
import CustomToastify from "../../components/CustomToastify"

//icons
import { FaUserCircle } from "react-icons/fa"
import { MdPostAdd } from "react-icons/md"

const PostDashboard = () => {
    const navigate = useNavigate()

    const [postType, setPostType] = useState(1)
    const user = useSelector(selectUser)
    const userPosts = user?.posts

    /**HANDLERS */
    const handleSetPostType = (type) => {
        if (postType === type) {
            return
        }
        setPostType(type)
    }

    /**COMPONENTS */
    // tailwindcss styles variables
    const style_active = "text-black !border-b-[3px] !border-primary"

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
        <div className="flex gap-x-[2px] justify-center">
            <div
                className={`py-2 px-3 text-sm text-gray-400 font-semibold cursor-pointer hover:bg-slate-100 border-b-[3px] border-transparent hover:border-gray-400  ${
                    postType === 1 ? style_active : ""
                }`}
                onClick={() => handleSetPostType(1)}
            >
                TIN ĐANG ĐĂNG (0)
            </div>
            <div
                className={`py-2 px-3 text-sm text-gray-400 font-semibold cursor-pointer hover:bg-slate-100 border-b-[3px] border-transparent hover:!border-gray-400 ${
                    postType === 2 ? style_active : ""
                }`}
                onClick={() => handleSetPostType(2)}
            >
                TIN HẾT HẠN (0)
            </div>
            <div
                className={`py-2 px-3 text-sm text-gray-400 font-semibold cursor-pointer hover:bg-slate-100 border-b-[3px] border-transparent hover:!border-gray-400 ${
                    postType === 3 ? style_active : ""
                }`}
                onClick={() => handleSetPostType(3)}
            >
                TIN NHÁP (0)
            </div>
        </div>
    )

    const UserPostsField = (
        <div className="w-full">
            <div>
                {userPosts ? (
                    // show posts
                    <>
                        {userPosts.map((post, index) => {
                            return (
                                <div
                                    key={index}
                                    className="h-[140px] p-4 w-full flex gap-x-4 border-b border-gray-300 cursor-pointer hover:bg-slate-100 shadow-sm"
                                    onClick={() => {
                                        navigate(`/posts/${post.post_url}`)
                                    }}
                                >
                                    <div className="w-[15%] h-full">
                                        <img
                                            src={post.images[0].imageUrl}
                                            alt="post image"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="w-[70%] inline-flex flex-col justify-between">
                                        <div>
                                            <div className="font-semibold text-gray-800 text-lg">
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
                    // no post

                    <div className="flex justify-center">
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
            <div className="bg-customWhite">
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
                    <div>{UserPostsField}</div>
                </div>
            </div>
        </>
    )
}

export default PostDashboard
