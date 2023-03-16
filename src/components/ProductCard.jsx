import React from "react"
import { MdDone } from "react-icons/md"
import { GoLocation } from "react-icons/go"
import { Link } from "react-router-dom"

const ProductCard = ({ imageUrl }) => {
    const productImage = (
        <div className={`h-[240px] border-b-2 `}>
            <img
                className="object-cover h-full"
                src={imageUrl ? `${imageUrl}` : ""}
                alt="product image"
            />
        </div>
    )

    const productDetails = (
        <div className="productDetails px-3 py-2">
            <div className="flex items-center">
                <span className="text-primary mr-2 text-sm font-medium">
                    user1
                </span>
                <span className="h-[12px] w-[12px] rounded-50 bg-gray-300 ">
                    <MdDone className="h-[12px] w-[12px]" />
                </span>
            </div>
            <div className="max-h-[42px] overflow-hidden">
                <Link
                    to={""}
                    className="text-sm font-medium text-gray-700 hover:underline "
                >
                    <h2>
                        Thinkpad x1 carbon gen6 limit 40 characters Lorem ipsum
                        dolor sit amet consectetur adipisicing elit. Eius,
                        fugiat laborum ullam quaerat molestias accusamus
                        quisquam tenetur? Blanditiis, aut deserunt!
                    </h2>
                </Link>
            </div>
            <div className="text-xl font-bold">3.000.000 đ</div>
            <div className="flex justify-between items-center text-xs text-gray-600">
                <div className="flex items-center ">
                    <span>
                        <GoLocation className="text-base"></GoLocation>
                    </span>
                    <span>Ha noi</span>
                </div>
                <div className="bg-gray-300 rounded p-2">new 100%</div>
            </div>
        </div>
    )
    const card = (
        <div className="bg-white hover:shadow-lg hover:shadow-gray-200 hover:translate-y-[-4px]">
            {productImage}
            {productDetails}
        </div>
    )
    return card
}

export default ProductCard
