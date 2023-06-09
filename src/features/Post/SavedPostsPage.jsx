import React from "react"
import Breadcrumb from "../../components/Breadcrumb"
import { useDispatch, useSelector } from "react-redux"
import { selectUser } from "../Auth/authSlice"
import { useNavigate } from "react-router-dom"
import { MdPostAdd } from "react-icons/md"
import numeral from "numeral"
import {
    deleteSavedPostThunk,
    resetStatus,
    savePostThunk,
} from "../Auth/authSlice"
import { Link } from "react-router-dom"
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"

const SavedPostsPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(selectUser)
    const savedPosts = user?.savedPosts

    //Handlers
    const handleCheckPostSaved = (postId) => {
        const checkRes = savedPosts?.some((post) => {
            return +post.post_id === postId
        })
        return checkRes
    }

    const handleSavedPost = async (postId) => {
        const userId = user?.id

        const res = await dispatch(
            savePostThunk({ userId, postId: postId })
        ).unwrap()
        console.log("At ProductCard, savePostThunk res: ", res)
        dispatch(resetStatus())
    }

    const handleDeleteSavedPost = async (postId) => {
        const userId = user?.id
        const res = await dispatch(
            deleteSavedPostThunk({ userId, postId: postId })
        ).unwrap()
        console.log("At ProductCard, handleDeleteSavedPost res: ", res)
        dispatch(resetStatus())
    }
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
                                        `/posts/${savedpost.post?.post_url}`
                                    )
                                }}
                            >
                                <div className="w-[15%] h-full">
                                    <img
                                        src={
                                            savedpost.post?.images[0]?.imageUrl
                                        }
                                        alt="post image"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="relative w-[70%] inline-flex flex-col justify-between">
                                    <div>
                                        <div className="font-semibold text-gray-800 text-lg">
                                            {savedpost.post?.title}
                                        </div>
                                        <div className="text-red-500 text-base">
                                            {numeral(savedpost.post?.price)
                                                .format("0,0 ₫")
                                                .replaceAll(",", ".")}
                                            &nbsp;đ
                                        </div>
                                        <div className="text-sm w-full truncate">
                                            {savedpost.post?.description}
                                        </div>
                                    </div>
                                    <div className="inline-flex items-center gap-x-2 text-sm text-gray-500 ">
                                        <div>
                                            {savedpost.post?.address
                                                ? savedpost.post.address
                                                : "---"}
                                        </div>
                                    </div>
                                    <div
                                        className="absolute bottom-0 -right-[120px]"
                                        onClick={(event) => {
                                            event.stopPropagation()
                                        }}
                                    >
                                        {handleCheckPostSaved(
                                            savedpost.post.id
                                        ) ? (
                                            <div
                                                onClick={() => {
                                                    handleDeleteSavedPost(
                                                        savedpost.post.id
                                                    )
                                                }}
                                            >
                                                <AiFillHeart className=" text-red-700 text-2xl  hover:scale-[1.2]" />
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => {
                                                    handleSavedPost(
                                                        savedpost.post.id
                                                    )
                                                }}
                                            >
                                                <AiOutlineHeart className=" text-red-700 text-2xl  hover:scale-[1.2]" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </>
            ) : (
                // no post
                <div className="w-[40%] m-auto pb-10">
                    {/* <div className="my-5 flex justify-center">
                        <MdPostAdd className="w-20 h-20 text-gray-500"></MdPostAdd>
                    </div> */}
                    <div className="mt-[50px] py-5 px-5 text-lg bg-background text-gray-500 rounded-sm">
                        Bạn chưa lưu bất kì tin nào.{" "}
                        <Link
                            className={
                                "text-primary hover:text-slate-400 hover:underline text-base"
                            }
                            to="/"
                        >
                            Xem tin...
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
    return (
        <div className=" bg-customWhite pb-20">
            <Breadcrumb title1={`Tin đăng đã lưu`}></Breadcrumb>
            <div className="laptop:w-laptop m-auto bg-white px-4">
                <div className="pt-2 pb-1 border-b border-gray-200">
                    Tin Đăng Đã Lưu -{" "}
                    <span className="text-gray-400">{savedPosts.length}</span>
                </div>
                <div className="pb-5">{SavedPostField}</div>
            </div>
        </div>
    )
}

export default SavedPostsPage
