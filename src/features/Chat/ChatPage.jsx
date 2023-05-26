import React, { useEffect } from "react"
import ChatBannerSlider from "./ChatBannerSlider"
// icons
import { FaUserCircle } from "react-icons/fa"
import { RiFileAddLine, RiDeleteBin6Line } from "react-icons/ri"

//
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
    getConversationsByUserIdThunk,
    resetChatStatus,
    selectAllChats,
} from "./chatSlice"
import { selectUser } from "../Auth/authSlice"

const ChatPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [onDeleteChatMode, setOnDeleteChatMode] = useState(false)

    // STATES
    const user = useSelector(selectUser)
    const chats = useSelector(selectAllChats)

    // EFFECTS
    // - to fetch user's chats once when the component is mounted
    useEffect(() => {
        ;(async () => {
            const userId = user?.id
            const res = await dispatch(
                getConversationsByUserIdThunk({ userId: userId })
            ).unwrap()
            console.log("=> getConversationsByUserIdThunk result: ", res)
            dispatch(resetChatStatus())
        })()
    }, [])

    // components
    const ChatListField = (
        <div className="h-full flex flex-col">
            <div className="py-2 pl-3 text-lg bg-gray-50 text-gray-700 font-medium">
                Tất cả hội thoại
            </div>
            <div className="overflow-y-scroll scroll-smooth flex-1">
                {chats ? (
                    chats.map((chat, index) => {
                        const OtherUser =
                            chat.chatMembers[0].id === user.id
                                ? chat.chatMembers[1]
                                : chat.chatMembers[0]
                        return (
                            <div
                                key={index}
                                className={`py-3 px-2 cursor-pointer border border-slate-200 border-t-0 hover:bg-slate-100`}
                            >
                                <Link
                                    className="flex justify-between"
                                    to={`/chat/${chat.id}`}
                                >
                                    {onDeleteChatMode ? (
                                        <div className="flex align-middle">
                                            <input
                                                type="checkbox"
                                                onChange={(event) => {
                                                    // if(event.target.checked) {
                                                    //     setAimedDeletedPost([...aimedDeletedPost, ])
                                                    // }
                                                    // if(!event.target.checked) {
                                                    //     setAimedDeletedPost([...aimedDeletedPost, ])
                                                    // }
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                    <div className="flex w-[80%] ">
                                        <div className=" h-full p-3">
                                            {OtherUser?.avatar ? (
                                                <>
                                                    <img
                                                        src={OtherUser.avatar}
                                                        alt=""
                                                        className="w-full h-full object-cover rounded-[50%]"
                                                    />
                                                </>
                                            ) : (
                                                <FaUserCircle className="w-full h-full text-gray-400 rounded-[50%]"></FaUserCircle>
                                            )}
                                        </div>
                                        <div className="pl-2 w-[240px]">
                                            <div className="w-full truncate text-base text-gray-700 pb-1">
                                                {OtherUser.userName}{" "}
                                                <span> - </span>{" "}
                                                <span className="text-xs font-light ">
                                                    {chat.timeAgo}
                                                </span>
                                            </div>
                                            <div className="w-full truncate text-gray-400 font-medium text-sm ">
                                                {chat.title}
                                            </div>
                                            <div className="w-full truncate text-xs text-gray-400 font-light">
                                                {chat.messages[0]
                                                    ? chat.messages[0].content
                                                    : ""}{" "}
                                                &nbsp;
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-md w-[20%]">
                                        <img
                                            className="w-full h-full object-cover rounded-md "
                                            src={chat.post?.images[0].imageUrl}
                                            alt=""
                                        />
                                    </div>
                                </Link>
                            </div>
                        )
                    })
                ) : (
                    <></>
                )}
            </div>
            <div className="py-2 pl-3 text-lg bg-gray-50 text-gray-700 font-medium  border-y border-gray-200">
                {onDeleteChatMode ? (
                    <div className="flex justify-around">
                        <div
                            className="flex items-center justify-center px-3 py-1 text-sm text-white rounded-[20px] border bg-primary hover:bg-light-primary cursor-pointer w-[40%]"
                            onClick={() => {}}
                        >
                            Xóa
                        </div>
                        <div
                            className="flex items-center justify-center px-3 py-1 text-sm text-gray-700 rounded-[20px] border border-gray-300 hover:bg-gray-200 cursor-pointer w-[40%]"
                            onClick={() => {
                                setOnDeleteChatMode(false)
                            }}
                        >
                            Hủy
                        </div>
                    </div>
                ) : (
                    <div
                        className="flex items-center justify-center px-3 py-1 text-sm text-primary rounded-[20px] border border-primary hover:bg-hover-primary cursor-pointer w-[180px]"
                        onClick={() => {
                            setOnDeleteChatMode(true)
                        }}
                    >
                        <span className="pr-1">
                            <RiDeleteBin6Line className="w-5 h-5" />
                        </span>
                        Xóa cuộc trò chuyện
                    </div>
                )}
            </div>
        </div>
    )

    const BannerField = (
        <div className="w-full h-full py-20 flex items-center">
            <ChatBannerSlider />
        </div>
    )

    return (
        <div className="bg-customWhite border-collapse h-full w-full ">
            <div className="laptop:w-laptop mx-auto w-full h-full bg-white border border-slate-200 flex">
                <div className="w-[45%] h-full border-r border-r-gray-100">
                    {ChatListField}
                </div>
                <div className="w-[55%] h-full">{BannerField}</div>
            </div>
        </div>
    )
}

export default ChatPage
