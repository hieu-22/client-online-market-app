import React, { useEffect } from "react"
import Breadcrumb from "../../components/Breadcrumb"
import { useDispatch, useSelector } from "react-redux"
import { selectUser } from "../Auth/authSlice"
import { useState } from "react"
import Dropzone from "../../components/Dropzone"
import { updateAvatarThunk } from "../Auth/authSlice"

// import icons
import { BsFillCameraFill } from "react-icons/bs"
import { FaUserCircle } from "react-icons/fa"

const UserSettingPage = () => {
    const dispatch = useDispatch()
    const user = useSelector(selectUser)

    const [userEmail, setUserEmail] = useState(user?.email)
    const [userName, setUserName] = useState(user?.userName)
    const [userPhoneNumber, setUserPhoneNumber] = useState(user?.phoneNumber)
    const [userIntroduction, setUserIntroduction] = useState(user?.introduction)
    const [password, setPassword] = useState(null)
    const [newPassword, setNewPassword] = useState(null)
    const [newRepeatedPassword, setNewRepeatedPassword] = useState(null)
    const [showImageUploader, setShowImageUploader] = useState(false)
    const [avatarImage, setAvatarImage] = useState([])

    const [InforSubmitButtonDisabled, setInforSubmitButtonDisabled] =
        useState(null)

    const [
        ChangePasswordSubmitButtonDisabled,
        setChangePasswordSubmitButtonDisabled,
    ] = useState(null)

    // handlers for ui
    // - handle disable InforSubmitButtonDisabled
    useEffect(() => {
        if (InforSubmitButtonDisabled === null) {
            return setInforSubmitButtonDisabled(true)
        }

        if (
            userPhoneNumber !== user?.phoneNumber ||
            userIntroduction !== user?.introduction ||
            avatarImage.length !== 0
        ) {
            return setInforSubmitButtonDisabled(false)
        }
        setInforSubmitButtonDisabled(true)
    }, [userPhoneNumber, userIntroduction, avatarImage])
    // - handle disable ChangePasswordSubmitButtonDisabled
    useEffect(() => {
        if (ChangePasswordSubmitButtonDisabled === null) {
            return setChangePasswordSubmitButtonDisabled(true)
        }

        if (password && newPassword && newRepeatedPassword) {
            return setChangePasswordSubmitButtonDisabled(false)
        }
        setChangePasswordSubmitButtonDisabled(true)
    }, [password, newPassword, newRepeatedPassword])

    const handleCloseImageUploader = () => {
        if (showImageUploader) {
            setShowImageUploader(false)
        }
    }
    // handler for calling api
    const handleUpdateAvatar = async (e) => {
        e.preventDefault()
        const formData = new FormData()

        for (let i = 0; i < avatarImage.length; i++) {
            const file = avatarImage[i].file
            // Append the file to the FormData object
            formData.append("avatar", file, file.name)
        }
        const userId = user.id

        handleCloseImageUploader()
        // console.log("===> saved avatar: ", formData.get("avatar"))
        const result = await dispatch(
            updateAvatarThunk({ formData, userId })
        ).unwrap()
        console.log("===> Update Avatar Result: ", result)
        setAvatarImage([])
    }

    // components
    const ImageUploader = (
        <div
            className="flex flex-col items-center justify-center absolute h-[1400px] top-0 bottom-0 left-0 right-0 z-[50] bg-black-0.1 shadow-sm"
            onClick={handleCloseImageUploader}
        >
            <Dropzone
                className={"top-[100px]"}
                text="Tải ảnh lên"
                title="Cập nhập ảnh đại diện"
                setImages={setAvatarImage}
                images={avatarImage}
                isCircle="true"
                closeDropzone={handleCloseImageUploader}
                saveImages={handleUpdateAvatar}
            />
        </div>
    )
    const UserEmailField = (
        <div className="relative text-sm">
            <input
                className={
                    `peer w-full px-3 pt-4 pb-1 text-base outline-gray-400 outline-2 focus:outline-primary select-none outline-none placeholder-transparent rounded-sm 
                    disabled:bg-gray-200 disabled:cursor-default disabled:outline-gray-200
                    `
                    // +
                    // (postTitle.replace(/\s+/g, "").length > 50 ||
                    // postTitleEmpty
                    //     ? "outline-red-500 focus:outline-red-500"
                    //     : "")
                }
                type="text"
                id="email"
                value={userEmail}
                onChange={(event) => {
                    setUserEmail(event.target.value)
                }}
                placeholder="Email đăng nhập"
                onClick={() => {
                    console.log("EmailField clicked")
                }}
                disabled={true}
            />
            <label
                htmlFor="email"
                className={
                    `absolute text-gray-400 text-base ` +
                    (userEmail
                        ? `top-[2px] left-3 text-gray-500 text-xs font-medium`
                        : `left-3 top-[10px]`) +
                    ` cursor-text
                        peer-focus:text-xs peer-focus:font-medium peer-focus:text-gray-500 peer-focus:left-3 peer-focus:top-[2px] ease-linear duration-100`
                }
            >
                Email đăng nhập
            </label>
        </div>
    )

    const UserNameField = (
        <div className="relative text-sm">
            <input
                className={
                    "peer w-full px-3 pt-4 pb-1 text-base outline-gray-400 outline-2 focus:outline-primary select-none outline-none placeholder-transparent rounded-sm "
                    // +
                    // (postTitle.replace(/\s+/g, "").length > 50 ||
                    // postTitleEmpty
                    //     ? "outline-red-500 focus:outline-red-500"
                    //     : "")
                }
                type="text"
                id="userName"
                value={userName}
                onChange={(event) => {
                    setUserName(event.target.value)
                }}
                placeholder="Tên người dùng"
                onClick={() => {
                    console.log("UserNameField clicked")
                }}
            />
            <label
                htmlFor="userName"
                className={
                    `absolute text-gray-400 text-base ` +
                    (userName
                        ? `top-[2px] left-3 text-gray-500 text-xs font-medium`
                        : `left-3 top-[10px]`) +
                    ` cursor-text
                        peer-focus:text-xs peer-focus:font-medium peer-focus:text-gray-500 peer-focus:left-3 peer-focus:top-[2px] ease-linear duration-100`
                }
            >
                Tên người dùng <span className="text-red-500 px-[2px]">*</span>
            </label>
        </div>
    )

    const UserPhoneNumberField = (
        <div className="relative text-sm">
            <input
                className={
                    "peer w-full px-3 pt-4 pb-1 text-base outline-gray-400 outline-2 focus:outline-primary select-none outline-none placeholder-transparent rounded-sm "
                    // +
                    // (postTitle.replace(/\s+/g, "").length > 50 ||
                    // postTitleEmpty
                    //     ? "outline-red-500 focus:outline-red-500"
                    //     : "")
                }
                type="text"
                id="phoneNumber"
                value={userPhoneNumber}
                onChange={(event) => {
                    setUserPhoneNumber(event.target.value)
                }}
                placeholder="Số điện thoại"
                onClick={() => {
                    console.log("UserNameField clicked")
                }}
            />
            <label
                htmlFor="phoneNumber"
                className={
                    `absolute text-gray-400 text-base ` +
                    (userPhoneNumber
                        ? `top-[2px] left-3 text-gray-500 text-xs font-medium`
                        : `left-3 top-[10px]`) +
                    ` cursor-text
                        peer-focus:text-xs peer-focus:font-medium peer-focus:text-gray-500 peer-focus:left-3 peer-focus:top-[2px] ease-linear duration-100`
                }
            >
                Số điện thoại <span className="text-red-500 px-[2px]">*</span>
            </label>
        </div>
    )

    const UserIntroductionField = (
        <div className="relative my-2">
            <textarea
                className={
                    "peer w-full px-3 text-base pt-8 pb-2 outline-gray-400 outline-2 focus:pt-5 focus:outline-primary focus:placeholder-transparent select-none outline-none overflow-y-scroll rounded-sm " +
                    (userIntroduction ? "!pt-5" : "")
                    // +
                    // ((userIntroduction &&
                    //     userIntroduction.replace(/\s+/g, "").length < 80) ||
                    // postDescriptionEmpty
                    //     ? "outline-red-500 focus:outline-red-500"
                    //     : "")
                }
                name="introduction"
                id="introduction"
                value={userIntroduction}
                onChange={(event) => {
                    setUserIntroduction(event.target.value)
                }}
                onClick={() => {
                    // setPostDescriptionEmpty(false)
                }}
                placeholder="Viết vài dòng giới thiệu về bản thân bạn ..."
                rows={userIntroduction ? 5 : 2}
            ></textarea>
            <label
                htmlFor="introduction"
                className={
                    `absolute text-gray-400 text-base bg-white z-10 w-[90%] pt-0 pb-1  ` +
                    (userIntroduction
                        ? `top-1 left-3 text-gray-500 text-sm !py-0 font-medium `
                        : `left-3 top-1`) +
                    ` cursor-text
                        peer-focus:!py-0 peer-focus:text-sm peer-focus:font-medium peer-focus:text-gray-500 peer-focus:left-3 ease-linear duration-100`
                }
            >
                Giới thiệu{" "}
            </label>

            {userIntroduction ? (
                userIntroduction.split(" ").length > 80 ? (
                    <p className="text-red-500 text-2xs">
                        {" "}
                        Vui lòng không nhập quá 60 từ
                    </p>
                ) : (
                    <></>
                )
            ) : (
                <></>
            )}
            <p className="text-gray-500 text-2xs font-semibold">
                {userIntroduction
                    ? `${userIntroduction.split(" ").length - 1}/60 từ`
                    : "0/60 từ"}
            </p>
        </div>
    )

    const InforSubmitButton = (
        <button
            type="submit"
            className={`block px-3 py-1 text-lg font-medium rounded-md  bg-primary text-white hover:bg-light-primary cursor-pointer
                disabled:bg-gray-300 disabled:cursor-not-allowed
                `}
            disabled={InforSubmitButtonDisabled}
        >
            Lưu thay đổi
        </button>
    )

    const ChangePasswordSubmitButton = (
        <button
            type="submit"
            className={`block px-3 py-1 text-lg font-medium rounded-md  bg-primary text-white hover:bg-light-primary cursor-pointer
                disabled:bg-gray-300 disabled:cursor-not-allowed
                `}
            disabled={ChangePasswordSubmitButtonDisabled}
        >
            Đổi mật khẩu
        </button>
    )

    const ChangePasswordFiled = (
        <>
            {/* mật khẩu hiện tại  */}
            <div>
                <div className="relative text-xs mb-4">
                    <input
                        className={
                            "peer w-full px-3 pt-4 pb-1 text-base outline-gray-400 outline-2 focus:outline-primary select-none outline-none placeholder-transparent rounded-sm "
                        }
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Mật khẩu hiện tại"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        onClick={() => {
                            // dispatch(deleteErrorMessage())
                            // setIsPasswordFieldEmpty(false)
                        }}
                    />
                    <label
                        htmlFor="password"
                        className={
                            `absolute text-gray-400 text-base ` +
                            (password
                                ? `top-[2px] left-3 text-gray-500 text-xs font-medium`
                                : `left-3 top-[10px]`) +
                            ` cursor-text
                                peer-focus:text-xs peer-focus:font-medium peer-focus:text-gray-500 peer-focus:left-3 peer-focus:top-[2px] ease-linear duration-100`
                        }
                    >
                        Mật khẩu hiện tại{" "}
                        <span className="text-red-500 px-[2px]">*</span>
                    </label>
                    {/* {isPasswordFieldEmpty ? (
                <div className="text-red-600 mt-2">Bạn chưa nhập mật khẩu</div>
            ) : (
                <></>
            )}
            {error?.message === "Wrong password" ? (
                <div className="text-red-600 mt-2">Sai mật khẩu</div>
            ) : (
                <></>
            )} */}
                </div>

                {/* Mật khẩu mới  */}
                <div className="relative text-xs my-8">
                    <input
                        className={
                            "peer w-full px-3 pt-4 pb-1 text-base outline-gray-400 outline-2 focus:outline-primary select-none outline-none placeholder-transparent rounded-sm "
                        }
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        placeholder="Mật khẩu mới"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        onClick={() => {
                            // dispatch(deleteErrorMessage())
                            // setIsPasswordFieldEmpty(false)
                        }}
                    />
                    <label
                        htmlFor="newPassword"
                        className={
                            `absolute text-gray-400 text-base ` +
                            (newPassword
                                ? `top-[2px] left-3 text-gray-500 text-xs font-medium`
                                : `left-3 top-[10px]`) +
                            ` cursor-text
                                peer-focus:text-xs peer-focus:font-medium peer-focus:text-gray-500 peer-focus:left-3 peer-focus:top-[2px] ease-linear duration-100`
                        }
                    >
                        Mật khẩu mới{" "}
                        <span className="text-red-500 px-[2px]">*</span>
                    </label>
                </div>
                {/* Xác nhận mật khẩu mới  */}
                <div className="relative text-xs my-8">
                    <input
                        className={
                            "peer w-full px-3 pt-4 pb-1 text-base outline-gray-400 outline-2 focus:outline-primary select-none outline-none placeholder-transparent rounded-sm "
                        }
                        type="password"
                        name="newRepeatedPassword"
                        id="newRepeatedPassword"
                        placeholder="Mật khẩu mới"
                        value={newRepeatedPassword}
                        onChange={(event) =>
                            setNewRepeatedPassword(event.target.value)
                        }
                        onClick={() => {
                            // dispatch(deleteErrorMessage())
                            // setIsPasswordFieldEmpty(false)
                        }}
                    />
                    <label
                        htmlFor="newRepeatedPassword"
                        className={
                            `absolute text-gray-400 text-base ` +
                            (newRepeatedPassword
                                ? `top-[2px] left-3 text-gray-500 text-xs font-medium`
                                : `left-3 top-[10px]`) +
                            ` cursor-text
                                peer-focus:text-xs peer-focus:font-medium peer-focus:text-gray-500 peer-focus:left-3 peer-focus:top-[2px] ease-linear duration-100`
                        }
                    >
                        Xác nhận mật khẩu mới{" "}
                        <span className="text-red-500 px-[2px]">*</span>
                    </label>
                </div>
            </div>
        </>
    )

    const userAvatarFiled = (
        <div className="flex flex-col items-center">
            <div className="text-gray-500 text-lg">Ảnh đại diện</div>
            <div
                className={`rounded-[50%] h-40 w-40 translate-y-2 border-2 border-primary cursor-pointer hover:opacity-90 `}
                onClick={(event) => {
                    event.stopPropagation()
                    setShowImageUploader(true)
                }}
            >
                {user?.avatar ? (
                    <img
                        src={user.avatar}
                        alt="avatar"
                        className="object-cover w-full h-full rounded-[50%]"
                    />
                ) : (
                    <>
                        <FaUserCircle className="w-full h-full text-gray-400 rounded-[50%]"></FaUserCircle>
                    </>
                )}
                <div className="absolute bottom-0 right-0 rounded-[50%] w-6 h-6 bg-gray-300 flex items-center justify-center shadow-boxMd hover:bg-gray-200 cursor-pointer">
                    <BsFillCameraFill className="" />
                </div>
            </div>
        </div>
    )

    const ChangeProfileField = (
        <div className="pb-6">
            <div className="text-gray-800 text-xl font-bold mb-4">
                Cài đặt tài khoản
            </div>
            <div className="mb-6 p-4 bg-white rounded-md shadow-boxMd">
                {/* Hồ sơ cá nhân */}
                <div>
                    <div className="text-lg font-bold">Hồ sơ cá nhân</div>
                    <div className="flex gap-x-2">
                        <div className="w-[40%] p-4">{userAvatarFiled}</div>
                        <div className="flex-1 p-4 pt-5">
                            <div className="py-2">{UserEmailField}</div>
                            <div className="py-2">{UserNameField}</div>
                            <div className="py-2">{UserPhoneNumberField}</div>
                            <div className="py-2">{UserIntroductionField}</div>
                            <div className="flex justify-end">
                                {InforSubmitButton}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Đổi mật khẩu */}
            <div className="my-6 p-4 pb-6 bg-white rounded-md shadow-boxMd">
                <div>
                    <div className="text-lg font-bold mb-6">
                        Thay đổi mật khẩu
                    </div>

                    <div className="">{ChangePasswordFiled}</div>
                </div>
                <div>{ChangePasswordSubmitButton}</div>
            </div>
        </div>
    )

    return (
        <div className=" bg-customWhite">
            <Breadcrumb
                title1={`Trang cá nhân của ${
                    user?.userName ? user.userName : "..."
                }`}
                link1={`/user/myProfile`}
                title2={"Cài đặt tài khoản"}
            ></Breadcrumb>
            <div className="laptop:w-laptop m-auto">{ChangeProfileField}</div>
            {showImageUploader ? ImageUploader : <></>}
        </div>
    )
}

export default UserSettingPage
