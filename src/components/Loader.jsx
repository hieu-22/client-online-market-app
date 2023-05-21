import React, { useState } from "react"
import { BeatLoader } from "react-spinners"

const Loader = () => {
    return (
        <div className="absolute right-0 left-0  h-screen z-[9999] bg-white sweet-loading flex justify-center  ">
            <div className="absolute top-[36%]">
                <BeatLoader size={24} color={"#00a2d6"} />
            </div>
        </div>
    )
}

export default Loader
