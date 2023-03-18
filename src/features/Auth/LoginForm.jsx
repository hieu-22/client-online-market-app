import React, { useState } from "react"
import { Link } from "react-router-dom"
import { GrClose } from "react-icons/gr"

const LoginForm = ({ closeUI, toRegisterForm }) => {
    const [accountName, setAccountName] = useState("")
    const [password, setPassword] = useState("")

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
            <div className="mt-10 bg-primary text-white text-lg font-semibold py-2 flex rounded-md opacity-100 hover:opacity-90 cursor-pointer">
                <p className="m-auto">Đăng nhập</p>
            </div>
            <div className="border-t-2 mt-6 pt-4">
                <p>
                    Bạn chưa có tài khoản?{" "}
                    <Link
                        className="text-primary font-semibold hover:font-bold"
                        onClick={toRegisterForm}
                    >
                        Đăng ký
                    </Link>
                </p>
            </div>
        </div>
    )

    return (
        <div className="bg-white m-auto w-[450px] border-[1px] rounded-md border-gray-200 py-4  px-6 shadow-lg shadow-gray-400 translate-y-[-50%] translate-x-[-50%] fixed top-[36%] left-[50%] z-50">
            <span
                className="absolute top-0 right-0 p-2 hover:bg-gray-300 cursor-pointer active:bg-gray-100 rounded"
                onClick={closeUI}
            >
                <GrClose />
            </span>
            <h2 className="text-2xl font-bold py-6 flex justify-left items-center">
                <span className="mr-3">Đăng nhập</span>
                <span className=" bg-primary rounded-50 px-4 py-2 mx-4 pb-3 text-gray-100 text-xl ">
                    eMarket
                </span>
            </h2>
            {AccountField}
            {PassowrdFiled}
            {Footer}
        </div>
    )
}

export default LoginForm
