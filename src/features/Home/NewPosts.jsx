import React, { useState } from "react"
import ProductCard from "../../components/ProductCard"
import {
    getFirstPostsThunk,
    selectFetchedPosts,
    getNextPostsThunk,
    selectPostStatus,
    selectPostError,
} from "../Post/postSlice"
import { getSavedPostsByUserIdThunk } from "../Auth/authSlice"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { TbMoodEmpty } from "react-icons/tb"

const NewPosts = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [deviceType, setDeviceType] = useState(null)
    const fetchedPosts = useSelector(selectFetchedPosts)
    const postsStatus = useSelector(selectPostStatus)
    const postsError = useSelector(selectPostError)
    const [noMorePost, setNoMorePost] = useState(false)
    const [PostsLoading, setPostsLoading] = useState(null)

    // EFFECTS
    useEffect(() => {
        if (PostsLoading === null) {
            return setPostsLoading(false)
        }
        if (postsStatus === "loading") {
            return setPostsLoading(true)
        }
    }, [postsStatus])

    useEffect(() => {
        ;(async () => {
            const res = await dispatch(
                getFirstPostsThunk({ limit: 12 })
            ).unwrap()
            setNoMorePost(false)
        })()
    }, [])

    // - SET DEVICE TYPE
    useEffect(() => {
        handleSetDeviceType()
    }, [])
    useEffect(() => {
        window.addEventListener("resize", handleSetDeviceType)
        return () => {
            window.addEventListener("resize", handleSetDeviceType)
        }
    }, [window.innerWidth])

    //HANDLERS
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

    const handleGetNextPosts = async () => {
        const lastPostCreatedAt =
            fetchedPosts[fetchedPosts.length - 1].createdAt
        const res = await dispatch(
            getNextPostsThunk({ limit: 12, lastPostCreatedAt })
        ).unwrap()
        // console.log(">>> At handleGetNextPosts: ", res)
        if (res.posts.length === 0) {
            setNoMorePost(true)
        }
    }

    const handleGetFirstPosts = async () => {
        const res = await dispatch(getFirstPostsThunk({ limit: 10 })).unwrap()
        // console.log(">>> At handleGetNextPosts: ", res)
        if (res.posts.length === 0) {
            setNoMorePost(true)
        }
    }

    if (postsError) {
        return (
            <div className="laptop:w-laptop m-auto my-5 bg-white">
                <div className="">
                    <h3 className="text-text text-lg py-2 font-semibold px-5">
                        Tin đăng mới
                    </h3>
                </div>
                <div className="text-lg text-center text-red-600 font-bold pb-4">
                    {postsError.message}
                </div>
                <div className="flex justify-center py-1 border-t border-gray-100 bg-customWhite">
                    {noMorePost ? (
                        <button
                            className="py-1 px-3 text-lg disabled:text-gray-400"
                            disabled
                        >
                            Không còn tin nào khác
                        </button>
                    ) : (
                        <button
                            className="py-1 px-3 text-lg cursor-pointer hover:text-gray-400"
                            onClick={() => {
                                if (fetchedPosts?.length > 0) {
                                    return handleGetNextPosts()
                                } else {
                                    return handleGetFirstPosts()
                                }
                            }}
                        >
                            Xem thêm
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="w-full my-5 bg-white">
            {/* head  */}
            <div className="">
                <h3 className="text-text text-lg py-2 font-semibold px-5">
                    Tin đăng mới
                </h3>
            </div>
            {/* POSTS */}
            <div>
                {fetchedPosts?.length > 0 ? (
                    <div
                        className={`bg-white grid  ${
                            deviceType === "tablet" ||
                            deviceType === "desktop" ||
                            deviceType === "laptop"
                                ? "grid-cols-4"
                                : deviceType === "mobile"
                                ? "grid-cols-2"
                                : "grid-cols-1"
                        }  border-t border-gray-200 `}
                    >
                        {fetchedPosts.map((post, index) => {
                            return (
                                <div
                                    className={`${
                                        deviceType === "smallMobile"
                                            ? "my-2"
                                            : ""
                                    }`}
                                >
                                    <ProductCard
                                        key={index}
                                        postId={post?.id}
                                        title={post?.title}
                                        price={post?.price}
                                        author={post?.author}
                                        timeAgo={post?.timeAgo}
                                        address={post?.address}
                                        postUrl={post?.post_url}
                                        imageUrl={post?.images[0]?.imageUrl}
                                        description={post?.description}
                                    />
                                </div>
                            )
                        })}{" "}
                    </div>
                ) : (
                    <div>
                        <div className="w-[50%] m-auto pb-5">
                            {postsStatus === "loading" ? (
                                <div className="text-lg text-center">
                                    loading...
                                </div>
                            ) : (
                                <>
                                    {" "}
                                    <div className="my-5 flex justify-center">
                                        <TbMoodEmpty className="w-20 h-20 text-gray-500"></TbMoodEmpty>
                                    </div>
                                    <div className="my-5 p-5 bg-background text-gray-500 text-center">
                                        Hiện chưa có tin mới
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {/* bottom */}
            <div className="flex justify-center py-1 border-t border-gray-100 bg-customWhite">
                {noMorePost ? (
                    <button
                        className="py-1 px-3 text-lg disabled:text-gray-400"
                        disabled
                    >
                        Không còn tin nào khác
                    </button>
                ) : (
                    <button
                        className="py-1 px-3 text-lg cursor-pointer hover:text-gray-400"
                        onClick={() => {
                            if (fetchedPosts?.length > 0) {
                                return handleGetNextPosts()
                            } else {
                                return handleGetFirstPosts()
                            }
                        }}
                    >
                        Xem thêm
                    </button>
                )}
            </div>
        </div>
    )
}

export default NewPosts
