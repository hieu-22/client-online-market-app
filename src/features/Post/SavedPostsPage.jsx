import React from "react"
import Breadcrumb from "../../components/Breadcrumb"
import { useSelector } from "react-redux"
import { selectUser } from "../Auth/authSlice"
import { useNavigate } from "react-router-dom"
import { MdPostAdd } from "react-icons/md"
import numeral from "numeral"

const SavedPostsPage = () => {
    const navigate = useNavigate()
    const user = useSelector(selectUser)
    const savedPosts = user?.savedPosts

    const SavedPostField = (
        <div>
            {savedPosts?.length > 0 ? (
                // show posts
                <>
                    {savedPosts.map((savedpost, index) => {
                        return (
                            <div
                                key={index}
                                className="h-[140px] p-4 w-full flex gap-x-4 border-b border-gray-300 cursor-pointer hover:bg-slate-100"
                                onClick={() => {
                                    navigate(
                                        `/posts/${savedpost.post.post_url}`
                                    )
                                }}
                            >
                                <div className="w-[15%] h-full">
                                    <img
                                        src={savedpost.post.images[0].imageUrl}
                                        alt="post image"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="w-[70%] inline-flex flex-col justify-between">
                                    <div>
                                        <div className="font-semibold text-gray-800 text-lg">
                                            {savedpost.post.title}
                                        </div>
                                        <div className="text-red-500 text-base">
                                            {numeral(savedpost.post.price)
                                                .format("0,0 ₫")
                                                .replaceAll(",", ".")}
                                            &nbsp;đ
                                        </div>
                                        <div className="text-sm w-full truncate">
                                            {savedpost.post.description}
                                        </div>
                                    </div>
                                    <div className="inline-flex items-center gap-x-2 text-sm text-gray-500 ">
                                        <div>{savedpost.post.timeAgo}</div>

                                        <div className="w-[1px] h-[1rem] bg-gray-500"></div>
                                        <div>
                                            {savedpost.post.address
                                                ? savedpost.post.address
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
                        Bạn chưa có tin đăng cá nhân nào đang bán, thử đăng bán
                        ngay
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
    )
    return (
        <div className=" bg-customWhite">
            <Breadcrumb title1={`Tin đăng đã lưu`}></Breadcrumb>
            <div className="laptop:w-laptop m-auto bg-white">
                <div>Tin Đăng Đã Lưu</div>
                <div>{SavedPostField}</div>
            </div>
        </div>
    )
}

export default SavedPostsPage
