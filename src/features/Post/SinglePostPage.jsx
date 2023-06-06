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
    selectPostImagesUrls,
    selectPostError,
    selectPostStatus,
    getPostByUrlThunk,
    resetPostStatus,
} from "../Post/postSlice"

import { toTimeAgo } from "../../utils/DateUtils"

import { addChatThunk } from "../Chat/chatSlice"
import { toast } from "react-toastify"

const SinglePostPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const params = useParams()

    const user = useSelector(selectUser)
    const post = useSelector(selectPost)
    const author = post?.author
    const postImagesUrls = useSelector(selectPostImagesUrls)
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

    const handleLookPoster = async () => {
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
            return navigate(`/chat/${addChatRes.chatId}`)
        }
        const chatId = addChatRes.chat.id
        navigate(`/chat/${chatId}`)
    }

    const quickQuestionList = []

    const ProductImageSlider = (
        <Slider {...sliderSettings}>
            {postImagesUrls
                ? postImagesUrls.map((url) => {
                      return (
                          <div className="w-full h-[460px]">
                              <img
                                  src={url}
                                  alt=""
                                  className="object-cover w-full h-full "
                              />
                          </div>
                      )
                  })
                : ""}
        </Slider>
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

            {/* phone Number, true to hide phoneNumber, false to show phoneNumber */}
            <div className=" text-sm">
                <div className="text-base font-semibold text-gray-500">
                    Liên hệ
                </div>
                <p
                    className={
                        `text-blue-400 underline cursor-pointer` +
                        (showAuthorPhoneNumber
                            ? "no-underline !text-black"
                            : "")
                    }
                >
                    {showAuthorPhoneNumber
                        ? "Số điện thoại: "
                        : "Nhấn để hiện số: "}

                    <span
                        className={"font-bold hover:underline"}
                        onClick={() => {
                            if (!showAuthorPhoneNumber)
                                return setShowAuthorPhoneNumber(true)

                            navigator.clipboard.writeText(author?.phoneNumber)
                            alert("Đã copy số điện thoại")
                        }}
                    >
                        {author?.phoneNumber
                            ? showAuthorPhoneNumber
                                ? author.phoneNumber
                                : author?.phoneNumber.slice(0, -5) + "*****"
                            : "...loading"}
                    </span>
                </p>
            </div>

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

    const AuthorFiled = (
        <div
            className={
                (authorFieldFixed ? " fixed top-0 w-[376px] " : " relative ") +
                `border-t border-t-gray-200 py-2`
            }
        >
            <div
                className="flex gap-x-3 justify-between cursor-pointer"
                onClick={handleLookPoster}
            >
                <div className="w-14 h-14 rounded-[50%] p-[1px] border border-primary">
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
                <div className="flex flex-col justify-between ml-[-12px]">
                    <div className="text-base text-blue-800 font-medium hover:text-gray-700 hover:underline ">
                        {author?.userName ? author.userName : ""}
                    </div>
                    <div className="flex items-center gap-x-2 w-[140px] mb-2">
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
                <div>
                    <div className="px-3 py-2 mt-2 text-white bg-primary rounded-[20px] hover:bg-light-primary text-sm font-medium">
                        Xem người đăng
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
                            className={
                                " my-2 flex items-center justify-center text-sm bg-light-primary rounded-md py-3 px-3 w-full  cursor-pointer font-semibold text-white hover:bg-primary"
                            }
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
                            className="my-2 flex items-end justify-center border border-gray-300  rounded-md py-3 px-3 w-full text-sm cursor-pointer hover:bg-slate-100 text-gray-700 "
                            onClick={() => {
                                navigate(`/update-post/:${post?.post_url}`)
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
                                " my-2 flex items-end" +
                                (author?.phoneNumber && showAuthorPhoneNumber
                                    ? " justify-around "
                                    : " justify-between ") +
                                "border border-gray-300 rounded-md py-3 px-3 w-full text-sm cursor-pointer font-semibold text-gray-700 hover:bg-gray-200"
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
                            className="my-2 flex items-end justify-between  rounded-md py-3 px-3 w-full text-sm cursor-pointer bg-light-primary text-white hover:opacity-80"
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

    return (
        <div className="bg-customWhite">
            <div className="laptop:w-laptop bg-white m-auto px-6">
                <Breadcrumb
                    title1={"Bài đăng"}
                    link1={"/"}
                    title2={post?.title ? post.title : "...loading"}
                ></Breadcrumb>
            </div>
            <div className="laptop:w-laptop m-auto bg-white flex">
                <div className="w-[600px] pl-6 pb-3">{PostField}</div>
                <div className="flex-1 px-6 pb-3">{AuthorFiled}</div>
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
        </div>
    )
}

export default SinglePostPage
