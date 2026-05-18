"use client"

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import TrailerModal from "./TrailerModal";

// create helper function to fetch JSON data from URL (used with SWR to automatically fetch and cache data)
const fetcher = (url) => fetch(url).then((res) => {
    if (res.status === 404) return { results: [] };
    if (!res.ok) throw new Error("Failed to fetch data"); return res.json()
});
export default function Card({ media }) {
    // destructure the media properties with fallback values
    const {
        id,
        poster_path: posterPath,
        title,
        name,
        vote_average,
        media_type: mediaType = "movie",

    } = media || {};
    // fallback title if name or title are missing
    const displayTitle = title || name || "Untitled";

    const [isModalOpen, setIsModalOpen] = useState(false); // state to control the trailer modal open or not

    // fetch the trailer videos using SWR if media is available
    const { data: trailerData, error } = useSWR(
        media ? `https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US` : null,
        fetcher
    );

    // get the first youtube trailer from the fetched videos list
    const trailer = trailerData?.results.find(
        (video) => video.site === "YouTube" && video.type === "Trailer"
    )
    // build the Youtube URL for embedding the trailer
    const trailerUrl = trailer ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1` : "null"

    const openModal = () => { if (trailer) setIsModalOpen(true); } // function to open the modal if trailer is available
    const closeModal = () => setIsModalOpen(false); // function to close the modal

    return (
        <div className="flex-none w-40 sm:w-48 md:w-56 min-w-40 max-w-55 bg-[#18181b] rounded-lg overflow-hidden shadow-lg snap-start">
            <Link href={`/details?id=${id}&mediaType=${mediaType}`} >
                <div className="relative aspect-2/3 group cursor-pointer">
                    <Image alt={displayTitle} fill src={posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : "/default_poster.jpg"}
                        className="object-cover rounded-t-lg group-hover:brightness-95 transition-all"
                        sizes="33vw"
                        quality={90}
                        unoptimized={true}
                        loading="eager"
                    />
                </div>
            </Link>

            <div className="p-4 flex flex-col gap-2">
                <p className="text-xs sm:text-sm text-yellow-400">
                    ★ {vote_average?.toFixed(1) || "N/A"}
                </p>
                <Link href={`/details?id=${id}&media_type=${mediaType}`}>
                    <h3 className="text-base sm:text-lg my-1 font-semibold text-white line-clamp-2 h-12 sm:h-14 cursor-pointer hover:underline">
                        {displayTitle}
                    </h3>
                </Link>
                <button
                    onClick={openModal}
                    disabled={!trailerUrl}
                    className={`flex items-center justify-center gap-1 w-full py-2 bg-[#18181b]
                            text-white font-bold border border-gray-600 rounded-4xl hover:bg-[#252525] transition-colors
                            ${!trailerUrl ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                    <Image src="/youtube.webp" alt="play" width={20} height={20} className="w-8 h-6 -mb-px" />
                    Trailer
                </button>
            </div>
            <TrailerModal isOpen={isModalOpen} onClose={closeModal} trailerUrl={trailerUrl} />
        </div>
    )

}
