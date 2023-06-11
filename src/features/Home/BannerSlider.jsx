import React, { useState } from "react"
import Slider from "react-slick"
import { selectFetchedPosts } from "../Post/postSlice"
import { useSelector } from "react-redux"
import ProductCard from "../../components/ProductCard"
import {
    MdOutlineKeyboardArrowRight,
    MdOutlineKeyboardArrowLeft,
} from "react-icons/md"
import "./banner.css"

const BannerSlider = () => {
    const fetchedPosts = useSelector(selectFetchedPosts)
    const newestPosts = fetchedPosts.slice(0, 8)

    const [activeIndex, setActiveIndex] = useState(0)

    const settings = {
        dots: false,
        arrows: true,
        infinite: true,
        initialSlide: 0,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 2,
        autoplay: true,
        autoplaySpeed: 3000,
        nextArrow: (
            <MdOutlineKeyboardArrowRight
                className="slick-next"
                fill="rgb(75, 75, 75, 1)"
            />
        ),
        prevArrow: (
            <MdOutlineKeyboardArrowLeft
                className="slick-prev"
                fill="rgb(75, 75, 75, 1)"
            />
        ),
        customPaging: (i) => {
            return (
                <div
                    className={` w-2 h-2 rounded-[50%] bg-gray-200 -translate-y-8 ${
                        activeIndex === i ? " bg-primary " : ""
                    } `}
                    onClick={(event) => {
                        event.stopPropagation()
                    }}
                ></div>
            )
        },
        beforeChange: function (current, next) {
            setActiveIndex(next)
        },
    }

    return (
        <div className="laptop:w-laptop m-auto my-5 bg-white">
            <div className="border-b border-gray-100">
                <h3 className="text-text text-lg py-2 font-semibold px-5">
                    Tin nổi bật
                </h3>
            </div>
            <Slider {...settings} className="px-7">
                {newestPosts.map((post, index) => {
                    return (
                        <div className="px-1 pb-3 pt-1">
                            <ProductCard
                                className="hover:shadow-boxMd"
                                key={index}
                                postId={post?.id}
                                title={post?.title}
                                price={post?.price}
                                author={post?.author}
                                timeAgo={post?.timeAgo}
                                address={post?.address}
                                postUrl={post?.post_url}
                                imageUrl={post?.images[0]?.imageUrl}
                                description={post?.description}
                            />
                        </div>
                    )
                })}
            </Slider>
        </div>
    )
}

export default BannerSlider
