import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { GrClose } from "react-icons/gr"
import Logo from "../../utils/images/Logo.png"
import { useDispatch, useSelector } from "react-redux"
import { registerThunk, selectAuthError, selectAuthStatus } from "./authSlice"
import Breadcrumb from "../../components/Breadcrumb"
import { toast } from "react-toastify"

const LoginForm = () => {
    const [userAccount, setUserAccount] = useState("")
    const [password, setPassword] = useState("")
    const [repeatedPassword, setRepeatedPassword] = useState("")
    const [samePassword, setSamePassword] = useState(true)
    const [isEmail, setIsEmail] = useState(true)

    const [isAccountFieldEmpty, setIsAccountFieldEmpty] = useState(false)
    const [isPasswordFieldEmpty, setIsPasswordFieldEmpty] = useState(false)
    const [isRepeatPasswordFieldEmpty, setIsRepeatPasswordFieldEmpty] =
        useState(false)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const authStatus = useSelector(selectAuthStatus)
    const authError = useSelector(selectAuthError)

    // useEffect
    useEffect(() => {
        if (authStatus === "Đang đăng ký tài khoản ...") {
            toast.dismiss()
            toast.info(authStatus, {
                hideProgressBar: true,
            })
        }
        if (authStatus === "Đăng ký tài khoản thành công!") {
            toast.dismiss()
            toast.success(authStatus, {
                hideProgressBar: true,
            })
        }
        if (authStatus === "Đăng ký tài khoản thất bại!") {
            toast.dismiss()
            toast.error(authError.message, {
                hideProgressBar: true,
            })
        }
    }, [authStatus])

    const debounce = (func, delay) => {
        let timerId

        return function () {
            clearTimeout(timerId)

            timerId = setTimeout(func, delay)
        }
    }

    const handleRegister = async () => {
        if (userAccount === "") {
            setIsAccountFieldEmpty(true)
            return
        }
        if (password === "") {
            setIsPasswordFieldEmpty(true)
            return
        }
        if (repeatedPassword === "") {
            setIsRepeatPasswordFieldEmpty(true)
            return
        }

        if (password !== repeatedPassword) {
            setSamePassword(false)
            return
        }
        if (!emailRegex.test(userAccount)) {
            setIsEmail(false)
            return
        }

        try {
            await dispatch(
                registerThunk({
                    userAccount,
                    password,
                })
            ).unwrap()
            navigate("/add-phone-number")
        } catch (error) {
            console.log(error)
        }
    }
    const debounceRegisterHandler = debounce(handleRegister, 500)

    // UI
    const AccountField = (
        <div className="relative  m-auto my-6">
            <input
                className={
                    `peer w-full outline-gray-400 outline-2 focus:outline-primary  outline-none placeholder-transparent px-3 py-2 rounded-sm` +
                    (isEmail ? " " : " outline-red-600 text-red-500")
                }
                type="email"
                name="account"
                id="account"
                placeholder="Email"
                value={userAccount}
                onChange={(event) => setUserAccount(event.target.value)}
                onClick={() => {
                    setIsAccountFieldEmpty(false)
                    setIsEmail(true)
                }}
            />
            <label
                htmlFor="account"
                className={
                    `absolute ` +
                    (userAccount
                        ? `-top-3.5 left-2 text-gray-700 text-sm`
                        : `left-3 top-[7px]`) +
                    ` cursor-text bg-white z-10  
                        peer-focus:text-sm peer-focus:text-gray-700 peer-focus:left-2 peer-focus:-top-3.5 ease-linear duration-100`
                }
            >
                Email của bạn
            </label>
            {!isEmail && isAccountFieldEmpty === false ? (
                <div className="text-red-600 mt-2">
                    Sai định dạng email. Ví dụ "emarket123@gmail.com"
                </div>
            ) : (
                <></>
            )}
            {isAccountFieldEmpty ? (
                <div className="text-red-600 mt-2">Bạn chưa nhập Email</div>
            ) : (
                <></>
            )}
        </div>
    )

    const PassowrdFiled = (
        <div className="relative  m-auto mt-6">
            <input
                className="peer w-full outline-gray-400 outline-2 focus:outline-primary outline-none placeholder-transparent px-3 py-2 rounded-sm "
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onClick={() => {
                    setIsPasswordFieldEmpty(false)
                }}
            />
            <label
                htmlFor="password"
                className={
                    `absolute ` +
                    (password
                        ? `-top-3.5 left-2 text-gray-700 text-sm`
                        : `left-3 top-[7px]`) +
                    ` cursor-text bg-white z-10  
                      peer-focus:text-sm peer-focus:text-gray-700 peer-focus:left-2 peer-focus:-top-3.5 ease-linear duration-100`
                }
            >
                Mật khẩu
            </label>
            {isPasswordFieldEmpty ? (
                <div className="text-red-600 mt-2">Bạn chưa nhập mật khẩu</div>
            ) : (
                <></>
            )}
        </div>
    )

    const RepeatPasswordFiled = (
        <>
            <div className="relative  m-auto mt-6">
                <input
                    className="peer w-full outline-gray-400 outline-2 focus:outline-primary outline-none placeholder-transparent px-3 py-2 rounded-sm "
                    type="password"
                    name="repeatpassword"
                    id="repeatpassword"
                    placeholder="Repeat password"
                    value={repeatedPassword}
                    onChange={(event) =>
                        setRepeatedPassword(event.target.value)
                    }
                    onClick={() => {
                        setIsRepeatPasswordFieldEmpty(false)
                        setSamePassword(true)
                    }}
                />
                <label
                    htmlFor="repeatpassword"
                    className={
                        `absolute ` +
                        (repeatedPassword
                            ? `-top-3.5 left-2 text-gray-700 text-sm`
                            : `left-3 top-[7px]`) +
                        ` cursor-text bg-white z-10  
                      peer-focus:text-sm peer-focus:text-gray-700 peer-focus:left-2 peer-focus:-top-3.5 ease-linear duration-100`
                    }
                >
                    Nhập lại mật khẩu
                </label>
            </div>
            {!samePassword ? (
                <div className="text-red-600 mt-2">
                    Mật khẩu không trùng khớp
                </div>
            ) : (
                <></>
            )}
            {isRepeatPasswordFieldEmpty ? (
                <div className="text-red-600 mt-2">
                    Bạn chưa nhập lại mật khẩu
                </div>
            ) : (
                <></>
            )}
        </>
    )

    const Footer = (
        <div className="mt-6">
            <div className="">
                <p className="flex">
                    <Link
                        to=""
                        className="font-semibold hover:underline hover:text-primary text-sm"
                    >
                        Điều kiện & chính sách
                    </Link>
                </p>
            </div>
            <div
                className={`mt-10 bg-primary  text-white text-lg font-semibold py-2 flex rounded-md opacity-100 hover:opacity-90 cursor-pointer`}
                onClick={debounceRegisterHandler}
            >
                <p className="m-auto">Đăng ký</p>
            </div>
            <div className="border-t-2 mt-6 pt-4">
                <p>
                    Bạn đã có tài khoản?{" "}
                    <Link
                        to="../login"
                        className="text-primary font-semibold hover:font-bold"
                    >
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    )

    return (
        <>
            <Breadcrumb title1={"Đăng Ký"} />
            <div
                className="relative -top-20 bg-white m-auto my-12 w-[450px] border-[1px] rounded-md border-gray-200 py-4  px-8 shadow-lg shadow-gray-400"
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        return debounceRegisterHandler
                    }
                }}
            >
                <h2 className="text-2xl font-bold py-6  flex justify-between items-center">
                    <div className="mr-3">
                        <div className="text-primary text-3xl">Đăng ký</div>
                        <div className="mt-1 text-base text-gray-600">
                            Tạo tài khoản eMarket ngay
                        </div>
                    </div>

                    <div className="mr-5 w-[80px] h-[80px]">
                        <img src={Logo} alt="" />
                    </div>
                </h2>
                {AccountField}
                {PassowrdFiled}
                {RepeatPasswordFiled}
                {Footer}
            </div>
        </>
    )
}

export default LoginForm
