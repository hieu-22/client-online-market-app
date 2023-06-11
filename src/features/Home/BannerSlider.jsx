import React, { useEffect, useState } from "react"
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
    const [isTabletDevice, setIsTabletDevice] = useState(false)
    const [slidesToShow, setSlidesToShow] = useState(4)
    const [slidesToScroll, setSlidesToScroll] = useState(2)

    const [activeIndex, setActiveIndex] = useState(0)

    const settings = {
        dots: false,
        arrows: true,
        infinite: true,
        initialSlide: 0,
        speed: 500,
        slidesToShow: slidesToShow,
        slidesToScroll: slidesToScroll,
        autoplay: true,
        autoplaySpeed: 2000,
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

    // To change how many slide to show based on device width
    useEffect(() => {
        const screenWidth = window.innerWidth
        if (screenWidth < 786 && screenWidth >= 576) {
            if (!isTabletDevice) {
                setSlidesToShow(2)
                setSlidesToScroll(1)
                setIsTabletDevice(true)
            }
        }
        if (screenWidth >= 786) {
            if (true) {
                setIsTabletDevice(false)
            }
            setSlidesToShow(4)
            setSlidesToScroll(2)
        }
    }, [])
    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth
            if (screenWidth < 786 && screenWidth >= 576) {
                if (!isTabletDevice) {
                    setSlidesToShow(2)
                    setSlidesToScroll(1)
                    setIsTabletDevice(true)
                }
            }
            if (screenWidth >= 786) {
                if (true) {
                    setIsTabletDevice(false)
                }
                setSlidesToShow(4)
                setSlidesToScroll(2)
            }
        }

        window.addEventListener("resize", handleResize)

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [window.innerWidth])

    return (
        <div className="w-full my-5 bg-white ">
            <div className="border-b border-gray-100">
                <h3 className="text-text text-lg py-2 font-semibold px-5">
                    Tin nổi bật
                </h3>
            </div>
            <Slider {...settings} className="px-7">
                {newestPosts.map((post, index) => {
                    return (
                        <div className="p-1">
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
