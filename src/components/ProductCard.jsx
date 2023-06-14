import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"
import { FaUserCircle } from "react-icons/fa"
import { formatNumstrToCurrency } from "../utils/NumberUtils"
import { useDispatch, useSelector } from "react-redux"
import {
    selectUser,
    savePostThunk,
    deleteSavedPostThunk,
    resetStatus,
} from "../features/Auth/authSlice"

const ProductCard = ({
    postId,
    title,
    price,
    author,
    description,
    timeAgo,
    address,
    postUrl,
    imageUrl,
}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const user = useSelector(selectUser)
    const savedPosts = user?.savedPosts

    /* HANDLERS */
    const handleSavedPost = async () => {
        const userId = user?.id

        const res = await dispatch(
            savePostThunk({ userId, postId: postId })
        ).unwrap()
        console.log("At ProductCard, savePostThunk res: ", res)
        dispatch(resetStatus())
    }
    const handleDeleteSavedPost = async () => {
        const userId = user?.id
        const res = await dispatch(
            deleteSavedPostThunk({ userId, postId: postId })
        ).unwrap()
        console.log("At ProductCard, handleDeleteSavedPost res: ", res)
        dispatch(resetStatus())
    }

    const handleCheckPostSaved = () => {
        const checkRes = savedPosts?.some((post) => {
            return +post.post_id === +postId
        })
        return checkRes
    }

    // -- HANDLE DEVICE TYPE
    const [deviceType, setDeviceType] = useState(null)
    useEffect(() => {
        handleSetDeviceType()
    }, [])
    useEffect(() => {
        window.addEventListener("resize", handleSetDeviceType)
        return () => {
            window.addEventListener("resize", handleSetDeviceType)
        }
    }, [])
    const handleSetDeviceType = () => {
        const width = window.innerWidth
        if (width < 576) {
            setDeviceType("smallMobile")
        } else if (width >= 576 && width < 786) {
            setDeviceType("mobile")
        } else if (width >= 786 && width < 1024) {
            setDeviceType("tablet")
        } else if (width >= 1024 && width < 1280) {
            setDeviceType("laptop")
        } else {
            setDeviceType("desktop")
        }
    }

    /* Components */
    const productImage = (
        <div
            className={`relative ${
                deviceType === "desktop" || deviceType === "laptop"
                    ? "h-[220px]"
                    : deviceType === "tablet"
                    ? "h-[200px]"
                    : "h-[260px]"
            }   p-4 pb-0`}
        >
            <img
                className="object-cover h-full w-full rounded-sm"
                src={imageUrl ? `${imageUrl}` : ""}
                alt="product image"
            />
        </div>
    )

    const saveProduct = (
        <div className="px-3 py-1">
            {/* if user like a product, AiFillHeart icons */}
        </div>
    )
    const productDetails = (
        <div className="productDetails px-3 py-2">
            <div className="overflow-hidden">
                <Link to={`/posts/${postUrl}`} className="">
                    <div className="ellipsis line-clamp-2">
                        <span className="hover:text-primary text-base font-medium text-gray-700">
                            {title}
                        </span>
                        <br />
                        <span className="text-sm font-light text-gray-500 ">
                            {description}
                        </span>
                    </div>
                </Link>
            </div>
            <div className="flex justify-between items-center mt-2">
                {" "}
                <div className="text-lg font-bold text-red-700">
                    {formatNumstrToCurrency(price, "0,0", "đ")}
                </div>
                <div
                    className="mr-2"
                    onClick={(event) => {
                        event.stopPropagation()
                    }}
                >
                    {handleCheckPostSaved() ? (
                        <div onClick={handleDeleteSavedPost}>
                            <AiFillHeart className=" text-red-700 text-2xl  hover:scale-[1.2]" />
                        </div>
                    ) : (
                        <div onClick={handleSavedPost}>
                            <AiOutlineHeart className=" text-red-700 text-2xl  hover:scale-[1.2]" />
                        </div>
                    )}
                </div>
            </div>

            <div className="my-2 flex justify-start items-center text-xs text-gray-400 tracking-wide ">
                <div className="rounded-[50%] w-5 h-5">
                    {author?.avatar ? (
                        <img
                            src={author.avatar}
                            alt=""
                            className="w-full h-full object-cover rounded-[50%]"
                        />
                    ) : (
                        <>
                            <FaUserCircle className="w-full h-full"></FaUserCircle>
                        </>
                    )}
                </div>
                <span className="px-[2px] -translate-y-[1px]">
                    &nbsp;·&nbsp;{" "}
                </span>
                <div className="text-ellipsis line-clamp-1">{timeAgo}</div>
                <span className="px-[2px] -translate-y-[1px]">
                    &nbsp;·&nbsp;{" "}
                </span>
                <div className="max-w-[100px] text-ellipsis line-clamp-1">
                    {address
                        ? address.split(",")[address.split(",").length - 1]
                        : ""}
                </div>
            </div>
        </div>
    )
    const card = (
        <div
            className="bg-white hover:shadow-boxMd hover:shadow-gray-400 hover:z-10 cursor-pointer border-b-[1px] border-t-gray-200"
            onClick={() => {
                navigate(`/posts/${postUrl}`)
            }}
        >
            {productImage}
            {saveProduct}
            {productDetails}
        </div>
    )
    return card
}

export default ProductCard
