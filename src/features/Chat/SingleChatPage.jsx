import React, { useEffect, useRef } from "react"
import ChatBannerSlider from "./ChatBannerSlider"
// icons
import { FaUserCircle, FaShare } from "react-icons/fa"
import { GoKebabVertical, GoKebabHorizontal } from "react-icons/go"
import { MdDeleteOutline } from "react-icons/md"
import { AiFillPlusCircle, AiOutlineDelete } from "react-icons/ai"
import { RiFileAddLine, RiDeleteBin6Line } from "react-icons/ri"
import { MdEmojiEmotions } from "react-icons/md"
import { IoSendSharp } from "react-icons/io5"
import { BiUser } from "react-icons/bi"
import { BsEmojiSmile, BsEmojiSmileFill } from "react-icons/bs"
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
    selectEmojis,
    removeChatById,
    removeMessage,
    addMoreMessagesToCurrentChat,
    updateMessageIsRead,
} from "./chatSlice"
import { selectUser } from "../Auth/authSlice"
import {
    addMessageToCurrentChat,
    getEmojisThunk,
    addChats,
    giveDeletedFlagToMessage,
    addMessageToChatsById,
    addChatToChats,
    moveUpdatedChatToTop,
} from "./chatSlice"
//
import numeral from "numeral"
import { socket } from "../../socket"
import { formatToString } from "../../utils/DateUtils"
import { toTimeAgo } from "../../utils/DateUtils"

const ChatPage = () => {
    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [messageInput, setMessageInput] = useState("")
    const [onDeleteChatMode, setOnDeleteChatMode] = useState(false)
    const [aimedDeletedChats, setAimedDeletedChats] = useState([])

    const [showChatOptions, setShowChatOptions] = useState(false)
    const scrollContainerRef = useRef(null)
    const [showEmojiesBlock, setShowEmojiesBlock] = useState(false)
    const [showMiniEmojiBlocks, setShowMiniEmojiBlocks] = useState([])
    const [textareaRows, setTextareaRows] = useState(1)
    const [showDeleteMessageBlock, setShowDeleteMessageBlock] = useState([])
    const [previousPos, setPreviousPos] = useState()
    const [messageAvalable, setMessageAvalable] = useState(true)

    const [autoFetchingCount, setAutoFetchingCount] = useState(0)
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
    const currentOtherUser = getOtherUserFromChatMembers(currentChat)
    const location = useLocation()
    const emojis = useSelector(selectEmojis)
    // EFFECTS
    // socket io listeners
    useEffect(() => {
        socket.on("roomMessagesUpdated", async ({ message, chatId }) => {
            const index = await chats.findIndex((chat) => chat.id === chatId)
            if (currentChat?.id === +chatId) {
                dispatch(addMessageToCurrentChat(message))
                dispatch(addMessageToChatsById({ message, index }))
                return
            } else if (index > -1) {
                dispatch(addMessageToChatsById({ message, index }))
                return
            } else {
                // don't have the chat in fetched chats
                socket.emit(
                    "getChatById",
                    { conversationId: chatId, userId: user.id },
                    (error, data) => {
                        if (error) {
                            return alert(error)
                        }
                        const chat = data.chat
                        dispatch(addChatToChats(chat))
                    }
                )
            }
        })
        socket.on("updateDeletedMessage", (messageId) => {
            dispatch(giveDeletedFlagToMessage(messageId))
        })
        socket.on("sendUpdatedChatId", (conversation_id) => {
            dispatch(moveUpdatedChatToTop({ chatId: +conversation_id }))
        })
        return () => {
            socket.off("removeDeletedChat")
            socket.off("roomMessagesUpdated")
            socket.off("sendUpdatedChatId")
        }
    }, [chats, currentChat])

    // get emoji from another server
    useEffect(() => {
        // to fetch emojis when components is mounted
        ;(async () => {
            const res = await dispatch(getEmojisThunk()).unwrap()
            // console.log("=> getEmojisThunk res: ", res)
            dispatch(resetChatStatus())
        })()
    }, [])

    // fetch chats when autoFetchingCount change
    useEffect(() => {
        const userId = user?.id
        socket.emit(
            "getChatsByUserId",
            {
                userId,
            },
            (error, data) => {
                if (error) {
                    return alert(error.errorMessage)
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

    useEffect(() => {
        const { chatId } = params
        const userId = user.id
        socket.emit(
            "getChatById",
            { conversationId: chatId, userId },
            (error, data) => {
                if (error) {
                    return alert(error.errorMessage)
                }

                const chat = data.chat
                dispatch(setCurrentChat(chat))
            }
        )
    }, [params])
    // useEffect(() => {
    //     ;(async () => {
    //         const userId = user?.id
    //         const res = await dispatch(
    //             getConversationsByUserIdThunk({ userId: userId })
    //         ).unwrap()
    //         // console.log("=> getConversationsByUserIdThunk result: ", res)
    //         dispatch(setCurrentChat({ chatId }))
    //         dispatch(resetChatStatus())
    //     })()
    // }, [chatId])

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current
        scrollContainer.scrollTop = scrollContainer.scrollHeight
    }, [])

    useEffect(() => {
        setMessageAvalable(true)
        const scrollContainer = scrollContainerRef.current
        scrollContainer.scrollTop = scrollContainer.scrollHeight
    }, [chatId])

    // HANDLERS
    const handleCloseAllWindow = () => {
        if (showChatOptions) {
            setShowChatOptions(false)
        }
        if (showEmojiesBlock) {
            setShowEmojiesBlock(false)
        }

        setShowMiniEmojiBlocks([])
        setShowDeleteMessageBlock([])
    }
    const toggleEmojiBlock = (index) => {
        const updatedEmojiBlocks = [...showMiniEmojiBlocks]
        let newBlock = []
        newBlock[index] = !updatedEmojiBlocks[index]
        setShowMiniEmojiBlocks(newBlock)
    }

    const toggleDeleteMessageBlock = (index) => {
        const updatedBlock = [...showDeleteMessageBlock]
        let newBlock = []
        newBlock[index] = !updatedBlock[index]
        setShowDeleteMessageBlock(newBlock)
    }

    const handleInputChange = (event) => {
        setMessageInput(event.target.value)
        adjustTextareaRows(event.target)
    }

    const adjustTextareaRows = (textarea, isDeleted) => {
        if (isDeleted === true) {
            return (textarea.rows = 1)
        }
        textarea.rows = 1
        const computedStyle = window.getComputedStyle(textarea)
        const lineHeight = parseInt(computedStyle.lineHeight)
        const { scrollHeight, clientHeight } = textarea
        const rows = Math.ceil((scrollHeight - clientHeight) / lineHeight) + 1
        if (rows > 5) return (textarea.rows = 5)
        textarea.rows = rows
    }

    const handleAddMessage = (event) => {
        socket.emit(
            "addMessage",
            {
                user_id: user?.id,
                content: messageInput,
                conversation_id: currentChat.id,
                otherUser_id: currentOtherUser.id,
            },
            (error) => {
                if (error) {
                    return alert(error.message)
                }
            }
        )
        setMessageInput("")
        setTextareaRows(1)
    }

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
                        return alert(error.message)
                    }
                    const message = data.message
                    alert(message)
                    if (currentChat.id === +conversation_id) {
                        dispatch(removeChatById(conversation_id))
                        dispatch(setCurrentChat(null))
                        return navigate("/chat")
                    }
                    dispatch(removeChatById(chatId))
                }
            )
        })
    }

    const handleHideMessageByOwner = async (messageId) => {
        setShowDeleteMessageBlock([])
        const userId = user.id
        const conversationId = currentChat.id
        socket.emit(
            "hideMessageByOwner",
            { userId, messageId, conversationId },
            (error, response) => {
                if (error) {
                    return alert(error.message)
                }
                dispatch(removeMessage(messageId))
            }
        )
    }

    const handleHideMessageByAnother = async (messageId) => {
        setShowDeleteMessageBlock([])
        const userId = user.id
        const conversationId = currentChat.id
        socket.emit(
            "hideMessageByAnother",
            { userId, messageId, conversationId },
            (error, response) => {
                if (error) {
                    return alert(error.message)
                }
                dispatch(removeMessage(messageId))
            }
        )
    }

    const handleDeleteMessage = async (messageId) => {
        setShowDeleteMessageBlock([])
        const userId = user.id
        const conversationId = currentChat.id
        socket.emit(
            "deleteMessageById",
            { userId, messageId, conversationId },
            (error, response) => {
                if (error) {
                    return console.log("Internal Server Error", error)
                }
                alert(response.message)
            }
        )
    }

    useEffect(() => {
        const container = scrollContainerRef.current
        container.scrollTop = container.scrollHeight
    }, [chatId])
    useEffect(() => {
        const container = scrollContainerRef.current
        container.scrollTop = container.scrollHeight
    }, [currentChat])

    useEffect(() => {
        const container = scrollContainerRef.current
        container.scrollTo({
            top: container.scrollHeight - previousPos,
            behavior: "instant",
        })
    }, [previousPos])

    // tell server that the user has just read the messages
    useEffect(() => {
        if (currentChat) {
            const userId = user?.id
            const chatId = currentChat?.id
            const unreadMessageIds = currentChat.messages.map((message) => {
                if (!message.is_read_by_another && userId !== message.user_id) {
                    return message.id
                }
                return undefined
            })
            const ids = unreadMessageIds.filter(Boolean)
            socket.emit(
                "updateMessageIsRead",
                { userId, messageIds: ids },
                (error, reponse) => {
                    if (error) {
                        return alert(error)
                    }
                    // set message.is_read_by_another: true in the state if database update successfully
                    dispatch(updateMessageIsRead({ chatId }))
                }
            )
        }
    }, [currentChat])
    const handleScrollPosition = () => {
        const scrollContainer = scrollContainerRef.current

        if (scrollContainer.scrollTop === 0) {
            const pos = scrollContainer.scrollHeight
            const chatId = currentChat.id
            const offset = currentChat.messages.length
            socket.emit(
                "getMoreMessages",
                { chatId, offset },
                async (error, data) => {
                    if (error) {
                        alert(error.message)
                    }

                    const messages = data.messages
                    if (messages?.length === 0) {
                        return setMessageAvalable(false)
                    }
                    dispatch(addMoreMessagesToCurrentChat(messages))
                    setPreviousPos(pos)
                }
            )
        }
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
                            chat?.chatMembers[0].id === user.id
                                ? chat.chatMembers[1]
                                : chat.chatMembers[0]
                        return (
                            <div
                                key={index}
                                className={` py-3 px-2 cursor-pointer border border-slate-200 border-t-0 hover:bg-slate-100 ${
                                    +chatId === +chat.id ? "bg-slate-200" : ""
                                } ${
                                    !chat.messages[0].is_read_by_another
                                        ? chat.messages[0].user_id !== user.id
                                            ? "bg-slate-100"
                                            : ""
                                        : ""
                                }`}
                            >
                                <Link
                                    className="flex justify-between"
                                    to={`/chat/${chat.id}`}
                                >
                                    {onDeleteChatMode ? (
                                        <div
                                            className="flex align-middle"
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
                                    <div className="flex w-[80%] ">
                                        <div className="h-full w-[64px] p-3">
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
                                                <span
                                                    className={
                                                        `inline-block mx-1  w-2 h-2 rounded-[50%] ` +
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
                                                {chat.title}
                                            </div>
                                            <div
                                                className={`w-full truncate text-xs text-gray-400 font-light ${
                                                    !chat.messages[0]
                                                        .is_read_by_another
                                                        ? chat.messages[0]
                                                              .user_id !==
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
                                                    -{" "}
                                                    {chat.messages[0]
                                                        ? toTimeAgo(
                                                              chat.messages[0]
                                                                  .createdAt
                                                          )
                                                        : ""}
                                                </span>
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

    const interactingEmojis = ["😆", "😍", "😮", "🤔", "😅", "😭"]

    const miniEmojisBlock = (
        <div
            className={`bg-white rounded-[20px] shadow-big py-2 px-4 gap-2 flex`}
        >
            {interactingEmojis.map((emoji, index) => {
                return (
                    <div
                        key={index}
                        className="cursor-pointer rounded-md text-center scale-[1.4] w-[24px] h-[24px] flex items-end justify-center hover:scale-150"
                        onClick={(event) => {}}
                    >
                        {emoji}
                    </div>
                )
            })}
        </div>
    )

    const showAuthorizedUserMessageBox = (
        { id, content, createdAt, is_deleted },
        index
    ) => {
        return (
            <>
                {is_deleted ? (
                    <div className="text-sm text-gray-400 rounded-[12px] border py-[6px] m-3 px-3 bg-slate-50">
                        Tin nhắn đã bị xóa bởi bạn
                    </div>
                ) : (
                    <>
                        <div className="group relative peer p-3 max-w-[60%] ">
                            <div className="bg-hover-primary rounded-[12px] py-[6px] px-3">
                                <div className=" text-gray-800 text-sm text-left">
                                    {content}
                                </div>
                            </div>
                            <div className="w-[100px] absolute bottom-[-13px] right-3 hidden group-hover:flex justify-end text-gray-400  rounded-sm text-xs font-normal py-2 px-1">
                                <div>
                                    {formatToString(createdAt, "H:mm dd/MM/yy")}
                                </div>
                            </div>
                        </div>
                        <div
                            className="group hidden peer-hover:flex hover:flex items-center text-gray-500 gap-x-[2px]"
                            onClick={(event) => {
                                event.stopPropagation()
                            }}
                        >
                            <div
                                className="relative select-none w-6 h-6 cursor-pointer flex items-center justify-center rounded-[50%] hover:bg-slate-200 hover:text-gray-700"
                                onClick={() => {
                                    toggleDeleteMessageBlock(index)
                                }}
                            >
                                <MdDeleteOutline className="scale-110"></MdDeleteOutline>
                                {showDeleteMessageBlock[index] && (
                                    <div
                                        className="absolute bottom-[22px] right-[-40px] z-50 w-[100px] text-sm font-medium rounded-md py-2 bg-white shadow-boxMd"
                                        onClick={(event) => {
                                            event.stopPropagation()
                                        }}
                                    >
                                        <div
                                            className="hover:bg-gray-200 cursor-pointer px-2"
                                            onClick={() => {
                                                handleDeleteMessage(id)
                                            }}
                                        >
                                            Xóa tin nhắn
                                        </div>
                                        <div
                                            className="hover:bg-gray-200 cursor-pointer px-2"
                                            onClick={() => {
                                                handleHideMessageByOwner(id)
                                            }}
                                        >
                                            Gỡ phía bạn
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* <div className="w-6 h-6 cursor-pointer flex items-center justify-center rounded-[50%] hover:bg-slate-200 hover:text-gray-700"
                    >
                        <FaShare></FaShare>
                    </div> */}
                            {/* <div
                        className="relative w-6 h-6 cursor-pointer flex items-center justify-center rounded-[50%] hover:bg-slate-200 hover:text-gray-700"
                        onClick={(event) => {
                            toggleEmojiBlock(index)
                        }}
                    >
                        <BsEmojiSmile></BsEmojiSmile>
                        {showMiniEmojiBlocks[index] && (
                            <div
                                className={`absolute bottom-[32px] left-[-100px] z-50 ${
                                    showMiniEmojiBlocks[index]
                                        ? "visible"
                                        : "invisible"
                                }`}
                                onClick={(event) => {
                                    event.stopPropagation()
                                }}
                            >
                                {miniEmojisBlock}
                            </div>
                        )}
                    </div> */}
                        </div>
                    </>
                )}
            </>
        )
    }

    const showOtherUserMessageBox = (
        { id, content, createdAt, is_deleted },
        index
    ) => {
        return (
            <>
                <div className="w-[32px] h-[32px] rounded-[50%] translate-y-3 ml-2">
                    {currentOtherUser?.avatar ? (
                        <img
                            src={currentOtherUser.avatar}
                            alt="avatar"
                            className="w-full h-full object-cover rounded-[50%]"
                        />
                    ) : (
                        <>
                            <FaUserCircle className="w-full h-full text-gray-400 rounded-[50%]"></FaUserCircle>
                        </>
                    )}
                </div>
                {is_deleted ? (
                    <div className="text-sm text-gray-400 rounded-[12px] border py-[6px] m-3 px-3 bg-slate-50">
                        Tin nhắn đã bị xóa bởi {currentOtherUser.userName}
                    </div>
                ) : (
                    <>
                        <div className="group peer py-3 max-w-[60%]">
                            <div className="relative flex items-center">
                                <div className="items-center text-gray-800 text-sm text-left bg-gray-100 rounded-[12px] py-[6px] px-3 ml-1">
                                    {content}
                                </div>
                            </div>
                            <div className="w-[100px] absolute bottom-[-13px] left-3 hidden group-hover:flex justify-start text-gray-400  rounded-sm text-xs font-normal py-2 px-1 ml-8">
                                <div>
                                    {formatToString(createdAt, "H:mm dd/MM/yy")}
                                </div>
                            </div>
                        </div>
                        <div
                            className="hidden peer-hover:flex hover:flex flex-row-reverse items-center text-gray-500 gap-x-[2px] pl-2"
                            onClick={(event) => {
                                event.stopPropagation()
                            }}
                        >
                            <div
                                className="relative w-6 h-6 cursor-pointer flex items-center justify-center rounded-[50%] hover:bg-slate-200 hover:text-gray-700"
                                onClick={(event) => {
                                    toggleDeleteMessageBlock(index)
                                }}
                            >
                                <MdDeleteOutline className="scale-110"></MdDeleteOutline>
                                {showDeleteMessageBlock[index] && (
                                    <div
                                        className="absolute bottom-[22px] left-[-40px] z-50 w-[100px] text-sm font-medium rounded-md py-2 bg-white shadow-boxMd"
                                        onClick={(event) => {
                                            event.stopPropagation()
                                        }}
                                    >
                                        <div
                                            className="hover:bg-gray-200 cursor-pointer px-2"
                                            onClick={() => {
                                                handleHideMessageByAnother(id)
                                            }}
                                        >
                                            Gỡ phía bạn
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* <div className="w-6 h-6 cursor-pointer flex items-center justify-center rounded-[50%] hover:bg-slate-200 hover:text-gray-700">
                        <FaShare></FaShare>
                    </div>
                    <div
                        className="relative w-6 h-6 cursor-pointer flex items-center justify-center rounded-[50%] hover:bg-slate-200 hover:text-gray-700"
                        onClick={(event) => {
                            toggleEmojiBlock(index)
                        }}
                    >
                        {showMiniEmojiBlocks[index] && (
                            <div
                                className="absolute bottom-[30px] left-[-90px] z-[999]"
                                onClick={(event) => {
                                    event.stopPropagation()
                                }}
                            >
                                {miniEmojisBlock}
                            </div>
                        )}
                        <BsEmojiSmile></BsEmojiSmile>
                    </div> */}
                        </div>
                    </>
                )}
            </>
        )
    }

    const emojisBlock = (
        <div className="rounded-md shadow-big">
            <div className="text-sm text-gray-400 font-medium px-3 py-1">
                Icons
            </div>
            <div className="grid grid-cols-8 gap-3 px-3 py-2 justify-around h-[250px] overflow-y-scroll">
                {emojis ? (
                    emojis.map((emoji, index) => {
                        return (
                            <div
                                className="cursor-pointer rounded-md text-center scale-150 w-[24px] h-[24px] flex items-end justify-center hover:bg-slate-200"
                                style={{ lineHeight: "26px" }}
                                title={emoji.unicodeName}
                                key={index}
                                // dangerouslySetInnerHTML={{
                                //     __html: `<span className="text-center hover:bg-gray-100">${emoji.codePoint}</span>`,
                                // }}
                                onClick={() => {
                                    setMessageInput(
                                        messageInput + emoji.character
                                    )
                                }}
                            >
                                {emoji.character}
                            </div>
                        )
                    })
                ) : (
                    <></>
                )}
            </div>
        </div>
    )
    const ChatBoxField = (
        <div className="h-full flex flex-col justify-between">
            {/* user field  */}
            <div className="w-full flex justify-between border-y border-gray-200 py-1">
                <div className="flex cursor-pointer " onClick={() => {}}>
                    <div className="w-14 h-14 p-2 ">
                        <div className="rounded-[50%] w-full h-full border border-primary">
                            {currentOtherUser?.avatar ? (
                                <img
                                    src={currentOtherUser.avatar}
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
                            {currentOtherUser?.userName
                                ? currentOtherUser.userName
                                : "loading..."}
                        </div>
                        <div className="flex items-center gap-x-2 w-[140px] mb-3">
                            <div
                                className={
                                    `w-2 h-2 rounded-[50%] ` +
                                    (currentOtherUser?.isOnline
                                        ? "bg-green-600"
                                        : "bg-gray-600")
                                }
                            ></div>
                            <div
                                className={
                                    "text-xs font-medium " +
                                    (currentOtherUser?.isOnline
                                        ? "text-green-700"
                                        : "text-gray-600")
                                }
                            >
                                {currentOtherUser?.isOnline
                                    ? "Online"
                                    : "Offline"}
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
                    navigate(`/posts/${currentChat?.post?.post_url}`)
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
                className="flex-1 overflow-y-scroll scroll-smooth pb-4"
                ref={scrollContainerRef}
                onScroll={handleScrollPosition}
            >
                <div className="py-2 text-sm italic text-gray-400 text-center">
                    {messageAvalable ? "" : "không còn tin nhắn"}
                </div>
                {currentChat?.messages ? (
                    currentChat.messages.map((message, index) => {
                        if (message.user_id === user.id) {
                            return (
                                <div
                                    className="relative flex flex-row-reverse justify-start w-full"
                                    key={index}
                                    onClick={() => {
                                        if (showDeleteMessageBlock[index]) {
                                            toggleDeleteMessageBlock(index)
                                        }
                                    }}
                                >
                                    {showAuthorizedUserMessageBox(
                                        message,
                                        index
                                    )}
                                </div>
                            )
                        } else {
                            return (
                                <>
                                    <div
                                        className="relative flex justify-start w-full"
                                        key={index}
                                        onClick={() => {
                                            if (showDeleteMessageBlock[index]) {
                                                toggleDeleteMessageBlock(index)
                                            }
                                        }}
                                    >
                                        {showOtherUserMessageBox(
                                            message,
                                            index
                                        )}
                                    </div>
                                </>
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
                                rows={textareaRows}
                                className="peer w-full h-full py-[2px] outline-none text-sm bg-slate-100 focus:bg-slate-200 resize-none"
                                onChange={handleInputChange}
                                onBlur={(event) => {
                                    adjustTextareaRows(event.target, true)
                                }}
                            ></textarea>
                        </div>
                        <div className="absolute right-[6px] bottom-1 w-6 h-6 flex items-end justify-center rounded-[50%] hover:scale-110 cursor-pointer">
                            <MdEmojiEmotions
                                className="w-full h-full text-primary"
                                onClick={() => {
                                    setShowEmojiesBlock(true)
                                }}
                            />
                        </div>
                        {showEmojiesBlock ? (
                            <div
                                className="absolute bottom-10 right-0 z-20 bg-white"
                                onClick={(event) => {
                                    event.stopPropagation()
                                }}
                            >
                                {emojisBlock}
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>

                <div
                    className="flex items-center  cursor-pointer pb-1"
                    onClick={(event) => {
                        handleAddMessage(event)
                    }}
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
