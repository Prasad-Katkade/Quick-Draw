import React from "react";

export default function Modal({ children, onClose, closeable = true }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm relative">
                {children}
                {closeable && <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-black"
                >
                    ✕
                </button>}
            </div>
        </div>
    );
}
