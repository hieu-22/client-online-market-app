import React, { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { TiDelete } from "react-icons/ti"

const Dropzone = ({
    text,
    setImages,
    title,
    images,
    className,
    closeDropzone,
    saveImages,
}) => {
    const onDrop = useCallback((acceptedFiles) => {
        // Do something with the files
        const file = acceptedFiles[0]
        const reader = new FileReader() // Creates a new FileReader object, which can read the contents of a file.
        reader.readAsDataURL(file) //  This line reads the contents of the selected file as a data URL, which is a string representation of the file contents that can be used to display the image in the browser.
        reader.onload = () => {
            setImages([{ file: file, imageURL: reader.result }])
        } // the image will be displayed in the browser immediately after the user selects it
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    })

    return (
        <div
            className={`fixed shadow-big max-w-[80vw] rounded-md bg-white cursor-pointer w-[600px] ${className}`}
            onClick={(event) => {
                event.stopPropagation()
            }}
        >
            <div className="">
                <div className="relative bg-white py-3 w-full text-lg font-semibold text-center rounded-t-md border-b border-gray-300">
                    {title}
                </div>
                {images.length === 0 ? (
                    <div
                        {...getRootProps()}
                        className="flex items-center justify-center text-primary bg-customWhite hover:bg-hover-primary w-full h-full my-4"
                    >
                        <input {...getInputProps()} />
                        <div className="flex items-center py-1">
                            {" "}
                            <span className="text-xl -translate-y-[2px] px-1">
                                +
                            </span>
                            {text}
                        </div>
                    </div>
                ) : (
                    <></>
                )}

                {images.length === 1 ? (
                    <div className="mx-20 my-6" {...getRootProps()}>
                        <input {...getInputProps()} />
                        {images.map((image, index) => {
                            return (
                                <div className="relative" key={index}>
                                    <div className="relative h-[400px] w-full p-1 border-[1px] border-gray-200 rounded-md bg-white ">
                                        <img
                                            className={`object-cover w-full h-full rounded-[50%]`}
                                            src={image.imageURL}
                                            alt="avatarImage"
                                        />
                                    </div>

                                    <TiDelete
                                        className="absolute z-10 -top-3 -right-3 w-8 h-8 cursor-pointer"
                                        onClick={(event) => {
                                            event.stopPropagation()
                                            const newImages = images
                                            newImages.splice(index, 1)
                                            setImages([...newImages])
                                        }}
                                    ></TiDelete>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <></>
                )}
                {/* save block */}
                <div className="border-t border-gray-300 w-full py-3 flex justify-end pr-6 gap-2">
                    <button
                        className="bg-white text-primary py-1 px-2 rounded-md hover:bg-gray-200"
                        onClick={(event) => {
                            closeDropzone(event)
                        }}
                    >
                        Hủy
                    </button>
                    <button
                        className="bg-primary opacity-80 text-white py-1 px-6 rounded-md hover:opacity-100"
                        onClick={(event) => {
                            saveImages(event)
                        }}
                    >
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Dropzone
