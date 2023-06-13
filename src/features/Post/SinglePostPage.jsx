import "./slider.css"

import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Breadcrumb from "../../components/Breadcrumb"
import Slider from "react-slick"
import numeral from "numeral"
import ConfirmationWindow from "../../components/ConfirmationWindow"
// react-ioncs
import {
    MdOutlineKeyboardArrowRight,
    MdOutlineKeyboardArrowLeft,
} from "react-icons/md"
import { SlLocationPin } from "react-icons/sl"
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"
import { BsFillTelephoneForwardFill } from "react-icons/bs"
import { BiShareAlt } from "react-icons/bi"
import { TbMessageCircle2Filled } from "react-icons/tb"
import { FaUserCircle } from "react-icons/fa"
import { BiHide } from "react-icons/bi"
import { AiOutlineEdit } from "react-icons/ai"

// redux
import { useDispatch, useSelector } from "react-redux"
import {
    selectUser,
    deletePostByIdThunk,
    resetStatus,
    savePostThunk,
    deleteSavedPostThunk,
    selectAuthStatus,
} from "../Auth/authSlice"

import {
    selectPost,
    selectPostError,
    selectPostStatus,
    getPostByUrlThunk,
    resetPostStatus,
} from "../Post/postSlice"

import { toTimeAgo } from "../../utils/DateUtils"

import { addChatThunk } from "../Chat/chatSlice"
import { toast } from "react-toastify"
import PostErrorPage from "../Error/PostErrorPage"

const SinglePostPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const params = useParams()

    const user = useSelector(selectUser)
    const post = useSelector(selectPost)
    const postImages = post?.images
    const author = post?.author

    // const [author, setAuthor] = useState(post?.author)
    const postStatus = useSelector(selectPostError)
    const postError = useSelector(selectPostError)
    const authStatus = useSelector(selectAuthStatus)

    const [showAuthorPhoneNumber, setShowAuthorPhoneNumber] = useState(false)
    const [authorFieldFixed, setAuthorFieldFixed] = useState(false)
    const [showDeletPostByIdConfirmation, setShowDeletPostByIdConfirmation] =
        useState(false)
    const [deleteConfirmationResult, setDeleteConfirmationResult] =
        useState(null)

    /**EFFECTS */

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
    // run handleDeletePostById
    useEffect(() => {
        if (deleteConfirmationResult === null) {
            return
        }

        if (deleteConfirmationResult === false) {
            return () => {
                setDeleteConfirmationResult(null)
            }
        }

        handleDeletePostById()
        return () => {
            setDeleteConfirmationResult(null)
        }
    }, [deleteConfirmationResult])

    useEffect(() => {
        ;(async () => {
            const { postUrl } = params
            const result = await dispatch(
                getPostByUrlThunk({ postUrl })
            ).unwrap()
            // console.log(">>> At useEffect, post: ", result)
        })()
    }, [])
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.pageYOffset
            if (scrollPosition >= 215) {
                setAuthorFieldFixed(true)
            } else {
                setAuthorFieldFixed(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    // Customize slider
    const [activeIndex, setActiveIndex] = useState(0)
    const sliderSettings = {
        dots: true,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: (
            <MdOutlineKeyboardArrowRight
                className="slick-next"
                fill="rgba(0,0,0,0.5)"
            />
        ),
        prevArrow: (
            <MdOutlineKeyboardArrowLeft
                className="slick-prev"
                fill="rgba(0,0,0,0.5)"
            />
        ),
        customPaging: (i) => {
            return (
                <div
                    className={` w-[10px] h-[10px] rounded-[50%] bg-gray-200 -translate-y-16 ${
                        activeIndex === i ? "bg-primary" : ""
                    }`}
                ></div>
            )
        },
        beforeChange: function (current, next) {
            setActiveIndex(next)
        },
    }

    // HANDLERS
    const handleShareUrl = () => {
        // Get the current URL
        const url = window.location.href

        // Copy the URL to the clipboard
        navigator.clipboard.writeText(url)

        // Notify the user that the URL has been copied
        alert("Đã copy Link")
    }

    const handleGoAuthorPage = async () => {
        const userId = post?.user_id
        navigate(`/user/${userId}`)
    }

    const handleConfirmDeletePost = () => {
        setShowDeletPostByIdConfirmation(false)
        setDeleteConfirmationResult(true)
    }

    const handleCancelDeletePost = () => {
        setShowDeletPostByIdConfirmation(false)
        setDeleteConfirmationResult(false)
    }

    const handleDeletePostById = async () => {
        const postId = post?.id
        const userId = user?.id
        const res = await dispatch(
            deletePostByIdThunk({ postId, userId })
        ).unwrap()
        // console.log("=> At handleDeletePostById, res: ", res)
        dispatch(resetStatus())
        navigate("/")
    }

    const handleSavedPost = async () => {
        const userId = user?.id
        const postId = post?.id

        const res = await dispatch(savePostThunk({ userId, postId })).unwrap()
        // console.log("=> savePostThunk res: ", res)
        dispatch(resetStatus())
    }
    const handleDeleteSavedPost = async () => {
        const userId = user?.id
        const postId = post?.id
        const res = await dispatch(
            deleteSavedPostThunk({ userId, postId })
        ).unwrap()
        // console.log("=> handleDeleteSavedPost res: ", res)
        dispatch(resetStatus())
    }

    const handleCheckPostSaved = () => {
        const savedPosts = user?.savedPosts
        const postId = post?.id
        const checkRes = savedPosts?.some((post) => {
            return +post.post_id === +postId
        })
        return checkRes
    }

    const handleChatWithAuthour = async () => {
        const addChatRes = await dispatch(
            addChatThunk({ userId: user.id, postId: post.id })
        ).unwrap()
        // console.log("=> addChatRes: ", addChatRes)

        if (addChatRes.errorCode === 1) {
            // chat already exist, navigate to chat page
            return navigate(`/chat/${addChatRes.chatId}`)
        }
        const chatId = addChatRes.chat.id
        navigate(`/chat/${chatId}`)
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
    const quickQuestionList = []

    const ProductImageSlider = (
        <Slider {...sliderSettings}>
            {postImages
                ? postImages.map((image) => {
                      return (
                          <div className="w-full h-[460px]">
                              <img
                                  src={image.imageUrl}
                                  alt=""
                                  className="object-cover w-full h-full "
                              />
                          </div>
                      )
                  })
                : ""}
        </Slider>
    )

    const AuthorFiled = (
        <div
            className={`${
                authorFieldFixed &&
                (deviceType === "laptop" || deviceType === "desktop")
                    ? "fixed top-0 w-[340px]"
                    : "relative"
            } border-t border-t-gray-200 py-2 ${
                deviceType === "laptop" || deviceType === "desktop"
                    ? "w-[340px]"
                    : "w-full"
            }`}
        >
            <div
                className="flex justify-start cursor-pointer bg-customWhite py-2 rounded-md px-2"
                onClick={handleGoAuthorPage}
            >
                <div className="w-12 h-12 rounded-[50%] border border-primary mr-4 ">
                    {author?.avatar ? (
                        <img
                            src={author.avatar}
                            alt="avatar"
                            className="w-full h-full object-cover rounded-[50%]"
                        />
                    ) : (
                        <>
                            <FaUserCircle className="w-full h-full text-gray-400 rounded-[50%]"></FaUserCircle>
                        </>
                    )}
                </div>
                <div className="flex-1 flex flex-col">
                    <div className="">
                        <div className="flex items-center gap-x-2 text-base text-blue-800 font-medium hover:text-gray-700 hover:underline line-clamp-1">
                            {author?.userName ? author.userName : ""}
                        </div>
                        <div className="flex items-center gap-x-2">
                            <div
                                className={
                                    `w-2 h-2 rounded-[50%] ` +
                                    (author?.isOnline
                                        ? "bg-green-600"
                                        : "bg-gray-600")
                                }
                            ></div>
                            <div
                                className={
                                    "text-2xs font-medium " +
                                    (author?.isOnline
                                        ? "text-green-700"
                                        : "text-gray-600")
                                }
                            >
                                {author?.isOnline ? (
                                    "Đang hoạt động"
                                ) : (
                                    <>{toTimeAgo(author?.updatedAt)}</>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="my-2 py-2 border-t border-b border-gray-200">
                <div className="text-gray-400 text-sm font-semibold">
                    Đánh giá:{" "}
                    <span className="px-2"> {true ? "---" : "starts"}</span>
                </div>
            </div>
            <div>
                {user?.id === post?.user_id ? (
                    <>
                        <div
                            className={`${
                                deviceType === "tablet" ? "w-[50%]" : "w-full"
                            } my-2 flex items-center justify-center text-sm bg-light-primary rounded-md py-3 px-3  cursor-pointer font-semibold text-white hover:bg-primary`}
                            onClick={(event) => {
                                event.stopPropagation()
                                setShowDeletPostByIdConfirmation(true)
                            }}
                        >
                            <div className="flex">
                                <div className="mr-2">
                                    <BiHide className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="font-semibold  hover:underline">
                                Đã bán/Ẩn tin
                            </div>
                        </div>
                        <div
                            className={`${
                                deviceType === "tablet" ? "w-[50%]" : "w-full"
                            } my-2 flex items-end justify-center border border-gray-300  rounded-md py-3 px-3  text-sm cursor-pointer hover:bg-slate-100 text-gray-700
                        `}
                            onClick={() => {
                                navigate(`/update-post/${post?.post_url}`)
                            }}
                        >
                            <div className="flex">
                                <div className="mr-2">
                                    <AiOutlineEdit className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="font-semibold  hover:underline">
                                Sửa tin
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div
                            className={
                                `${
                                    deviceType === "tablet"
                                        ? "w-[50%]"
                                        : "w-full"
                                }` +
                                " my-2 flex items-end" +
                                (author?.phoneNumber && showAuthorPhoneNumber
                                    ? " justify-around "
                                    : " justify-between ") +
                                "border border-gray-300 rounded-md py-3 px-3 text-sm cursor-pointer font-semibold text-gray-700 hover:bg-gray-200"
                            }
                            onClick={() => {
                                if (!showAuthorPhoneNumber)
                                    return setShowAuthorPhoneNumber(true)

                                navigator.clipboard.writeText(
                                    author?.phoneNumber
                                )
                                alert("Đã sao chép SĐT")
                            }}
                        >
                            {author?.phoneNumber ? (
                                showAuthorPhoneNumber ? (
                                    author.phoneNumber
                                ) : (
                                    <>
                                        <div className="flex items-end">
                                            <div>
                                                <BsFillTelephoneForwardFill className="w-6 h-6 mt-[2px]" />
                                            </div>
                                            <div className="pl-4">
                                                {author?.phoneNumber.slice(
                                                    0,
                                                    -5
                                                ) + "*****"}
                                            </div>
                                        </div>

                                        <div className="font-semibold ">
                                            Bấm để hiện số
                                        </div>
                                    </>
                                )
                            ) : (
                                "...loading"
                            )}

                            {}
                        </div>
                        <div
                            className={`${
                                deviceType === "tablet" ? "w-[50%]" : "w-full"
                            } my-2 flex items-end justify-between  rounded-md py-3 px-3 text-sm cursor-pointer bg-light-primary text-white hover:opacity-80`}
                            onClick={handleChatWithAuthour}
                        >
                            <div className="flex">
                                <div>
                                    <TbMessageCircle2Filled className="w-7 h-7" />
                                </div>
                            </div>
                            <div className="font-semibold ">
                                Chat với người bán
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )

    const PostField = (
        <div className="bg-white">
            {/* product images */}
            <div className="w-full h-[460px] relative">
                {ProductImageSlider}
                <div className="absolute bottom-0 w-full z-10 flex justify-end py-1 pr-2 bg-black-0.5 text-sm">
                    <p className="text-white">
                        Tin đăng {post?.timeAgo ? post.timeAgo : "...loading"}{" "}
                        trước
                    </p>
                </div>
            </div>

            {/* product information */}
            <div className="pt-6 pb-3">
                <h1 className="text-lg font-semibold">
                    {post?.title ? post?.title : ""}
                </h1>
            </div>

            {/* price and like post  */}
            <div className="pb-3 flex justify-between items-center text-red-500 font-medium">
                <div className="text-lg">
                    <p>
                        {post?.price
                            ? numeral(post.price)
                                  .format("0,0 ₫")
                                  .replaceAll(",", ".")
                            : "...loading"}
                        &nbsp;đ
                    </p>
                </div>
                {!handleCheckPostSaved() ? (
                    <div
                        className="border border-red-500 rounded-[20px] flex items-center py-1 px-2 cursor-pointer"
                        onClick={handleSavedPost}
                    >
                        <span>Lưu tin</span>
                        <span className="pl-2">
                            <AiOutlineHeart className="hover:scale-110 cursor-pointer" />
                        </span>
                    </div>
                ) : (
                    <div
                        className="border border-red-500 rounded-[20px] flex items-center py-1 px-2 cursor-pointer"
                        onClick={handleDeleteSavedPost}
                    >
                        <span>Hủy lưu</span>
                        <span className="pl-2">
                            <AiFillHeart className="hover:scale-110 cursor-pointer" />
                        </span>
                    </div>
                )}
            </div>

            {/* description */}
            <div className="pb-3">
                <div className="text-base font-semibold text-gray-500">
                    Mô Tả
                </div>
                <p className="w-full whitespace-normal break-words text-sm">
                    {post?.description ? post.description : "...loading"}
                </p>
            </div>

            {/* Người bán  */}
            <div
                className={`${
                    deviceType === "laptop" || deviceType === "desktop"
                        ? "hidden"
                        : "block "
                }`}
            >
                <div className="text-base font-semibold text-gray-500">
                    Người bán
                </div>
                {AuthorFiled}
            </div>

            {/* phone Number, true to hide phoneNumber, false to show phoneNumber */}

            {/* Areas  */}
            <div className="pb-3 text-sm">
                <div className="py-2 border-b border-gray-200 text-gray-500 text-base font-medium">
                    Địa chỉ
                </div>
                <div className="flex items-center justify-start gap-1 py-1">
                    <div>
                        <SlLocationPin className="w-6 h-6 text-gray-500" />
                    </div>
                    <div className="font-medium text-gray-700">
                        {post?.address ? post.address : "---"}
                    </div>
                </div>
            </div>
            {/* Quick Chat  */}
            {/* <div className="pb-3 text-sm">
                <div className="pb-2 border-b border-gray-200 text-gray-500 text-base font-medium">
                    Hỏi người bán qua chat
                </div>
                <div className="w-full overflow-x-scroll flex gap-6 py-3">
                    {quickQuestionList.map((question) => {
                        return (
                            <div className="flex-shrink-0 py-1 px-2 border border-primary rounded-[20px] cursor-pointer hover:bg-gray-100">
                                {question}
                            </div>
                        )
                    })}
                </div>
            </div> */}

            {/* share post */}
            <div className="pb-3">
                <div className="pb-2 border-b border-gray-200 text-gray-500 text-base font-medium">
                    Chia sẻ tin đăng này cho bạn bè
                </div>
                <div className="py-2">
                    <div
                        className="w-10 h-10 rounded-[50%] bg-light-primary flex items-center justify-center hover:bg-primary cursor-pointer"
                        onClick={(event) => {
                            // console.log("Click event:", event.target)
                            handleShareUrl()
                        }}
                    >
                        <BiShareAlt className="text-white w-6 h-6" />
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div className="bg-customWhite">
            {postError?.statusCode ? (
                <PostErrorPage
                    statusCode={postError.statusCode}
                    message={postError.message}
                />
            ) : (
                <>
                    <Breadcrumb
                        title1={"Bài đăng"}
                        link1={"/"}
                        title2={post?.title ? post.title : "...loading"}
                    ></Breadcrumb>
                    <div
                        className={` ${
                            deviceType === "desktop" || deviceType === "laptop"
                                ? "max-w-[1024px]"
                                : ""
                        } ${
                            deviceType === "desktop" ? "px-0" : "px-6"
                        }  m-auto`}
                    >
                        <div className={`bg-white flex py-6`}>
                            <div
                                className={` ${
                                    deviceType === "desktop" ||
                                    deviceType === "laptop"
                                        ? "w-[600px] pl-6 pb-3"
                                        : "w-full px-6"
                                }  `}
                            >
                                {PostField}
                            </div>
                            <div
                                className={`${
                                    deviceType === "laptop" ||
                                    deviceType === "desktop"
                                        ? "flex-1 flex px-6 pb-3"
                                        : "hidden"
                                } `}
                            >
                                {AuthorFiled}
                            </div>
                        </div>
                    </div>

                    {/* Other Windows  */}
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
                </>
            )}
        </div>
    )
}

export default SinglePostPage
