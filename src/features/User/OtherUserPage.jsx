import React, { useEffect, useState } from "react"
// components
import Breadcrumb from "../../components/Breadcrumb"
import Dropzone from "../../components/Dropzone"
import Loader from "../../components/Loader"
import numeral from "numeral"
// icons
import {
    BsStar,
    BsCalendar4Event,
    BsShare,
    BsFillCameraFill,
} from "react-icons/bs"
import { HiOutlineLocationMarker } from "react-icons/hi"
import { AiOutlineMail } from "react-icons/ai"
import { TbMoodEmpty } from "react-icons/tb"
import { RiMessage2Line } from "react-icons/ri"
import { FaUserCircle } from "react-icons/fa"
import {
    selectOtherUser,
    selectUserError,
    selectUserStatus,
    getUserByIdThunk,
} from "./userSlice"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

const OtherUserPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()
    const [userMenuShowed, setUserMenuShowed] = useState(false)

    const user = useSelector(selectOtherUser)
    // console.log(">>> At user: ", user)
    const error = useSelector(selectUserError)
    const status = useSelector(selectUserStatus)
    useEffect(() => {
        ;(async () => {
            const { userId } = params
            const result = await dispatch(getUserByIdThunk({ userId })).unwrap()
            console.log(">>> At handleLookPoster, result: ", result)
        })()
    }, [])
    useEffect(() => {
        if (status === "failed" && error?.code) {
            alert(
                `Error: ${error.code}\nStatusCode:${error.statusCode}\nStatusText:  ${error.statusText}`
            )
        }
    }, [status, error])
    const handleCloseAllWindows = () => {
        if (userMenuShowed) {
            setUserMenuShowed(false)
        }
    }

    const handleSwitchUserMenu = (e) => {
        e.stopPropagation()
        setUserMenuShowed(!userMenuShowed)
    }

    /**COMPONENTS */
    const userInformatiion = (
        <div className="laptop:w-laptop m-auto my-5 bg-white grid grid-cols-2 ] py-5 rounded-md shadow-md">
            {/* left side*/}
            <div className="flex ">
                <div className="w-3/12 flex justify-center">
                    <div
                        className={`rounded-[50%] h-20 w-20 border-2 border-primary translate-y-2 cursor-pointer hover:opacity-90 `}
                    >
                        {user?.avatar ? (
                            <img
                                src={user?.avatar}
                                alt="avatar"
                                className="object-cover w-full h-full rounded-[50%]"
                            />
                        ) : (
                            <FaUserCircle className="w-full h-full text-gray-400 rounded-[50%]"></FaUserCircle>
                        )}
                        <div className="absolute bottom-0 right-0 rounded-[50%] w-6 h-6 bg-gray-300 flex items-center justify-center shadow-boxMd hover:bg-gray-200 cursor-pointer">
                            <BsFillCameraFill className="" />
                        </div>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="text-lg my-2 font-semibold">
                        {user?.userName ? user.userName : ""}
                    </div>
                    <div className="flex justify-between text-sm my-2 pr-[120px]">
                        <div>
                            <span className="font-semibold">0</span> Người theo
                            dõi
                        </div>
                        <div>
                            <span className="font-semibold">0</span> Đang theo
                            dõi
                        </div>
                    </div>
                    <div className="  flex gap-x-4 ">
                        <div className="select-none cursor-pointer text-white border-[1px] bg-primary pb-1 pt-[2px] px-3 rounded-3xl hover:opacity-70 ">
                            <span className="text-lg">+</span> Theo dõi
                        </div>
                        <div
                            onClick={handleSwitchUserMenu}
                            className="relative select-none cursor-pointer h-9 w-9 rounded-[50%] border-[1px] border-gray-300 text-2xl font-extrabold text-center"
                        >
                            ...
                            {userMenuShowed ? (
                                <div
                                    className="absolute z-10  top-10 right-0 border-[1px]  shadow-md py-2 bg-white text-sm w-[200px] "
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    <div className="flex items-center px-2 py-2 gap-x-2 hover:bg-background">
                                        <div>
                                            <BsShare></BsShare>
                                        </div>
                                        <div className="font-normal">
                                            Sao chép liên kết
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* right side*/}
            <div>
                <div className="flex items-center gap-x-2 py-1">
                    <div>
                        <BsStar className="text-gray-400 w-5 h-5" />
                    </div>
                    <div className="text-gray-400 text-sm">Đánh giá:</div>
                    <div className="text-sm text-text">Chưa có đánh giá</div>
                </div>
                <div className="flex items-center gap-x-2 py-1">
                    <div>
                        <BsCalendar4Event className="text-gray-400 w-4 h-4" />
                    </div>
                    <div className="text-gray-400 text-sm">Ngày tham gia:</div>
                    <div className="text-sm text-text">
                        {new Date(user?.createdAt).toLocaleString("vi-VN", {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                        })}
                    </div>
                </div>
                <div className="flex items-center gap-x-2 py-1">
                    <div>
                        <RiMessage2Line className="text-gray-400 w-5 h-5" />
                    </div>
                    <div className="text-gray-400 text-sm">Phản hồi chat:</div>
                    <div className="text-sm text-text">72% (Trong 3 giờ)</div>
                </div>

                <div className="flex items-center gap-x-2 py-1">
                    <div>
                        <AiOutlineMail className="text-gray-400 w-5 h-5" />
                    </div>
                    <div className="text-gray-400 text-sm">Email: </div>
                    <div className="text-sm text-text">
                        {user?.email ? (
                            <a href={`mailto:${user.email}`}>{user.email}</a>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )

    const userPosts = (
        <div className="laptop:w-laptop m-auto my-5 bg-white py-5 px-4 rounded-md shadow-md">
            <div className="py-2  border-b-[1px] border-gray-300">
                <span>Tin đang đăng</span>
                <span className="px-2">-</span>
                <span className="text-gray-400">
                    {user?.posts?.length || 0} tin
                </span>
            </div>
            {user?.posts?.length > 0 ? (
                // show posts
                <>
                    {user.posts.map((post, index) => {
                        return (
                            <div
                                key={index}
                                className="h-[140px] p-4 w-full flex gap-x-4 border-b border-gray-300 cursor-pointer hover:bg-slate-100"
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
                // show that there's no post
                <>
                    <div>
                        <div className="w-[50%] m-auto">
                            <div className="my-5 flex justify-center">
                                <TbMoodEmpty className="w-20 h-20 text-gray-500"></TbMoodEmpty>
                            </div>
                            <div className="my-5 p-5 bg-background text-gray-500 text-center">
                                Người dùng chưa có tin đăng cá nhân nào đang bán
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )

    return (
        <div className="bg-customWhite " onClick={handleCloseAllWindows}>
            {status === "loadding" ? <Loader /> : <></>}
            <Breadcrumb title1={`Trang cá nhân của ${user?.userName}`} />
            {userInformatiion}
            {userPosts}
        </div>
    )
}

export default OtherUserPage
