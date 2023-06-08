import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { GrClose } from "react-icons/gr"
import Logo from "../../utils/images/Logo.png"
import {
    loginThunk,
    deleteErrorMessage,
    selectAuthStatus,
} from "../Auth/authSlice"
import { useNavigate } from "react-router-dom"
import Breadcrumb from "../../components/Breadcrumb"
import { toast } from "react-toastify"

const LoginForm = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [userAccount, setUserAccount] = useState("")
    const [password, setPassword] = useState("")

    const [isEmail, setIsEmail] = useState(true)

    const [isAccountFieldEmpty, setIsAccountFieldEmpty] = useState(false)
    const [isPasswordFieldEmpty, setIsPasswordFieldEmpty] = useState(false)

    const user = useSelector((state) => state.auth.user)
    const error = useSelector((state) => state.auth.error)
    const authStatus = useSelector(selectAuthStatus)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    // useEffect
    // hande notifications for loginthunk
    useEffect(() => {
        if (authStatus === "Đăng đăng nhập ...") {
            toast.info(authStatus, {
                hideProgressBar: false,
            })
        }
        if (authStatus === "Đăng nhập thành công") {
            toast.dismiss()
            // toast.success(authStatus)
        }
        if (authStatus === "Đăng nhập thất bại") {
            toast.dismiss()
            // toast.error(authStatus)
            if (error.statusCode === 404) {
                toast.warn("Sai tài khoản!", {
                    autoClose: 2000,
                })
            }
        }
    }, [authStatus])

    const handleLogin = async () => {
        // /handle input before dispatch
        if (userAccount === "") {
            setIsAccountFieldEmpty(true)
            return
        }

        if (password === "") {
            setIsPasswordFieldEmpty(true)
            return
        }

        if (!emailRegex.test(userAccount)) {
            setIsEmail(false)
            return
        }

        // /dispatch
        if (!userAccount || !password || !emailRegex) {
            return
        }

        const loginResult = await dispatch(
            loginThunk({ userAccount, password })
        ).unwrap()
        // console.log(">>> loginResult: ", loginResult)
        //

        if (loginResult.code) {
            return
        }
        if (!loginResult.user?.phoneNumber) {
            navigate("./add-phone-number")
            return
        }
        navigate("/")
    }

    // components
    const Header = (
        <h2 className=" font-bold py-6  flex justify-between items-center">
            <div className="mr-3">
                <div className="text-primary text-3xl">Đăng nhập</div>
                <div className="mt-1 text-base text-gray-600">
                    Chào bạn quay lại
                </div>
            </div>

            <div className="mr-5 w-[80px] h-[80px]">
                <img src={Logo} alt="" />
            </div>
        </h2>
    )
    const AccountField = (
        <div className="relative  m-auto my-6">
            <input
                className="peer w-full outline-gray-400 outline-2 focus:outline-primary  outline-none placeholder-transparent px-3 py-2 rounded-sm "
                type="text"
                name="account"
                id="account"
                placeholder="Số ĐT/Email"
                value={userAccount}
                onChange={(event) => setUserAccount(event.target.value)}
                onClick={() => {
                    if (error?.message) {
                        dispatch(deleteErrorMessage())
                    }

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
                Số ĐT/Email của bạn
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
            {error?.message === "User not found" ? (
                <div className="text-red-600 mt-2">Tài khoản không tồn tại</div>
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
                    if (error?.message) {
                        dispatch(deleteErrorMessage())
                    }
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
            {error?.message === "WRONG PASSWORD" ? (
                <div className="text-red-600 mt-2">Sai mật khẩu</div>
            ) : (
                <></>
            )}
        </div>
    )

    const Footer = (
        <div className="mt-6">
            <div className="">
                <p className="flex justify-between">
                    <label
                        className="flex items-center"
                        htmlFor="checkAutoLoggin"
                    >
                        <input
                            className=" accent-primary text-white h-4 w-4 cursor-pointer"
                            type="checkbox"
                            name="checkAutoLoggin"
                            id="checkAutoLoggin"
                        />
                        <span className="ml-1 text-sm font-semibold cursor-pointer">
                            Đăng nhập tự động
                        </span>
                    </label>
                    <Link
                        to=""
                        className="font-semibold hover:underline hover:text-primary text-sm"
                    >
                        Quên mật khẩu?
                    </Link>
                </p>
            </div>
            <div
                className="mt-10 bg-primary text-white text-lg font-semibold py-2 flex rounded-md opacity-100 hover:opacity-90 cursor-pointer"
                onClick={handleLogin}
            >
                <p className="m-auto">Đăng nhập</p>
            </div>
            <div className="border-t-2 mt-6 pt-4">
                <p>
                    Bạn chưa có tài khoản?{" "}
                    <Link
                        to={"../register"}
                        className="text-primary font-semibold hover:font-bold"
                    >
                        Đăng ký
                    </Link>
                </p>
            </div>
        </div>
    )

    return (
        <>
            <Breadcrumb title1={"Đăng nhập"} />
            <div
                className="relative -top-20 bg-white m-auto my-12 w-[450px] border-[1px] rounded-md border-gray-200 py-4  px-8 shadow-lg shadow-gray-400 "
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        handleLogin()
                    }
                }}
            >
                {Header}
                {AccountField}
                {PassowrdFiled}
                {Footer}
            </div>
        </>
    )
}

export default LoginForm
