import React, { useState, useEffect } from "react"
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
    const SavedPostField = (
        <div>
            {savedPosts?.length > 0 ? (
                // show posts
                <>
                    {savedPosts.map((savedpost, index) => {
                        return (
                            <div
                                key={index}
                                className="relative h-[120px] py-4 pr-4 w-full flex border-b border-gray-300 cursor-pointer hover:bg-slate-100"
                                onClick={() => {
                                    navigate(
                                        `/posts/${savedpost.post?.post_url}`
                                    )
                                }}
                            >
                                <div
                                    className={` ${
                                        deviceType === "desktop" ||
                                        deviceType === "laptop"
                                            ? "w-[100px] flex items-center mx-4"
                                            : "w-[70px] mr-2"
                                    } h-full min-w-[70px] rounded-[12px] `}
                                >
                                    <img
                                        src={
                                            savedpost.post?.images[0]?.imageUrl
                                        }
                                        alt="post image"
                                        className={`${
                                            deviceType === "desktop" ||
                                            deviceType === "laptop"
                                                ? "w-[100px] h-[90px]"
                                                : "w-[70px] h-[60px] translate-y-2"
                                        } object-cover rounded-[12px]`}
                                    />
                                </div>
                                <div className="max-w-[75%] inline-flex flex-col justify-between">
                                    <div>
                                        <div className="font-semibold text-gray-800 text-lg truncate line-clamp-1">
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
                                        <div className="inline-flex items-center gap-x-2 text-sm text-gray-500 truncate line-clamp-1">
                                            <div>
                                                {savedpost.post?.address
                                                    ? savedpost.post.address
                                                    : "---"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={`absolute bottom-3 right-2`}
                                    onClick={(event) => {
                                        event.stopPropagation()
                                    }}
                                >
                                    {handleCheckPostSaved(savedpost.post.id) ? (
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
            <div className="laptop:w-laptop m-auto px-4">
                <div className="bg-white ">
                    <div className="p-2 border-b border-gray-200">
                        Tin Đăng Đã Lưu -{" "}
                        <span className="text-gray-400">
                            {savedPosts.length}
                        </span>
                    </div>
                    <div className="pb-5 px-4">{SavedPostField}</div>
                </div>
            </div>
        </div>
    )
}

export default SavedPostsPage
