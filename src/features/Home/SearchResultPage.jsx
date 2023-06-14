import React from "react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import numeral from "numeral"
import {
    searchThunk,
    selectSearchError,
    selectSearchStatus,
    selectSearchedPosts,
    selectSearchedUsers,
    sortPosts,
    resetSearchStatus,
} from "./seachSlice"

import { addChatByUserIdThunk } from "../Chat/chatSlice"
// icons
import {
    MdContentPasteSearch,
    MdPersonSearch,
    MdDone,
    MdOutlineDone,
} from "react-icons/md"
import { AiOutlineCaretDown } from "react-icons/ai"
import { TfiMenuAlt } from "react-icons/tfi"
import { BsFillGridFill, BsChatFill } from "react-icons/bs"
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"
import { FaUserCircle, FaUserAltSlash } from "react-icons/fa"
import { IoOptions } from "react-icons/io5"
import { ImCancelCircle } from "react-icons/im"
import { TbMoodEmpty } from "react-icons/tb"
//
import ProductCard from "../../components/ProductCard"
import Loader from "../../components/Loader"
import Breadcrumb from "../../components/Breadcrumb"
import { useState } from "react"
import { selectUser } from "../Auth/authSlice"
import {
    savePostThunk,
    resetStatus,
    deleteSavedPostThunk,
} from "../Auth/authSlice"
import PostErrorPage from "../Error/PostErrorPage"

const SearchResultPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const user = useSelector(selectUser)
    const savedPosts = user?.savedPosts

    let [searchParams, setSearchParams] = useSearchParams()
    const searchedPosts = useSelector(selectSearchedPosts)
    const searchedUsers = useSelector(selectSearchedUsers)
    const searchError = useSelector(selectSearchError)
    const searchStatus = useSelector(selectSearchStatus)
    const [stringSortType, setStringSortType] = useState("")
    const [criteriaOptionsShowed, setCriteriaOptionsShowed] = useState(false)
    const [postsDisplayType, setPostsDisplayType] = useState("grid")
    const [searchFor, setSearchFor] = useState("post")

    useEffect(() => {
        dispatch(resetSearchStatus())
    }, [])
    useEffect(() => {
        const searchkey = searchParams.get("q")
        dispatch(resetSearchStatus())
        dispatch(searchThunk(searchkey))
    }, [searchParams])

    useEffect(() => {
        if (searchStatus === "loading") {
            // to change stringSortType when user make do searching, so that sortPosts only dispatch after the searchedPosts are already set
            setStringSortType("Tin mới trước")
        }
        if (searchStatus === "succeeded") {
            dispatch(sortPosts(stringSortType))
        }
    }, [stringSortType, searchStatus])
    /**
     * to close all the subWindow been being displayed on the screen
     */
    const handleCloseAllWindow = () => {
        setCriteriaOptionsShowed(false)
    }

    /*ADD/REMOVE SAVEDPOSTS */
    const handleCheckPostSaved = (postId) => {
        const checkRes = savedPosts?.some((post) => {
            return +post?.post_id === postId
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
    /*ADD/REMOVE SAVEDPOSTS -------------END----------------*/

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
    // HANDLE DEVICE TYPE  --------------------end------------------------
    const [userMenuShowed, setUserMenuShowed] = useState([])
    const handleCloseAllMenu = () => {
        setUserMenuShowed([])
    }

    const toggleUserMenu = (index) => {
        setUserMenuShowed((prevMenuOpen) => {
            const updatedUserMenuShowed = [...prevMenuOpen] // Create a copy of the previous state

            // Check if the menu at the given index is open or closed
            if (updatedUserMenuShowed[index]) {
                updatedUserMenuShowed[index] = false // Close the menu
            } else {
                updatedUserMenuShowed[index] = true // Open the menu
            }

            return updatedUserMenuShowed // Return the updated state
        })
    }

    /* HANDLE TO CHAT WITH USER */

    const handleChatWithOtherUser = async (otherUserId) => {
        const addChatRes = await dispatch(
            addChatByUserIdThunk({ userId: user.id, otherUserId })
        ).unwrap()
        // console.log("=> addChatRes: ", addChatRes)
        if (addChatRes.errorCode === 1) {
            return navigate(`/chat/${addChatRes.chatId}`)
        }
        const chatId = addChatRes.chat.id
        navigate(`/chat/${chatId}`)
    }
    /* HANDLE TO CHAT WITH USER  ------------------------END-------------------------*/

    /*Components */
    const FilterField = (
        <>
            {/* Filter  */}
            <div className="flex items-center ">
                <div className="min-w-[100px] w-[12%] border-b-[3px] border-primary py-2 px-3">
                    Lọc theo:{" "}
                </div>
                <div
                    className="group relative w-[160px] py-2 flex items-end cursor-pointer px-3 gap-x-3 select-none border-x border-gray-200"
                    onClick={(event) => {
                        event.stopPropagation()
                        setCriteriaOptionsShowed(!criteriaOptionsShowed)
                    }}
                >
                    <span>{stringSortType}</span>{" "}
                    <AiOutlineCaretDown className="translate-y-[-2px] text-gray-600 group-hover:text-gray-400" />
                    {criteriaOptionsShowed ? (
                        <div
                            className={`absolute top-[41px] left-0 z-10 bg-white rounded-sm shadow-boxMd w-full text-base`}
                            onClick={(event) => {
                                event.stopPropagation()
                            }}
                        >
                            <div
                                className="py-2 px-3 flex items-end hover:bg-gray-200"
                                onClick={() => {
                                    setStringSortType("Tin mới trước")
                                    setCriteriaOptionsShowed(false)
                                }}
                            >
                                Tin mới trước{" "}
                                {stringSortType === "Tin mới trước" ? (
                                    <MdDone
                                        className={`scale-[1.2] ml-4 -translate-y-[4px] text-primary`}
                                    />
                                ) : (
                                    ""
                                )}
                            </div>
                            <div
                                className="py-2 px-3 flex items-end hover:bg-gray-200"
                                onClick={() => {
                                    setStringSortType("Giá thấp trước")
                                    setCriteriaOptionsShowed(false)
                                }}
                            >
                                Giá thấp trước{" "}
                                {stringSortType === "Giá thấp trước" ? (
                                    <MdDone
                                        className={`scale-[1.2] ml-4 -translate-y-[4px] text-primary`}
                                    />
                                ) : (
                                    ""
                                )}
                            </div>
                            <div
                                className="py-2 px-3 flex items-end hover:bg-gray-200"
                                onClick={() => {
                                    setStringSortType("Giá cao trước")
                                    setCriteriaOptionsShowed(false)
                                }}
                            >
                                Giá cao trước{" "}
                                {stringSortType === "Giá cao trước" ? (
                                    <MdDone
                                        className={`scale-[1.2] ml-4 -translate-y-[4px] text-primary`}
                                    />
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            {/* dạng danh sách */}
            <div
                className="flex items-center px-3 border-l border-gray-200 cursor-pointer"
                onClick={(event) => {
                    event.stopPropagation()
                }}
            >
                {postsDisplayType === "grid" ? (
                    <div className="relative">
                        <TfiMenuAlt
                            className="peer text-[24px] text-gray-600 hover:text-gray-500"
                            onClick={() => {
                                setPostsDisplayType("list")
                            }}
                        />
                        <div className="transition-all duration-[1000s] hidden peer-hover:block absolute z-20 right-4 top-7 text-xs text-gray-500 w-[110px] rounded-sm border bg-white shadow-boxMd border-gray-100 px-2 py-1 ">
                            Dạng danh sách
                        </div>
                    </div>
                ) : (
                    <div className="relative">
                        <BsFillGridFill
                            className="peer relative text-[24px] text-gray-600 hover:text-gray-500"
                            onClick={() => {
                                setPostsDisplayType("grid")
                            }}
                        />
                        <div className="transition duration-[1000s] hidden peer-hover:block absolute z-20 right-4 top-7 text-xs text-gray-500 w-[80px] rounded-sm border bg-white shadow-boxMd border-gray-100 px-2 py-1 ">
                            Dạng lưới
                        </div>
                    </div>
                )}
            </div>
        </>
    )
    const PostsListField = (
        <div
            className={`${searchedPosts?.length > 0 ? "grid" : "flex"} ${
                postsDisplayType === "list" ? "grid-cols-1" : ""
            } ${
                postsDisplayType === "grid"
                    ? deviceType === "desktop" || deviceType === "laptop"
                        ? "grid-cols-4"
                        : deviceType === "tablet"
                        ? "grid-cols-3"
                        : "grid-cols-1"
                    : ""
            }`}
        >
            {searchedPosts?.length > 0 ? (
                searchedPosts.map((post) => {
                    if (postsDisplayType === "list") {
                        return (
                            <div
                                key={post?.id}
                                className="relative h-[120px] py-4 pr-4 w-full flex border-b border-gray-300 cursor-pointer hover:bg-gray-200"
                                onClick={() => {
                                    navigate(`/posts/${post?.post_url}`)
                                }}
                            >
                                <div
                                    className={` ${
                                        deviceType === "desktop" ||
                                        deviceType === "laptop" ||
                                        deviceType === "tablet"
                                            ? "w-[100px] flex items-center mx-4"
                                            : "w-[70px] mx-3"
                                    } h-full min-w-[70px] rounded-[12px] `}
                                >
                                    <img
                                        src={post?.images[0]?.imageUrl}
                                        alt="post image"
                                        className={`${
                                            deviceType === "desktop" ||
                                            deviceType === "laptop" ||
                                            deviceType === "tablet"
                                                ? "w-[90px] h-[80px]"
                                                : "w-[80px] h-[70px] translate-y-2"
                                        } object-cover rounded-[12px]`}
                                    />
                                </div>
                                <div className="max-w-[75%] inline-flex flex-col justify-between">
                                    <div className="flex flex-col justify-between">
                                        <div>
                                            <div className="font-semibold text-gray-800 text-lg text-ellipsis line-clamp-1">
                                                {post?.title}
                                            </div>
                                            <div className="text-red-500 text-base">
                                                {numeral(post?.price)
                                                    .format("0,0 ₫")
                                                    .replaceAll(",", ".")}
                                                &nbsp;đ
                                            </div>
                                        </div>
                                        <div className="my-2 flex justify-start items-center text-xs text-gray-400 tracking-wide ">
                                            <div className="rounded-[50%] w-5 h-5">
                                                {post?.author?.avatar ? (
                                                    <img
                                                        src={post.author.avatar}
                                                        alt=""
                                                        className="w-full h-full object-cover rounded-[50%]"
                                                    />
                                                ) : (
                                                    <>
                                                        <FaUserCircle className="w-full h-full"></FaUserCircle>
                                                    </>
                                                )}
                                            </div>
                                            <span className="px-[2px] -translate-y-[1px]">
                                                &nbsp;·&nbsp;{" "}
                                            </span>
                                            <div className="line-clamp-1">
                                                {post.timeAgo}
                                            </div>
                                            <span className="px-[2px] -translate-y-[1px]">
                                                &nbsp;·&nbsp;{" "}
                                            </span>
                                            <div className="w-[100px] text-ellipsis line-clamp-1">
                                                {post?.address
                                                    ? post.address.split(",")[
                                                          post.address.split(
                                                              ","
                                                          )?.length - 1
                                                      ]
                                                    : ""}
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
                                    {handleCheckPostSaved(post?.id) ? (
                                        <div
                                            onClick={() => {
                                                handleDeleteSavedPost(post?.id)
                                            }}
                                        >
                                            <AiFillHeart className=" text-red-700 text-2xl  hover:scale-[1.2]" />
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => {
                                                handleSavedPost(post?.id)
                                            }}
                                        >
                                            <AiOutlineHeart className=" text-red-700 text-2xl  hover:scale-[1.2]" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    }
                    if (postsDisplayType === "grid") {
                        return (
                            <div
                                className={` hover:translate-y-[-1px] ${
                                    deviceType === "smallMobile" ? "my-2" : ""
                                }`}
                                key={post.id}
                            >
                                <ProductCard
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
                    }
                })
            ) : (
                <>
                    {searchStatus === "loading" ? (
                        <Loader />
                    ) : (
                        <div
                            className={`${
                                deviceType === "desktop" ||
                                deviceType === "laptop"
                                    ? "w-[200%]"
                                    : "w-full"
                            } bg-white m-auto flex flex-col items-center rounded-xl  py-6 px-6`}
                        >
                            <div className="text-[80px] text-slate-400">
                                <TbMoodEmpty></TbMoodEmpty>
                            </div>
                            <h2 className="text-gray-800 text-lg">
                                Không tìm thấy kết quả phù hợp ...
                            </h2>
                        </div>
                    )}
                </>
            )}
        </div>
    )

    const userBlock = ({
        id,
        userName,
        avatar,
        isOnline,
        isFollowed,
        index,
    }) => {
        return (
            <div
                className={`relative select-none flex gap-x-5 w-[100%] border rounded-lg bg-white px-5  ${
                    deviceType === "smallMobile" ? "pt-1 pb-3" : "py-5"
                }`}
                onClick={() => {
                    handleCloseAllMenu()
                }}
            >
                <div className="flex justify-center items-center">
                    <Link
                        to={`/user/${id}`}
                        className={`rounded-[50%]  ${
                            deviceType === "smallMobile"
                                ? "h-12 w-12"
                                : "h-20 w-20"
                        } border-2 border-primary cursor-pointer`}
                    >
                        {avatar ? (
                            <img
                                src={avatar}
                                alt="avatar"
                                className="object-cover w-full h-full rounded-[50%]"
                            />
                        ) : (
                            <FaUserCircle className="w-full h-full text-gray-400 rounded-[50%]"></FaUserCircle>
                        )}
                    </Link>
                </div>
                <div className="flex flex-col justify-between">
                    <Link
                        to={`/user/${id}`}
                        className="text-lg my-2 font-semibold"
                    >
                        {userName ? userName : ""}
                        <span
                            className={
                                `ml-3 inline-block mx-1  w-2 h-2 rounded-[50%] ` +
                                (isOnline ? "bg-green-600" : "bg-gray-600")
                            }
                        ></span>
                        {deviceType === "smallMobile" ? (
                            <></>
                        ) : (
                            <>
                                {isOnline ? (
                                    <span className="text-green-600 text-xs">
                                        Đang hoạt động
                                    </span>
                                ) : (
                                    <span className="text-gray-600 text-xs">
                                        Không hoạt động
                                    </span>
                                )}
                            </>
                        )}
                    </Link>
                    <div
                        className={`flex gap-x-4 ${
                            deviceType === "smallMobile"
                                ? "text-xs"
                                : "text-base"
                        }`}
                        onClick={(event) => {
                            event.stopPropagation()
                        }}
                    >
                        <button
                            className="flex items-center gap-x-1 select-none cursor-pointer text-white border-[1px] border-primary pb-1 pt-[2px] px-3 rounded-3xl hover:opacity-70 "
                            onClick={() => {
                                handleChatWithOtherUser(id)
                            }}
                        >
                            <div>
                                <BsChatFill className="text-primary"></BsChatFill>
                            </div>
                            <div className="text-primary">chat</div>
                        </button>
                    </div>
                </div>
                <button
                    onClick={(event) => {
                        event.stopPropagation()
                        toggleUserMenu(index)
                    }}
                    className={`group w-8 h-8 absolute  ${
                        deviceType === "smallMobile"
                            ? "right-3 top-2"
                            : "top-3 right-7"
                    } select-none cursor-pointer rounded-[20px] border-gray-500 font-extrabold text-center`}
                >
                    <div
                        className={`w-8 h-8 text-slate-600 ${
                            !userMenuShowed[index]
                                ? "group-hover:text-slate-400"
                                : ""
                        }`}
                    >
                        <IoOptions className="text-[32px]"></IoOptions>
                    </div>
                    {userMenuShowed[index] ? (
                        <div
                            className="absolute z-10  top-10 right-0 border-[1px] rounded-md  shadow-md py-2 px-2 bg-white text-sm w-[160px] "
                            onClick={(event) => {
                                event.stopPropagation()
                            }}
                        >
                            <div className="flex items-center px-2 py-2 gap-x-2 hover:bg-background transition-all rounded-md">
                                <div
                                    className="font-normal flex-1 text-left"
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        toggleUserMenu(index)
                                        navigate(`/user/${id}`)
                                    }}
                                >
                                    Trang cá nhân
                                </div>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </button>
            </div>
        )
    }
    const UsersListField = (
        <div
            className={`grid py-6  ${
                deviceType === "desktop" || deviceType === "laptop"
                    ? "grid-cols-2"
                    : "grid-cols-1"
            } gap-x-2 gap-y-2`}
        >
            {searchedUsers?.length > 0 ? (
                searchedUsers.map((user, index) => {
                    return (
                        <div key={user?.id}>
                            {userBlock({
                                id: user?.id,
                                avatar: user?.avatar,
                                userName: user?.userName,
                                isOnline: user?.isOnline,
                                isFollowed: user?.isFollowed,
                                index,
                            })}
                        </div>
                    )
                })
            ) : (
                <>
                    {searchStatus === "loading" ? (
                        <Loader />
                    ) : (
                        <div
                            className={`${
                                deviceType === "desktop" ||
                                deviceType === "laptop"
                                    ? "w-[200%]"
                                    : "w-full"
                            } bg-white m-auto flex flex-col items-center rounded-xl  py-6`}
                        >
                            <div className="text-[80px] text-slate-400">
                                <TbMoodEmpty></TbMoodEmpty>
                            </div>
                            <h2 className="text-gray-800 text-lg">
                                Không tìm thấy kết quả phù hợp ...
                            </h2>
                        </div>
                    )}
                </>
            )}
        </div>
    )

    if (searchError?.statusCode) {
        return (
            <PostErrorPage
                statusCode={searchError.statusCode}
                message={searchError.message}
            />
        )
    }

    return (
        <>
            <Breadcrumb title1={"Kết quả tìm kiếm"} />

            <div
                className={`pb-6 mx-auto px-6 
                desktop:max-w-[1024px] desktop:px-0
                laptop:max-w-[1024px] `}
                onClick={handleCloseAllWindow}
            >
                <div className={`flex justify-center bg-customWhite`}>
                    <button
                        className={`${
                            searchFor === "post"
                                ? "flex items-center py-2 px-2 text-gray-700 font-medium hover:bg-white border-b-[3px] border-primary active"
                                : "flex items-center text-gray-400 py-2 px-2 border-b-2 border-transparent  hover:border-gray-300 hover:bg-white"
                        } py-2 px-2`}
                        onClick={() => {
                            if (searchFor === "post") {
                                return
                            }
                            setSearchFor("post")
                        }}
                    >
                        <MdContentPasteSearch className="mr-2 text-[22px]" />
                        Bài đăng
                    </button>
                    <button
                        className={`${
                            searchFor === "user"
                                ? "flex items-center py-2 px-2 text-gray-700 font-medium hover:bg-white border-b-[3px] border-primary active"
                                : "flex items-center text-gray-400 py-2 px-2 border-b-2 border-transparent  hover:border-gray-300 hover:bg-white"
                        } py-2 px-2`}
                        onClick={() => {
                            if (searchFor === "user") {
                                return
                            }
                            setSearchFor("user")
                        }}
                    >
                        <MdPersonSearch className="mr-2 text-[24px]" />
                        Người dùng
                    </button>
                </div>

                <div
                    className={`${
                        searchFor === "post" ? "flex" : "hidden"
                    } bg-white justify-between border-b border-gray-200 `}
                >
                    {FilterField}
                </div>
                <div
                    className={`bg-white ${
                        deviceType === "smallMobile" || deviceType === "mobile"
                            ? "px-0"
                            : "px-3"
                    } `}
                >
                    {searchFor === "post" ? PostsListField : <></>}
                    {searchFor === "user" ? UsersListField : <></>}
                </div>
            </div>
        </>
    )
}

export default SearchResultPage
