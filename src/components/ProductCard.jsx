import React from "react"
import { MdDone } from "react-icons/md"
import { GoLocation } from "react-icons/go"
import { Link, useNavigate } from "react-router-dom"
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"
import { formatNumstrToCurrency } from "../utils/NumberUtils"

const ProductCard = ({
    title,
    price,
    author,
    timeAgo,
    address,
    postUrl,
    imageUrl,
}) => {
    const navigate = useNavigate()

    const productImage = (
        <div className={`relative h-[240px]  p-4 pb-0`}>
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
            <div className="h-[50px] overflow-hidden">
                <Link
                    to={`/posts/${postUrl}`}
                    className="text-lg font-medium text-gray-700 hover:text-primary"
                >
                    <h2 className="">{title}</h2>
                </Link>
            </div>
            <div className="flex justify-between items-center mt-2">
                {" "}
                <div className="text-lg font-bold text-red-700">
                    {formatNumstrToCurrency(price, "0,0", "đ")}
                </div>
                <div className="mr-2">
                    <AiOutlineHeart className=" text-red-700 text-2xl  hover:scale-[1.2]" />
                    {/* <AiFillHeart className=" text-red-700 text-2xl  hover:scale-[1.2]" */}
                </div>
            </div>

            <div className="my-2 flex justify-start items-center text-xs text-gray-400 tracking-wide ">
                <div className="rounded-[50%] w-5 h-5 bg-primary">
                    <img
                        src={author?.avatar}
                        alt=""
                        className="w-full h-full object-cover rounded-[50%]"
                    />
                </div>
                <span className="px-[2px] -translate-y-[1px]">
                    &nbsp;·&nbsp;{" "}
                </span>
                <div className="">{timeAgo}</div>
                <span className="px-[2px] -translate-y-[1px]">
                    &nbsp;·&nbsp;{" "}
                </span>
                <div className="truncate w-[100px]">
                    {address ? address.split(",")[3] : ""}
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
