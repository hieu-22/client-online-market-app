import React, { useEffect, useCallback, useState } from "react"
import cloudinary from "../../cloudinary"
import { useDropzone } from "react-dropzone"
import { RiImageAddLine } from "react-icons/ri"
import { AiOutlinePlus } from "react-icons/ai"
import { TiDelete } from "react-icons/ti"
import AddressForm from "./AddressForm"
import { useDispatch, useSelector } from "react-redux"
import { selectAddress, addPostThunk } from "./locationSlice"
import { useNavigate } from "react-router-dom"
import { selectUser } from "../Auth/authSlice"
import { toast } from "react-toastify"

const AddPostPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const user = useSelector(selectUser)

    const [postTitle, setPostTitle] = useState("")
    const [postTitleEmpty, setPostTitleEmpty] = useState(false)

    const [postPrice, setPostPrice] = useState("")
    const [postPriceEmpty, setPostPriceEmpty] = useState(false)

    const [postProductCondition, setPostProductCondition] = useState("")
    const [showProductConditionOption, setShowProductConditionOption] =
        useState(false)
    const [productConditionEmpty, setProductConditionEmpty] = useState(false)

    const [postDescription, setPostDescription] = useState("")
    const [postDescriptionEmpty, setPostDescriptionEmpty] = useState(false)

    const [showAddressForm, setShowAddressForm] = useState(false)

    const stateAddress = useSelector(selectAddress)
    const [addressEmpty, setAddressEmpty] = useState(false)

    // HANDLE UPLOAD IMAGES
    const [images, setImages] = useState([])
    const [imagesEmpty, setImagesEmpty] = useState(false)

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                setImages((prevImages) => [
                    ...prevImages,
                    { file: file, imageURL: reader.result },
                ])
            }
        })
    }, [])

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
    })

    /*HANDLERS */
    const handleAddPost = async () => {
        if (!postTitle) {
            setPostTitleEmpty(true)
        }
        if (!postPrice) {
            setPostPriceEmpty(true)
        }
        if (!postProductCondition) {
            setProductConditionEmpty(true)
        }
        if (!postDescription) {
            setPostDescriptionEmpty(true)
        }
        const postAddress = `${stateAddress.detailAddress}, ${stateAddress.ward}, ${stateAddress.district}, ${stateAddress.province}`
        if (!postAddress) {
            setAddressEmpty(true)
        }

        if (images.length === 0) {
            setImagesEmpty(true)
        }

        if (
            !(
                postTitle &&
                postPrice &&
                postProductCondition &&
                postDescription &&
                postAddress
            )
        ) {
            return
        }

        const formData = new FormData()

        images.forEach((image) => {
            const file = image.file
            // Append the file to the FormData object
            formData.append("images", file, file.name)
        })

        formData.append("title", postTitle)
        formData.append("price", postPrice)
        formData.append("product_condition", postProductCondition)
        formData.append("description", postDescription)
        formData.append("address", postAddress)
        formData.append("user_id", user.id)
        const result = new Promise((resolve, reject) => {
            const data = dispatch(addPostThunk(formData)).unwrap()
            resolve(data)
        }).then((data) => {
            navigate(`/posts/${data.post.post_url}`)
        })
        toast.promise(result, {
            pending: "Đang đăng tin...",
            success: "Tin đã đăng thành công!",
            error: "lỗi đăng tin",
        })
    }

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
    /**
     * to asign the `deviceType` state
     * @first set `const [deviceType, setDeviceType] = useState(null)`
     * @secondly set: `useEffect(() => {
        handleSetDeviceType()
    }, [])
    useEffect(() => {
        window.addEventListener("resize", handleSetDeviceType)
        return () => {
            window.addEventListener("resize", handleSetDeviceType)
        }
    }, [])`
     * @result `deviceType` value is one of array items ["smallMobile", "mobile", "tablet", "laptop", "desktop"]
     */
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

    const ImagesUploader = (
        <>
            <h1 className="text-lg font-semibold my-2">Ảnh / video sản phẩm</h1>
            {images.length === 0 ? (
                <div
                    className="border-dotted border-2 border-primary bg-customWhite w-full"
                    onClick={() => {
                        setImagesEmpty(false)
                    }}
                >
                    <div
                        {...getRootProps()}
                        className="flex items-center justify-center  w-full h-[260px]"
                    >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center">
                            <div className="mb-4">
                                <RiImageAddLine
                                    className={" text-primary w-20 h-20"}
                                ></RiImageAddLine>
                            </div>
                            <div className="text-gray-400">
                                ĐĂNG TỪ 1 ĐẾN 6 HÌNH
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    className={`grid ${
                        deviceType === "tablet" ? "grid-cols-6" : "grid-cols-3"
                    } gap-4`}
                >
                    <div className="border-dotted border-2 border-primary  bg-customWhite w-full">
                        <div
                            {...getRootProps()}
                            className="flex items-center justify-center  w-full h-full"
                        >
                            <input {...getInputProps()} />
                            <div>
                                <AiOutlinePlus
                                    className={" text-primary w-8 h-8"}
                                ></AiOutlinePlus>
                            </div>
                        </div>
                    </div>
                    {images.map((image, index) => {
                        return (
                            <div className="relative" key={index}>
                                <div className="h-full flex items-center border-[1px] border-gray-300 rounded-[4px]">
                                    <img
                                        className="object-contain w-full h-[86px]"
                                        src={image.imageURL}
                                        alt=""
                                    />
                                </div>
                                <TiDelete
                                    className="absolute z-10 -top-3 -right-3 w-8 h-8 cursor-pointer"
                                    onClick={() => {
                                        const newImages = images
                                        newImages.splice(index, 1)
                                        setImages([...newImages])
                                    }}
                                ></TiDelete>
                            </div>
                        )
                    })}
                </div>
            )}
            {imagesEmpty ? (
                <div className="text-red-600 mt-2">
                    Bạn chưa đính kèm ảnh sản phẩm
                </div>
            ) : (
                <></>
            )}
        </>
    )

    const ProductInput = (
        <div>
            <h2 className="mt-2 mb-4  text-lg font-semibold">
                Tiêu đề và Mô tả sản phẩm
            </h2>

            {/* tiêu đề */}
            <div className="relative text-sm">
                <input
                    className={
                        "peer w-full px-3 pt-4 pb-2 outline-gray-400 outline-2 focus:outline-primary select-none outline-none placeholder-transparent rounded-sm " +
                        (postTitle.replace(/\s+/g, "").length > 50 ||
                        postTitleEmpty
                            ? "outline-red-500 focus:outline-red-500"
                            : "")
                    }
                    type="text"
                    id="postTitle"
                    value={postTitle}
                    onChange={(event) => {
                        setPostTitle(event.target.value)
                    }}
                    placeholder="Tiêu đề"
                    onClick={() => {
                        setPostTitleEmpty(false)
                    }}
                />
                <label
                    htmlFor="postTitle"
                    className={
                        `absolute text-gray-400 ` +
                        (postTitle
                            ? `top-[-2px] left-2 text-gray-700 text-2xs font-medium`
                            : `left-3 top-3`) +
                        ` cursor-text
                        peer-focus:text-2xs peer-focus:font-medium peer-focus:text-gray-700 peer-focus:left-2 peer-focus:top-[-2px] ease-linear duration-100`
                    }
                >
                    Tiêu đề <span className="text-red-500 px-[2px]">*</span>
                </label>
                <div className="mt-1">
                    {postTitleEmpty ? (
                        <div className="text-red-600">
                            Bạn chưa nhập tiều đề
                        </div>
                    ) : (
                        <></>
                    )}
                    {postTitle.replace(/\s+/g, "").length > 50 ? (
                        <p className=" pl-3 text-red-500 text-2xs">
                            {" "}
                            Bạn đã nhập quá 50 kí tự cho phép
                        </p>
                    ) : (
                        <></>
                    )}
                    <p className="pl-3 text-gray-500 text-2xs font-semibold">
                        {" "}
                        {postTitle.replace(/\s+/g, "").length}/50 ký tự
                    </p>
                </div>
            </div>

            {/* price input */}
            <div className="relative mt-3 text-sm">
                <input
                    type="text"
                    className={
                        "peer w-full px-3 pt-4 pb-2 outline-gray-400 outline-2 focus:outline-primary focus:pt-4 select-none outline-none placeholder-transparent rounded-sm " +
                        ((postPrice && +postPrice < 10000) || postPriceEmpty
                            ? "outline-red-500 focus:outline-red-500"
                            : "")
                    }
                    value={postPrice}
                    onChange={(event) => {
                        const price = event.target.value
                        // Remove any non-digit characters from the input
                        const sanitizedPrice = price.replace(/[^0-9]/g, "")

                        // Format the input value as a Vietnamese money string
                        const formattedPrice = sanitizedPrice.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            ","
                        )
                        setPostPrice(formattedPrice)
                    }}
                    id="postPrice"
                    onClick={() => {
                        setPostPriceEmpty(false)
                    }}
                />
                <label
                    htmlFor="postPrice"
                    className={
                        `absolute text-gray-400 ` +
                        (postPrice
                            ? `top-[-2px] left-2 text-gray-700 text-2xs font-medium`
                            : `left-3 top-3`) +
                        ` cursor-text
                        peer-focus:text-2xs peer-focus:font-medium peer-focus:text-gray-700 peer-focus:left-2 peer-focus:top-[-2px] ease-linear duration-100`
                    }
                >
                    Giá <span className="text-red-500 px-[2px]">*</span>
                </label>
                {postPrice ? (
                    <span className="absolute right-2 top-[14px]  text-gray-400  text-sm">
                        đ
                    </span>
                ) : (
                    <></>
                )}
                {postPriceEmpty ? (
                    <div className="text-red-600 mt-1">Bạn chưa nhập giá</div>
                ) : (
                    <></>
                )}
                <div className="mt-1">
                    {postPrice && +postPrice < 10000 ? (
                        <p className=" pl-3 text-red-500 text-2xs">
                            {" "}
                            Vui lòng điền giá hơn 10.000 đồng
                        </p>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            {/* condition */}
            <div className="relative mt-6 text-sm">
                <input
                    type="text"
                    className={
                        "peer w-full px-3 pt-4 pb-2 outline-gray-400 outline-2 focus:outline-primary focus:pt-4 select-none outline-none placeholder-transparent rounded-sm " +
                        (productConditionEmpty
                            ? "outline-red-500 focus:outline-red-500"
                            : "")
                    }
                    id="postProductCondition"
                    value={postProductCondition}
                    onChange={(event) => {
                        setPostProductCondition(event.target.value)
                    }}
                    onClick={(event) => {
                        event.stopPropagation()
                        setShowProductConditionOption(true)
                        setProductConditionEmpty(false)
                    }}
                    autocomplete="off"
                />
                <label
                    htmlFor="postProductCondition"
                    className={
                        `absolute text-gray-400 ` +
                        (postProductCondition
                            ? `top-[-2px] left-2 text-gray-700 text-2xs font-medium`
                            : `left-3 top-3`) +
                        ` cursor-text
                        peer-focus:text-2xs peer-focus:font-medium peer-focus:text-gray-700 peer-focus:left-2 peer-focus:top-[-2px] ease-linear duration-100`
                    }
                >
                    Tình trạng <span className="text-red-500 px-[2px]">*</span>
                </label>
                {productConditionEmpty ? (
                    <div className="text-red-600 mt-1">
                        Bạn chưa nhập tình trạng
                    </div>
                ) : (
                    <></>
                )}
                <ul
                    className={
                        ` absolute top-11 z-50 hidden bg-white w-full shadow-big rounded-lg ` +
                        (showProductConditionOption ? "!block" : "")
                    }
                >
                    <li
                        className="pl-2 py-3 text-gray-500 hover:bg-gray-100 cursor-pointer"
                        onClick={(event) => {
                            setPostProductCondition("Mới")
                            setShowProductConditionOption(false)
                        }}
                    >
                        Mới
                    </li>
                    <li
                        className="pl-2 py-3 text-gray-500 hover:bg-gray-100 cursor-pointer"
                        onClick={(event) => {
                            setPostProductCondition("Đã sử dụng (qua sửa chữa)")
                            setShowProductConditionOption(false)
                        }}
                    >
                        Đã sử dụng (qua sửa chữa)
                    </li>
                    <li
                        className="pl-2 py-3 text-gray-500 hover:bg-gray-100 cursor-pointer"
                        onClick={(event) => {
                            setPostProductCondition(
                                "Đã sử dụng (chưa sửa chữa)"
                            )
                            setShowProductConditionOption(false)
                        }}
                    >
                        Đã sử dụng (chưa sửa chữa)
                    </li>
                </ul>
            </div>

            {/* mô tả */}
            <div className="relative mt-6 text-sm ">
                <textarea
                    className={
                        "peer w-full px-3 pt-4 pb-2 outline-gray-400 outline-2 focus:pt-[18px] focus:outline-primary select-none outline-none rounded-sm " +
                        (postDescription ? "pt-[18px] " : "") +
                        ((postDescription &&
                            postDescription.replace(/\s+/g, "").length < 30) ||
                        postDescriptionEmpty
                            ? "outline-red-500 focus:outline-red-500"
                            : "")
                    }
                    name="description"
                    id="description"
                    value={postDescription}
                    onChange={(event) => {
                        setPostDescription(event.target.value)
                    }}
                    onClick={() => {
                        setPostDescriptionEmpty(false)
                    }}
                    placeholder=" 
                    - Xuất xứ, tình trạng hàng hoá/sản phẩm
                    - Thời gian sử dụng
                    - Bảo hành nếu có
                    - Sửa chữa, nâng cấp, phụ kiện đi kèm
                    - Chấp nhận thanh toán/ vận chuyển qua Chợ Tốt
                    - Chính sách bảo hành, bảo trì, đổi trả hàng hóa/sản phẩm
                    - Địa chỉ giao nhận, đổi trả hàng hóa/sản phẩm"
                    rows={postDescription ? 12 : 8}
                ></textarea>
                <label
                    htmlFor="description"
                    className={
                        `absolute text-gray-400 bg-white z-10 w-[90%] pt-2 pb-1 ` +
                        (postDescription
                            ? `top-[0px] left-2 text-gray-700 text-2xs !py-0 font-medium `
                            : `left-3 top-1`) +
                        ` cursor-text
                        peer-focus:!py-0 peer-focus:text-2xs peer-focus:font-medium peer-focus:text-gray-700 peer-focus:left-2 peer-focus:top-[0px] ease-linear duration-100`
                    }
                >
                    Mô tả sản phẩm{" "}
                    <span className="text-red-500 px-[2px]">*</span>
                </label>
                <div className="mt-1">
                    {postDescriptionEmpty ? (
                        <div className="text-red-600">Bạn chưa nhập mô tả</div>
                    ) : (
                        <></>
                    )}
                    {postDescription.replace(/\s+/g, "").length < 30 &&
                    postDescription.replace(/\s+/g, "").length > 0 ? (
                        <p className=" pl-3 text-red-500 text-2xs">
                            {" "}
                            Vui lòng nhập ít nhất 30 ký tự
                        </p>
                    ) : (
                        <></>
                    )}
                    <p className="pl-3 text-gray-500 text-2xs font-semibold">
                        {postDescription.replace(/\s+/g, "").length}/1500 ký tự
                    </p>
                </div>
            </div>

            {/* address */}
            <div className="relative mt-3 text-sm">
                <input
                    type="text"
                    className={
                        "peer w-full px-3 pt-4 pb-2 outline-gray-400 outline-2 focus:outline-primary focus:pt-4 select-none outline-none placeholder-transparent rounded-sm " +
                        (stateAddress ? "pt-4 " : "") +
                        (addressEmpty ? " outline-red-500" : "")
                    }
                    id="postLocation"
                    value={
                        stateAddress?.detailAddress
                            ? `${stateAddress.detailAddress}, ${stateAddress.ward}, ${stateAddress.district}, ${stateAddress.province}`
                            : stateAddress.detailAddress
                    }
                    onClick={(event) => {
                        event.stopPropagation()
                        setShowAddressForm(true)
                        setAddressEmpty(false)
                    }}
                    autoComplete="off"
                />
                <label
                    htmlFor="postLocation"
                    className={
                        `absolute text-gray-400 ` +
                        (stateAddress?.detailAddress
                            ? `top-[-2px] left-2 text-gray-700 text-2xs font-medium`
                            : `left-3 top-3`) +
                        ` cursor-text
                        peer-focus:text-2xs peer-focus:font-medium peer-focus:text-gray-700 peer-focus:left-2 peer-focus:top-[-2px] ease-linear duration-100`
                    }
                >
                    Địa chỉ <span className="text-red-500 px-[2px]">*</span>
                </label>
            </div>
            <div className="mt-1">
                {addressEmpty ? (
                    <div className="text-red-600 text-xs">
                        Bạn chưa nhập địa chỉ
                    </div>
                ) : (
                    <></>
                )}
            </div>
            {showAddressForm ? (
                <div
                    className="absolute top-0 left-0 right-0 z-20 h-[1200px] flex justify-center bg-[rgba(0,0,0,0.1)]"
                    onClick={(event) => {
                        setShowAddressForm(false)
                    }}
                >
                    <AddressForm
                        showAddressForm={setShowAddressForm}
                        deviceType={deviceType}
                    />
                </div>
            ) : (
                <></>
            )}
        </div>
    )

    return (
        <div
            className="bg-customWhite py-10"
            onClick={() => {
                setShowProductConditionOption(false)
            }}
        >
            <div
                className={`laptop:w-laptop ${
                    deviceType === "desktop" || deviceType === "laptop"
                        ? "flex"
                        : ""
                }  gap-x-12 bg-white p-6 rounded-md m-auto `}
            >
                <div
                    className={`w-full ${
                        deviceType === "desktop" || deviceType === "laptop"
                            ? "w-2/6"
                            : ""
                    }`}
                >
                    {ImagesUploader}
                </div>
                <div
                    className={`w-full ${
                        deviceType === "desktop" || deviceType === "laptop"
                            ? "w-4/6"
                            : ""
                    }`}
                >
                    <div className="">{ProductInput}</div>
                    <div className="flex items-center justify-between gap-x-6 mt-9">
                        <button className=" block w-[50%] py-2 border border-primary text-primary rounded-md hover:bg-hover-primary  ">
                            HỦY
                        </button>
                        <button
                            className=" block w-[50%] py-2 bg-primary text-white rounded-md hover:bg-light-primary"
                            onClick={handleAddPost}
                        >
                            ĐĂNG TIN
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddPostPage
