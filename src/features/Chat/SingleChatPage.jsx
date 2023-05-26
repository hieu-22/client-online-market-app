import React, { useEffect, useRef } from "react"
import ChatBannerSlider from "./ChatBannerSlider"
// icons
import { FaUserCircle } from "react-icons/fa"
import { GoKebabVertical } from "react-icons/go"
import {
    IoIosCheckmarkCircleOutline,
    IoIosCheckmarkCircle,
} from "react-icons/io"
import { AiFillPlusCircle, AiOutlineDelete } from "react-icons/ai"
import { RiFileAddLine, RiDeleteBin6Line } from "react-icons/ri"
import { MdEmojiEmotions } from "react-icons/md"
import { IoSendSharp } from "react-icons/io5"
import { BiUser } from "react-icons/bi"
//
import { useLocation, useNavigate, useParams, Link } from "react-router-dom"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
    addChatThunk,
    resetChatStatus,
    selectAllChats,
    selectCurrentChat,
    setCurrentChat,
} from "./chatSlice"
import { selectUser } from "../Auth/authSlice"
import { getConversationsByUserIdThunk, addMessage } from "./chatSlice"
//
import numeral from "numeral"
import { io } from "socket.io-client"
import { socket } from "../../socket"
import { current } from "@reduxjs/toolkit"
import { formatToString } from "../../utils/DateUtils"

const ChatPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [messageInput, setMessageInput] = useState("")
    const [onDeleteChatMode, setOnDeleteChatMode] = useState(false)
    const [showChatOptions, setShowChatOptions] = useState(false)
    const scrollContainerRef = useRef(null)

    // functions
    const getOtherUserFromChatMembers = (currentChat) => {
        const userId = user?.id
        let OtherUser
        currentChat?.chatMembers?.forEach((member) => {
            if (member.id !== userId) {
                OtherUser = member
            }
        })
        return OtherUser
    }

    // STATES
    const user = useSelector(selectUser)
    const chats = useSelector(selectAllChats)
    const { chatId } = useParams()
    const currentChat = useSelector(selectCurrentChat)
    const author = getOtherUserFromChatMembers(currentChat)
    const location = useLocation()
    // EFFECTS
    useEffect(() => {
        socket.connect()
        return () => {
            socket.disconnect()
        }
    }, [])

    // useEffect(() => {
    //     ;(async () => {
    //         dispatch(setCurrentChat({ chatId }))
    //     })()
    // }, [chatId])

    useEffect(() => {
        ;(async () => {
            const userId = user?.id
            const res = await dispatch(
                getConversationsByUserIdThunk({ userId: userId })
            ).unwrap()
            console.log("=> getConversationsByUserIdThunk result: ", res)
            dispatch(setCurrentChat({ chatId }))
            dispatch(resetChatStatus())
        })()
    }, [chatId])

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current
        scrollContainer.scrollTop = scrollContainer.scrollHeight
    }, [currentChat])
    // handlers
    const handleCloseAllWindow = () => {
        if (showChatOptions) {
            setShowChatOptions(false)
        }
    }
    const handleInputChange = (event) => {
        setMessageInput(event.target.value)
        adjustTextareaRows(event.target)
    }

    const adjustTextareaRows = (textarea) => {
        textarea.rows = 1
        const computedStyle = window.getComputedStyle(textarea)
        const lineHeight = parseInt(computedStyle.lineHeight)
        const { scrollHeight, clientHeight } = textarea
        const rows = Math.ceil((scrollHeight - clientHeight) / lineHeight) + 1
        if (rows > 5) return (textarea.rows = 5)
        textarea.rows = rows
    }

    const handleAddMessage = () => {
        socket.emit(
            "addMessage",
            {
                user_id: user?.id,
                content: messageInput,
                conversation_id: currentChat.id,
            },
            (error, data) => {
                if (error) {
                    return alert(error.message)
                }
                const message = data.messageData
                dispatch(addMessage(message))
            }
        )
        setMessageInput("")
    }

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
                                className={` py-3 px-2 cursor-pointer border border-slate-200 border-t-0 hover:bg-slate-100 ${
                                    +chatId === +chat.id ? "bg-slate-200" : ""
                                }`}
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

    const showAuthorizedUserMessageBox = ({
        id,
        content,
        createdAt,
        updatedAt,
    }) => {
        return (
            <div className="p-2 max-w-[60%] ">
                <div className="items-end bg-hover-primary rounded-xl p-2">
                    <div className=" text-gray-800 text-sm text-left">
                        {content}
                    </div>
                    <div className="flex justify-end text-gray-500 text-xs font-normal  pt-1">
                        <div>{formatToString(createdAt, "dd/MM/yy H:mm")}</div>
                    </div>
                </div>
                <div className="flex justify-end text-xs text-gray-400">
                    {/* <div className="flex items-center">
                Đã gửi{""}
                <span className="pl-[2px] text-gray-500 text-base">
                    <IoIosCheckmarkCircleOutline className="mt-[2px]" />
                </span>
            </div> */}
                    <div className="flex items-center">
                        Đã đọc{""}
                        <span className="pl-[2px] text-gray-400 text-base">
                            <IoIosCheckmarkCircle className="mt-[2px]" />
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    const showOtherUserMessageBox = ({ id, content, createdAt, updatedAt }) => {
        return (
            <div className="p-2 max-w-[60%] ">
                <div className="items-end bg-gray-100 rounded-xl p-2">
                    <div className=" text-gray-800 text-sm text-left">
                        {content}
                    </div>
                    <div className="flex justify-start text-gray-500 text-xs font-normal  pt-1">
                        <div>{formatToString(createdAt, "dd/MM/yy H:mm")}</div>
                    </div>
                </div>
            </div>
        )
    }

    const ChatBoxField = (
        <div className="h-full flex flex-col justify-between">
            {/* user field  */}
            <div className="w-full flex justify-between border-y border-gray-200 py-1">
                <div className="flex cursor-pointer " onClick={() => {}}>
                    <div className="w-14 h-14 p-2 ">
                        <div className="rounded-[50%] border border-primary">
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
                    </div>
                    <div className="flex flex-col justify-between ">
                        <div className="text-lg text-blue-800 font-medium hover:text-gray-700 hover:underline ">
                            {author?.userName ? author.userName : "loading..."}
                        </div>
                        <div className="flex items-center gap-x-2 w-[140px] mb-3">
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
                                    "text-xs font-medium " +
                                    (author?.isOnline
                                        ? "text-green-700"
                                        : "text-gray-600")
                                }
                            >
                                {author?.isOnline
                                    ? "Đang hoạt động"
                                    : "Không hoạt động"}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative flex items-center">
                    <GoKebabVertical
                        className="w-6 h-6 cursor-pointer"
                        onClick={(event) => {
                            event.stopPropagation()
                            setShowChatOptions(true)
                        }}
                    ></GoKebabVertical>
                    {showChatOptions ? (
                        <div
                            className=" w-[160px] absolute right-1  top-11 z-20 rounded-md py-2 text-sm bg-white shadow-big"
                            onClick={(event) => {
                                event.stopPropagation()
                            }}
                        >
                            <div className="cursor-pointer hover:bg-gray-100 flex items-center px-2 py-1">
                                <div className="px-2">
                                    <BiUser className="w-4 h-4"></BiUser>
                                </div>
                                <div className="font-medium">Xem hồ sơ</div>
                            </div>

                            <div className="cursor-pointer hover:bg-gray-100 flex items-center px-2 py-1">
                                <div className="px-2">
                                    <AiOutlineDelete className="w-4 h-4"></AiOutlineDelete>
                                </div>
                                <div className="font-medium ">
                                    Xóa hội thoại
                                </div>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            {/* post information  */}
            <div
                className="h-[80px] px-2 py-2 w-full flex gap-x-4 border-b border-gray-200 cursor-pointer hover:bg-slate-100"
                onClick={() => {
                    navigate(`/posts`)
                }}
            >
                <div className="w-[12%] h-full rounded-md">
                    {currentChat?.post ? (
                        <img
                            src={currentChat?.post.images[0].imageUrl}
                            alt="post image"
                            className="w-full h-full object-cover rounded-md"
                        />
                    ) : (
                        <></>
                    )}
                </div>
                <div className="w-[70%] inline-flex flex-col justify-between ">
                    <div>
                        <div className="font-semibold text-gray-800 text-lg truncate">
                            {currentChat?.title}
                        </div>
                        <div className="text-red-500 text-base">
                            {numeral(currentChat?.post.price)
                                .format("0,0 ₫")
                                .replaceAll(",", ".")}
                            &nbsp;đ
                        </div>
                    </div>
                </div>
            </div>
            {/* chat messages  */}
            <div
                className="flex-1 overflow-y-scroll scroll-smooth"
                ref={scrollContainerRef}
            >
                {currentChat?.messages ? (
                    currentChat.messages.map((message, index) => {
                        if (message.user_id === user.id) {
                            return (
                                <div
                                    className="flex justify-end w-full"
                                    key={index}
                                >
                                    {showAuthorizedUserMessageBox(message)}
                                </div>
                            )
                        } else {
                            return (
                                <div
                                    className="flex justify-start w-full"
                                    key={index}
                                >
                                    {showOtherUserMessageBox(message)}
                                </div>
                            )
                        }
                    })
                ) : (
                    <></>
                )}
            </div>
            {/* input field */}
            <div className="flex justify-between items-end py-3 px-2">
                <div className="flex items-end">
                    <div className="w-7 h-7 flex items-end justify-center rounded-[50%] border border-transparent hover:border-gray-200 hover:bg-slate-100 cursor-pointer">
                        <AiFillPlusCircle className="w-full h-full text-primary" />
                    </div>
                    <div className="peer-focus:hidden transition-all duration-300 w-7 h-7 flex items-end justify-center rounded-[50%] border border-transparent hover:border-gray-200 hover:bg-slate-100  cursor-pointer">
                        <RiFileAddLine className="w-full h-full text-primary" />
                    </div>
                </div>
                <div className={`flex-1 px-2`}>
                    <div className="w-full relative flex">
                        <div className="flex-1 bg-slate-100 rounded-[20px] px-4 pt-1 pr-8 focus-within:bg-slate-200">
                            <textarea
                                placeholder="Type your message..."
                                name="message"
                                value={messageInput}
                                rows={1}
                                className="peer w-full h-full py-[2px] outline-none text-sm bg-slate-100 focus:bg-slate-200 resize-none"
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                        <div className="absolute right-[6px] bottom-1 w-6 h-6 flex items-end justify-center rounded-[50%] hover:scale-110 cursor-pointer">
                            <MdEmojiEmotions className="w-full h-full text-primary" />
                        </div>
                    </div>
                </div>

                <div
                    className="flex items-center  cursor-pointer pb-1"
                    onClick={handleAddMessage}
                >
                    <IoSendSharp className="w-6 h-6 text-primary hover:scale-110" />
                </div>
            </div>
        </div>
    )

    return (
        <div
            className="bg-customWhite border-collapse h-full w-full "
            onClick={handleCloseAllWindow}
        >
            <div className="laptop:w-laptop mx-auto w-full h-full bg-white border border-slate-200 flex">
                <div className="w-[45%] h-full border-r border-r-gray-100">
                    {ChatListField}
                </div>
                <div className="w-[55%] h-full">{ChatBoxField}</div>
            </div>
        </div>
    )
}

export default ChatPage
