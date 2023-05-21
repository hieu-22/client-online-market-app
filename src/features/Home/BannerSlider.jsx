import React, { useState } from "react"
import Slider from "react-slick"

const BannerSlider = () => {
    const [activeIndex, setActiveIndex] = useState(0)

    const settings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
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
        "https://lh3.googleusercontent.com/-3Cc11wpHxdkLtJK10sTBY1X4Qmz4g-gFCL2iMGIG8UQbPAwjuK6zxLpTHzBuxVNCXEakkRJ7nsvQs1-70wmiJ-vOy2HB4g=rw-w0",
        "https://lh3.googleusercontent.com/M9Avtz7pcn5YvzMZhz8voAFShKaKR9Z6lFp3flphZQSf_lVMBft578xsAIzeLOQDv4vaoOytHl4Hf3tHskdT29IRcVlPz_4=rw-w0",
    ]
    return (
        <div className="laptop:w-laptop m-auto py-5">
            <Slider {...settings}>
                {bannerUrls.map((items, index) => {
                    return (
                        <div key={index} className="focus:outline-none">
                            <img
                                className="h-[260px] w-full"
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

export default BannerSlider
