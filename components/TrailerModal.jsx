"use client";
import { useEffect, useState } from 'react';
export default function TrailerModal({ isOpen, onClose, trailerUrl, title }) {
    // handle escape key to close the modal
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
        }

        return () => {
            document.removeEventListener("keydown", handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !trailerUrl) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
            onClick={onClose}
            role="dialog"
            aria-label="Trailer Modal"
        >
            <div className="bg-[#18181b] p-4 rounded-lg w-full max-w-3xl"
                onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside the modal
            >
                <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                    <iframe
                        src={trailerUrl}
                        title={`${title} Trailer`}
                        allow=" autoplay; encrypted-media; "
                        allowFullScreen
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                    ></iframe>
                </div>
            </div>
        </div>
    )
}
