import React from "react"

const Catagories = () => {
    return (
        <div className="laptop:w-laptop m-auto bg-white px-5 py-3">
            <div>
                <h3 className="text-text text-lg py-2 font-semibold">
                    Khám phá danh mục
                </h3>
            </div>
            <div className="grid grid-rows-2 grid-cols-4">
                <div className="border-[1px] bg-primary h-[180px] hover:-translate-y-[1px] cursor-pointer"></div>
            </div>
        </div>
    )
}

export default Catagories
