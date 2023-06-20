import React, { useEffect } from "react"
import ChatBannerSlider from "./ChatBannerSlider"
// icons
import { FaUserCircle } from "react-icons/fa"
import { RiFileAddLine, RiDeleteBin6Line } from "react-icons/ri"
import { IoWarning } from "react-icons/io5"
import { BiMessageAdd } from "react-icons/bi"

//
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
    getConversationsByUserIdThunk,
    resetChatStatus,
    selectAllChats,
    addChats,
    removeChatById,
    addMessageToChatsById,
    addChatToChats,
    moveUpdatedChatToTop,
} from "./chatSlice"
import { selectUser } from "../Auth/authSlice"
import { io } from "socket.io-client"
import { socket } from "../../socket"
import { toTimeAgo } from "../../utils/DateUtils"
import { toast } from "react-toastify"
import { current } from "@reduxjs/toolkit"

const ChatPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [onDeleteChatMode, setOnDeleteChatMode] = useState(false)
    const [autoFetchingCount, setAutoFetchingCount] = useState(0)
    const [aimedDeletedChats, setAimedDeletedChats] = useState([])

    // STATES
    const user = useSelector(selectUser)
    const chats = useSelector(selectAllChats)

    // EFFECTS
    useEffect(() => {
        socket.on("roomMessagesUpdated", async ({ message, chatId }) => {
            const index = await chats.indexOf((chat) => chat.id === chatId)
            if (index !== -1) {
                dispatch(addMessageToChatsById({ message, index }))
                return
            } else {
                // don't have the chat in fetched chats
                socket.emit(
                    "getChatById",
                    { conversationId: chatId, userId: user.id },
                    (error, data) => {
                        if (error) {
                            return toast(error)
                        }
                        const chat = data.chat
                        dispatch(addChatToChats(chat))
                    }
                )
            }
        })
        socket.on("removeDeletedChat", (chatId) => {
            console.log("real-time update, deleted chat ", chatId)
            dispatch(removeChatById(chatId))
        })
        socket.on("sendUpdatedChatId", (chatId) => {
            dispatch(moveUpdatedChatToTop({ chatId: +chatId }))
        })
        return () => {
            socket.off("roomMessagesUpdated")
            socket.off("removeDeletedChat")
            socket.off("sendUpdatedChatId")
        }
    }, [chats])
    // To get real-time chats
    useEffect(() => {
        const userId = user?.id
        socket.emit(
            "getChatsByUserId",
            {
                userId,
            },
            (error, data) => {
                if (error) {
                    return toast(error.errorMessage)
                }
                console.log(data)
                const chats = data
                dispatch(addChats(chats))
            }
        )
        const interval = setInterval(() => {
            setAutoFetchingCount((prevCount) => prevCount + 1)
        }, 5 * 60 * 1000)

        return () => {
            clearInterval(interval)
        }
    }, [autoFetchingCount])

    // -To delete chat
    const handleDeleteChat = async () => {
        aimedDeletedChats.forEach((conversation_id) => {
            socket.emit(
                "deleteChat",
                {
                    conversation_id,
                    user_id: user.id,
                },
                (error, data) => {
                    if (error) {
                        return toast(error.message)
                    }
                    const message = data.message
                    toast(message)
                    dispatch(removeChatById(conversation_id))
                }
            )
        })
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

    // components
    const ChatListField = (
        <div className="h-full flex flex-col select-none">
            <div className="py-2 pl-3 text-lg bg-gray-50 text-gray-700 font-medium">
                Tất cả hội thoại
            </div>
            <div className="overflow-y-scroll flex-1">
                {chats.length > 0 ? (
                    chats.map((chat, index) => {
                        const OtherUser =
                            chat?.chatMembers[0].id === user.id
                                ? chat.chatMembers[1]
                                : chat.chatMembers[0]
                        return (
                            <div
                                key={index}
                                className={`h-[86px] py-3 px-2 cursor-pointer border border-slate-200 border-t-0 hover:bg-slate-100 ${
                                    chat.messages.length > 0
                                        ? !chat.messages[0]?.is_read_by_another
                                            ? chat.messages[0]?.user_id !==
                                              user.id
                                                ? "bg-slate-100"
                                                : ""
                                            : ""
                                        : ""
                                }`}
                            >
                                <Link
                                    className="h-full flex justify-between"
                                    to={`/chat/${chat.id}`}
                                >
                                    {onDeleteChatMode ? (
                                        <div
                                            className="flex align-middle mr-1"
                                            onClick={(event) => {
                                                event.stopPropagation()
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                onChange={(event) => {
                                                    if (event.target.checked) {
                                                        setAimedDeletedChats([
                                                            ...aimedDeletedChats,
                                                            chat.id,
                                                        ])
                                                        console.log(
                                                            "=>add: ",
                                                            chat.id
                                                        )
                                                    }
                                                    if (!event.target.checked) {
                                                        const index =
                                                            aimedDeletedChats.indexOf(
                                                                chat.id
                                                            )
                                                        if (index === -1)
                                                            return console.error(
                                                                "post has been unchecked"
                                                            )
                                                        let newDeletedChat =
                                                            aimedDeletedChats
                                                        newDeletedChat.splice(
                                                            index,
                                                            1
                                                        )
                                                        newDeletedChat =
                                                            newDeletedChat.filter(
                                                                Boolean
                                                            )

                                                        setAimedDeletedChats(
                                                            newDeletedChat
                                                        )
                                                        console.log(
                                                            "=>delete: ",
                                                            chat.id
                                                        )
                                                    }
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                    <div className="flex h-full w-[80%] ">
                                        <div className=" h-full w-[64px] mr-2">
                                            {OtherUser?.avatar ? (
                                                <>
                                                    <img
                                                        src={OtherUser.avatar}
                                                        alt=""
                                                        className="w-[64px] h-[64px] object-cover rounded-[50%]"
                                                    />
                                                </>
                                            ) : (
                                                <FaUserCircle className="w-full h-full text-gray-400 rounded-[50%]"></FaUserCircle>
                                            )}
                                        </div>
                                        <div className={`pl-2 w-[65%] `}>
                                            <div className="w-full truncate text-base text-gray-700 pb-1">
                                                {OtherUser.userName}{" "}
                                                <span
                                                    className={
                                                        `inline-block mx-1 w-2 h-2 rounded-[50%] ` +
                                                        (OtherUser?.isOnline
                                                            ? "bg-green-600"
                                                            : "bg-gray-600")
                                                    }
                                                ></span>
                                                {OtherUser?.isOnline ? (
                                                    <span className="text-green-600 text-xs">
                                                        Đang hoạt động
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-600 text-xs">
                                                        {toTimeAgo(
                                                            OtherUser.updatedAt
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="w-full truncate text-gray-400 font-medium text-sm ">
                                                {chat?.title}
                                            </div>
                                            <div
                                                className={`w-full truncate text-xs text-gray-400 font-light ${
                                                    !chat.messages[0]
                                                        ?.is_read_by_another
                                                        ? chat.messages[0]
                                                              ?.user_id !==
                                                          user.id
                                                            ? "text-gray-800 font-medium"
                                                            : ""
                                                        : ""
                                                }`}
                                            >
                                                {chat.messages[0]
                                                    ? chat.messages[0].content
                                                    : ""}{" "}
                                                &nbsp;
                                                <span>
                                                    {chat.messages[0]
                                                        ? `- ${toTimeAgo(
                                                              chat.messages[0]
                                                                  .createdAt
                                                          )}`
                                                        : ""}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {chat?.post ? (
                                        <div className="rounded-md h-full w-[86px]">
                                            <img
                                                className="w-full h-full object-cover rounded-md "
                                                src={
                                                    chat.post?.images[0]
                                                        ?.imageUrl
                                                }
                                                alt=""
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-[20%]"></div>
                                    )}
                                </Link>
                            </div>
                        )
                    })
                ) : (
                    <div className="p-2 px-3 rounded-sm flex items-center bg-hover-primary">
                        <div>
                            <IoWarning
                                className={"text-white text-xl"}
                            ></IoWarning>
                        </div>
                        <p className="pl-2">Bạn chưa có cuộc hội thoại nào!</p>
                    </div>
                )}
            </div>
            <div className="relative py-2 pl-3 text-lg bg-gray-50 text-gray-700 font-medium  border-y border-gray-200">
                {onDeleteChatMode ? (
                    <div className="flex justify-around">
                        <div
                            className="flex items-center justify-center px-3 py-1 text-sm text-white rounded-[20px] border bg-primary hover:bg-light-primary cursor-pointer w-[40%]"
                            onClick={() => {
                                setOnDeleteChatMode(false)
                                handleDeleteChat()
                            }}
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
                    <>
                        <button
                            className="flex items-center justify-center px-3 py-1 text-sm text-primary rounded-[20px] border border-primary hover:bg-hover-primary cursor-pointer w-[180px] disabled:cursor-default disabled:hover:bg-inherit"
                            onClick={() => {
                                setOnDeleteChatMode(true)
                            }}
                            disabled={chats.length === 0 ? true : false}
                        >
                            <span className="pr-1">
                                <RiDeleteBin6Line className="w-5 h-5" />
                            </span>
                            Xóa cuộc trò chuyện
                        </button>
                        <button
                            className="absolute right-6 bottom-2"
                            onClick={() => {
                                navigate("/users/suggests")
                            }}
                        >
                            <BiMessageAdd className="text-primary w-7 h-7 hover:scale-110 hover:font-medium"></BiMessageAdd>
                        </button>
                    </>
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
                <div
                    className={`${
                        deviceType === "laptop" || deviceType === "desktop"
                            ? "w-[45%]"
                            : "w-full"
                    }  
                             h-full border-r border-r-gray-100 `}
                >
                    {ChatListField}
                </div>
                <div
                    className={`${
                        deviceType === "laptop" || deviceType === "desktop"
                            ? "block"
                            : "hidden"
                    } w-[55%] h-full`}
                >
                    {BannerField}
                </div>
            </div>
        </div>
    )
}

export default ChatPage
