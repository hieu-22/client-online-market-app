import React, { useState } from "react"
import { Link } from "react-router-dom"
import { GrClose } from "react-icons/gr"
import { useRegisterUserMutation } from "../User/userApiSlice"

const LoginForm = ({ closeUI, toLoginForm }) => {
    const [accountName, setAccountName] = useState("")
    const [password, setPassword] = useState("")
    const [repeatedPassword, setRepeatedPassword] = useState("")
    const [samePassword, setSamePassword] = useState(true)

    const [registerUser, {}] = useRegisterUserMutation()

    const handleRegister = async () => {
        if (password !== repeatedPassword) {
            setSamePassword(false)
            return
        }

        try {
            const request = await registerUser({
                userAccount: accountName,
                password,
            }).unwrap()
            console.log(request)
        } catch (error) {
            console.log(error)
        }
    }

    const AccountField = (
        <div className="relative  m-auto my-6">
            <input
                className="peer w-full outline-gray-400 outline-2 focus:outline-primary  outline-none placeholder-transparent px-3 py-2 rounded-sm "
                type="text"
                name="account"
                id="account"
                placeholder="Số ĐT/Email"
                value={accountName}
                onChange={(event) => setAccountName(event.target.value)}
            />
            <label
                htmlFor="account"
                className={
                    `absolute ` +
                    (accountName
                        ? `-top-3.5 left-2 text-gray-700 text-sm`
                        : `left-3 top-[7px]`) +
                    ` cursor-text bg-white z-10  
                        peer-focus:text-sm peer-focus:text-gray-700 peer-focus:left-2 peer-focus:-top-3.5 ease-linear duration-100`
                }
            >
                Số ĐT/Email của bạn
            </label>
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
        </div>
    )

    const RepeatPassowrdFiled = (
        <>
            <div className="relative  m-auto mt-6">
                <input
                    className="peer w-full outline-gray-400 outline-2 focus:outline-primary outline-none placeholder-transparent px-3 py-2 rounded-sm "
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    value={repeatedPassword}
                    onChange={(event) =>
                        setRepeatedPassword(event.target.value)
                    }
                    onKeyDown={() => {
                        if (samePassword) return
                        setSamePassword(true)
                    }}
                />
                <label
                    htmlFor="password"
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
                className="mt-10 bg-primary text-white text-lg font-semibold py-2 flex rounded-md opacity-100 hover:opacity-90 cursor-pointer"
                onClick={handleRegister}
            >
                <p className="m-auto">Đăng ký</p>
            </div>
            <div className="border-t-2 mt-6 pt-4">
                <p>
                    Bạn đã có tài khoản?{" "}
                    <Link
                        className="text-primary font-semibold hover:font-bold"
                        onClick={toLoginForm}
                    >
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    )

    return (
        <div className="bg-white m-auto w-[450px] border-[1px] rounded-md border-gray-200 py-4  px-6 shadow-lg shadow-gray-400 translate-y-[-50%] translate-x-[-50%] fixed top-[40%] left-[50%] z-50">
            <span
                className="absolute top-0 right-0 p-2 hover:bg-gray-300 cursor-pointer active:bg-gray-100 rounded"
                onClick={closeUI}
            >
                <GrClose />
            </span>
            <h2 className="text-2xl font-bold py-6 flex justify-left items-center">
                <span className="mr-3">Đăng ký</span>
                <span className=" bg-primary rounded-50 px-4 py-2 mx-4 pb-3 text-gray-100 text-xl ">
                    eMarket
                </span>
            </h2>
            {AccountField}
            {PassowrdFiled}
            {RepeatPassowrdFiled}
            {Footer}
        </div>
    )
}

export default LoginForm
