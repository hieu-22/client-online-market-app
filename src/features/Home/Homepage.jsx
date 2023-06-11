import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { AiOutlineCaretDown } from "react-icons/ai"
import { IoLocationSharp } from "react-icons/io5"
import BannerSlider from "./BannerSlider"
import NewPosts from "./NewPosts"
import { useDispatch, useSelector } from "react-redux"
import {
    selectUser,
    resetStatus,
    getSavedPostsByUserIdThunk,
    getRelativeUsersThunk,
} from "../Auth/authSlice"

const Homepage = () => {
    const dispatch = useDispatch()
    const user = useSelector(selectUser)
    const [isPhone, setIsPhone] = useState(null)

    // Components
    const findNewBar = (
        <div className="laptop:w-laptop my-6 mx-auto bg-white rounded-t-xl p-3 flex items-center justify-between ">
            <div className="flex items-center gap-4">
                <div>Sắp xếp theo</div>
                <div className="rounded-[10px] p-3 text-gray-800 font-medium bg-gray-300">
                    <Link to="" className="text-primary">
                        BÀI MỚI
                    </Link>
                </div>
                <div className="rounded-[10px] p-3 text-gray-800 font-medium bg-gray-300">
                    <Link to="" className="active:text-primary">
                        SẢN PHẨM YÊU THÍCH
                    </Link>
                </div>
            </div>
            <div className="bg-gray-300 rounded p-3 flex items-center">
                <span>
                    <IoLocationSharp className="text-primary scale-1.75 mr-2" />
                </span>
                <span className="hover:underline hover:text-primary cursor-pointer">
                    Chọn khu vực
                </span>
                <span>
                    <AiOutlineCaretDown className="text-primary ml-2" />
                </span>
            </div>
        </div>
    )
    // EFFECTS
    // -HANDLERS ON WIDTH DEVICE
    // ---
    useEffect(() => {
        const screenWidth = window.innerWidth
        if (screenWidth < 576) {
            setIsPhone(true)
        } else {
            setIsPhone(false)
        }
    }, [])
    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth
            if (screenWidth < 576) {
                setIsPhone(true)
            } else {
                setIsPhone(false)
            }
        }
        window.addEventListener("resize", handleResize)
        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [window.innerWidth])

    useEffect(() => {
        ;(async () => {
            const userId = user?.id
            const res = await dispatch(
                getSavedPostsByUserIdThunk({ userId: userId })
            ).unwrap()
            // console.log(
            //     "=> At Homepage, getSavedPostsByUserIdThunk result: ",
            //     res
            // )
            dispatch(resetStatus())
        })()
    }, [])

    useEffect(() => {
        if (user) {
            const userId = user?.id
            dispatch(getRelativeUsersThunk(userId))
        }
    }, [])

    return (
        <div
            className="py-3 mx-auto px-6
                        desktop:max-w-[1024px]
                        laptop:max-w-[1024px]  desktop:px-0"
        >
            <div>
                {!isPhone ? (
                    <div className="mb-8">
                        <BannerSlider />
                    </div>
                ) : (
                    <></>
                )}
            </div>
            <div>
                <NewPosts />
            </div>
        </div>
    )
}

export default Homepage
