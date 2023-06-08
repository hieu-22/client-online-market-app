import React, { useEffect } from "react"
import { useState } from "react"
import Breadcrumb from "../../components/Breadcrumb"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
    updatePhoneNumberThunk,
    selectUser,
    selectAuthError,
    selectAuthStatus,
} from "../Auth/authSlice"
import { toast } from "react-toastify"

const PhoneNumberForm = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const user = useSelector(selectUser)
    const [userPhoneNumber, setUserPhoneNumber] = useState("")

    const [userPhoneNumberEmpty, setUserPhoneNumberEmpty] = useState(false)
    const [phoneNumberFormatCorrect, setPhoneNumberFormatCorrect] =
        useState(true)

    const phoneNumberPattern = /^(\+84|0)\d{9,10}$/

    const authStatus = useSelector(selectAuthStatus)
    const authError = useSelector(selectAuthError)
    // useEffect
    useEffect(() => {
        if (authStatus === "Đang cập nhật ...") {
            toast.dismiss()
            toast.info(authStatus, {
                hideProgressBar: true,
            })
        }
        if (authStatus === "Cập nhật thành công!") {
            toast.dismiss()
            toast.success(authStatus, {
                hideProgressBar: true,
            })
        }
        if (authStatus === "Cập nhật thất bại!") {
            toast.dismiss()
            toast.error(authError.message, {
                hideProgressBar: true,
            })
        }
    }, [authStatus])
    // handlers
    const handleFormatCheck = () => {
        if (userPhoneNumber === "") {
            setUserPhoneNumberEmpty(true)
            return
        }

        const isPhoneNumber = phoneNumberPattern.test(userPhoneNumber)
        if (!isPhoneNumber) {
            setPhoneNumberFormatCorrect(false)
            return
        }
        return true
    }

    const debounce = (func, delay) => {
        let timerId

        return function () {
            clearTimeout(timerId)

            timerId = setTimeout(func, delay)
        }
    }
    const handleAddPhoneNumber = async () => {
        const check = handleFormatCheck()
        if (!check) {
            return
        }

        const dispatchResult = await dispatch(
            updatePhoneNumberThunk({
                phoneNumber: userPhoneNumber,
                userId: user.id,
            })
        ).unwrap()
        // console.log(">>> dispatchResult: ", dispatchResult)
        if (dispatchResult.errorCode === 0) {
            navigate("/")
        }
    }
    const debounceAddPhoneNumberHandler = debounce(handleAddPhoneNumber, 500)

    // const Header = (
    //     <h2 className=" font-bold py-6  flex justify-between items-center">
    //         <div className="mr-3">
    //             <div className="text-primary text-3xl">Số Điện thoại</div>
    //             <div className="mt-1 text-base text-gray-600">
    //                 Tạo SĐT của bạn
    //             </div>
    //         </div>

    //         <div className="mr-5 w-[80px] h-[80px]">
    //             <img src={Logo} alt="" />
    //         </div>
    //     </h2>
    // )

    const PhoneNumberField = (
        <div className="relative  m-auto my-6">
            <input
                className={
                    `peer w-full outline-gray-400 outline-2 focus:outline-primary outline-none placeholder-transparent px-3 py-2 rounded-sm ` +
                    (userPhoneNumberEmpty || !phoneNumberFormatCorrect
                        ? "outline-red-600"
                        : "")
                }
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                placeholder="Nhập SĐT của bạn"
                value={userPhoneNumber}
                onChange={(event) => setUserPhoneNumber(event.target.value)}
                onClick={() => {
                    setPhoneNumberFormatCorrect(true)
                    setUserPhoneNumberEmpty(false)
                }}
            />
            <label
                htmlFor="phoneNumber"
                className={
                    `absolute ` +
                    (userPhoneNumber
                        ? `-top-3.5 left-2 text-gray-700 text-sm`
                        : `left-3 top-[7px]`) +
                    ` cursor-text bg-white z-10  
                peer-focus:text-sm peer-focus:text-gray-700 peer-focus:left-2 peer-focus:-top-3.5 ease-linear duration-100`
                }
            >
                Nhập SĐT của bạn
            </label>

            {userPhoneNumberEmpty ? (
                <div className="text-red-600 mt-2">
                    Vui lòng nhập SĐT. Ví dụ "0973xxxxxx"
                </div>
            ) : (
                <></>
            )}
            {!phoneNumberFormatCorrect ? (
                <div className="text-red-600 mt-2">
                    Sai định dạng SĐT. Ví dụ "0973xxxxxx"
                </div>
            ) : (
                <></>
            )}
        </div>
    )

    const Footer = (
        <div className="">
            <div
                className=" bg-primary text-white text-lg font-semibold py-2 flex rounded-md opacity-100 hover:opacity-90 cursor-pointer"
                onClick={debounceAddPhoneNumberHandler}
            >
                <p className="m-auto">Tiếp tục</p>
            </div>
        </div>
    )

    return (
        <>
            <Breadcrumb
                title1={"Đăng nhập"}
                link1={"/login"}
                title2={"Thêm số điện thoại"}
            />
            <div
                className="relative -top-20 bg-white m-auto my-12 w-[420px] h-[480px] border-[1px] rounded-md border-gray-200 py-4 pt-6  px-8 shadow-lg shadow-gray-400 "
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        return debounceAddPhoneNumberHandler
                    }
                }}
            >
                {PhoneNumberField}
                {Footer}
            </div>
        </>
    )
}

export default PhoneNumberForm
