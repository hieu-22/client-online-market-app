import React, { useState } from "react"
import Slider from "react-slick"

const ChatBannerSlider = () => {
    const [activeIndex, setActiveIndex] = useState(0)

    const settings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1500,
        customPaging: (i) => {
            return (
                <div
                    className={` w-2 h-2 rounded-[50%] bg-gray-200 -translate-y-8 ${
                        activeIndex === i ? " bg-primary " : ""
                    } `}
                ></div>
            )
        },
        beforeChange: function (current, next) {
            setActiveIndex(next)
        },
    }

    const bannerUrls = [
        "https://res.cloudinary.com/duhbzyhtj/image/upload/v1686449161/emptyRoom_vvfkj4.png",
        "https://res.cloudinary.com/duhbzyhtj/image/upload/v1686449161/emptyRoom2_vpwdsd.png",
    ]
    return (
        <div className="w-full">
            <Slider {...settings} className="w-full">
                {bannerUrls.map((items, index) => {
                    return (
                        <div
                            key={index}
                            className="w-full h-full focus:outline-none"
                        >
                            <img
                                className="w-full h-full object-cover"
                                src={items}
                                alt=""
                            />
                        </div>
                    )
                })}
            </Slider>
        </div>
    )
}

export default ChatBannerSlider
