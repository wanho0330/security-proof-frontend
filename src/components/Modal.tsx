import React from "react";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    message: string;
}

export default function Modal({ open, onClose, message }: ModalProps) {
    if (!open) return null; // 모달이 열려 있지 않으면 아무것도 렌더링하지 않음

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Error</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        &times;
                    </button>
                </div>
                <div className="mt-4">
                    <p className="text-gray-700">{message}</p>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}