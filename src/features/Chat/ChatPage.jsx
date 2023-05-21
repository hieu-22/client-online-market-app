import React from "react"
import ChatBannerSlider from "./ChatBannerSlider"
// icons
import { FaUserCircle } from "react-icons/fa"
import { GoKebabVertical } from "react-icons/go"
import {
    IoIosCheckmarkCircleOutline,
    IoIosCheckmarkCircle,
} from "react-icons/io"
import { AiFillPlusCircle } from "react-icons/ai"
import { RiFileAddLine, RiDeleteBin6Line } from "react-icons/ri"
import { MdEmojiEmotions } from "react-icons/md"
import { IoSendSharp } from "react-icons/io5"

//
import { useNavigate } from "react-router-dom"
import { useState } from "react"

const ChatPage = () => {
    const chats = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 23, 4]
    const navigate = useNavigate()
    const [messageInput, setMessageInput] = useState("")
    const [onDeleteChatMode, setOnDeleteChatMode] = useState(false)

    // handlers
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

    // components
    const ChatListField = (
        <div className="h-full flex flex-col">
            <div className="py-2 pl-3 text-lg bg-gray-50 text-gray-700 font-medium">
                Tất cả hội thoại
            </div>
            <div className="overflow-y-scroll scroll-smooth flex-1">
                {chats ? (
                    chats.map((chat, index) => {
                        return (
                            <div
                                className={`flex justify-between py-3 px-2 cursor-pointer border border-slate-200 border-t-0 hover:bg-slate-100 ${
                                    index === 0 ? "bg-slate-100" : ""
                                }`}
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
                                <div className="flex w-[80%]">
                                    <div className=" h-full p-3">
                                        {false ? (
                                            <>
                                                <img
                                                    src=""
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
                                            Tên Người dùng <span> - </span>{" "}
                                            <span className="text-xs font-light ">
                                                1 ngày trước
                                            </span>
                                        </div>
                                        <div className="w-full truncate text-gray-500 font-base text-sm">
                                            Tiêu đề đoạn chat dài như vậy nè
                                        </div>
                                        <div className="w-full truncate text-xs text-gray-400 font-light">
                                            Hello bạn, đây là dòng chat cuối nè
                                            thấy chưa
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-md w-[20%]">
                                    <img
                                        className="w-full h-full object-cover rounded-md "
                                        src="https://cdn.chotot.com/uprtZ44tuzkOlf2-7bWN97u8D-5xnmL7VCA4YP0VHtg/preset:listing/plain/ff47ed2647b64b079fd7540fe7cf2f2b-2821897272662712952.jpg"
                                        alt=""
                                    />
                                </div>
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

    const AuthorizedUserMessageBox = (
        <div className="p-2 max-w-[60%] ">
            <div className="items-end bg-hover-primary rounded-xl p-2">
                <div className=" text-gray-800 text-sm text-left">
                    This is messages from Authorized User
                </div>
                <div className="flex justify-end text-gray-500 text-xs font-normal  pt-1">
                    <div>17:37</div>
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

    const OtherUserMessageBox = (
        <div className="p-2 max-w-[60%] ">
            <div className="items-end bg-gray-100 rounded-xl p-2">
                <div className=" text-gray-800 text-sm text-left">
                    This is messages from Other User
                </div>
                <div className="flex justify-start text-gray-500 text-xs font-normal  pt-1">
                    <div>17:37</div>
                </div>
            </div>
        </div>
    )

    const ChatBoxField = (
        <div className="h-full flex flex-col justify-between">
            {/* user field  */}
            <div className="w-full flex justify-between border-y border-gray-200 py-1">
                <div className="flex cursor-pointer " onClick={() => {}}>
                    <div className="w-14 h-14 p-2 ">
                        <div className="rounded-[50%] border border-primary">
                            {false ? (
                                <img
                                    src=""
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
                            {true ? "userName" : ""}
                        </div>
                        <div className="flex items-center gap-x-2 w-[140px] mb-3">
                            <div
                                className={
                                    `w-2 h-2 rounded-[50%] ` +
                                    ("online" ? "bg-green-600" : "bg-gray-600")
                                }
                            ></div>
                            <div
                                className={
                                    "text-xs font-medium " +
                                    ("online"
                                        ? "text-green-700"
                                        : "text-gray-600")
                                }
                            >
                                {"online"
                                    ? "Đang hoạt động"
                                    : "Không hoạt động"}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <GoKebabVertical className="w-6 h-6 cursor-pointer"></GoKebabVertical>
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
                    <img
                        src={
                            "https://cdn.chotot.com/uprtZ44tuzkOlf2-7bWN97u8D-5xnmL7VCA4YP0VHtg/preset:listing/plain/ff47ed2647b64b079fd7540fe7cf2f2b-2821897272662712952.jpg"
                        }
                        alt="post image"
                        className="w-full h-full object-cover rounded-md"
                    />
                </div>
                <div className="w-[70%] inline-flex flex-col justify-between ">
                    <div>
                        <div className="font-semibold text-gray-800 text-lg truncate">
                            Dell Latitude 7390 I7 8650U 16G 256G FHD Touch
                        </div>
                        <div className="text-red-500 text-base">
                            {/* {numeral(post.price)
                                .format("0,0 ₫")
                                .replaceAll(",", ".")}
                            &nbsp;đ */}
                            100.000 đ
                        </div>
                    </div>
                </div>
            </div>
            {/* chat messages  */}
            <div className="flex-1 overflow-y-scroll scroll-smooth">
                <div className="flex justify-end w-full">
                    {AuthorizedUserMessageBox}
                </div>
                <div className="flex justify-start w-full">
                    {OtherUserMessageBox}
                </div>
                <div className="flex justify-end w-full">
                    {AuthorizedUserMessageBox}
                </div>
                <div className="flex justify-start w-full">
                    {OtherUserMessageBox}
                </div>
                <div className="flex justify-end w-full">
                    {AuthorizedUserMessageBox}
                </div>
                <div className="flex justify-start w-full">
                    {OtherUserMessageBox}
                </div>
                <div className="flex justify-end w-full">
                    {AuthorizedUserMessageBox}
                </div>
                <div className="flex justify-start w-full">
                    {OtherUserMessageBox}
                </div>
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

                <div className="flex items-center  cursor-pointer pb-1">
                    <IoSendSharp className="w-6 h-6 text-primary hover:scale-110" />
                </div>
            </div>
        </div>
    )
    return (
        <div className="bg-customWhite border-collapse h-full w-full ">
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
