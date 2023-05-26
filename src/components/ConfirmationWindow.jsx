import React from "react"

const ConfirmationWindow = ({
    message,
    confirmText,
    onConfirm,
    cancelText,
    onCancel,
}) => {
    return (
        <div className="fixed z-50 top-0 bottom-0 left-0 right-0 bg-white-0.4 flex items-center justify-center">
            <div className="w-[260px] bg-white border border-primary rounded-md p-4">
                <p>{message}</p>
                <div className="mt-4 w-full flex justify-around">
                    <button
                        className="w-[40%] rounded-[20px] bg-primary hover:bg-light-primary text-white cursor-pointer"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                    <button
                        className="w-[40%] rounded-[20px] hover:bg-gray-200 text-gray-700 border border-gray-200"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationWindow
