"use client"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, Search, X } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
export default function Header() {
    const pathname = usePathname()  //using pathname to highlight the active 
    const [isMenuOpen, setIsMenuOpen] = useState(false) // state for controll mobile menu
    const [isSearchOpen, setIsSearchOpen] = useState(false) // state for controll search visibility
    const [searchTerm, setSearchTerm] = useState("") // state to store search input value
    const [suggestions, setSuggestions] = useState([]) // state to store search suggestions results
    const [isLoading, setIsLoading] = useState(false) // state to track loading status

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Movies", href: "/movies" },
        { name: "TV Series", href: "/tv-series" },
    ]

    // fetch search suggestions from TMDB API based on input value

    const fetchSuggestions = async (query) => {
        // clear suggestions if query is empty or spaces
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }
        // show loading indicator before starting api call
        setIsLoading(true);
        try {
            // get TMDB API key from env.local
            const apiKey = process.env.TMDB_API_KEY;
            // build api url with encoded query for safe url formating
            const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`
            // fetch search results without caching for fresh data
            const res = await fetch(url, { cache: "no-store" });
            if (res.ok) {
                // convert response to json
                const data = await res.json();
                // keep only movie and tv series and limit to 5 results
                const filteredResults = data.results.filter((item) => item.media_type === "movie" || item.media_type === "tv").slice(0, 5) || [];
                // update suggestions with filtered results
                setSuggestions(filteredResults);
            } else {
                // clear suggestions if api call fails
                setSuggestions([]);
            }

        } catch (error) {
            // log error and clear suggestions on failure
            console.log(error);
            setSuggestions([]);
        } finally {
            // hide loading indicator after api call finishes
            setIsLoading(false);
        }
    }

    // handle search button click behavior
    const handleSearchClick = () => {
        // if search is open and suggestions exist,close search and reset
        if (isSearchOpen && suggestions.length > 0) {
            // close search
            setIsSearchOpen(false);
            // clear search term
            setSearchTerm("");
            // clear suggestions
            setSuggestions([]);
        } else if (searchTerm.trim()) {
            // if search term exists , open search and fetch suggestions
            setIsSearchOpen(true);
            fetchSuggestions(searchTerm);
        }
    }

    return (
        <motion.header
            className="bg-transparent text-white w-full px-4 py-2 z-50 absolute top-0 left-0 md:px-10 xl:px-36"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Desktop Design Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* 1- Logo */}
                <div className="flex items-center justify-between w-full md:w-auto">
                    <Link href="/" className="flex flex-col items-center">
                        <span className="font-bold text-2xl md:text-xl lg:text-3xl text-yellow-400">Rise of Coding</span>
                        <span className="text-xs lg:text-base text-white">Movies and TV Series</span>
                    </Link>

                    {/* mobile menu toggle button */}
                    <motion.button
                        className="md:hidden text-white hover:text-white/80 cursor-pointer"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        whileTap={{ scale: 0.9 }}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </motion.button>
                </div>

                {/* 2- Search bar */}
                <motion.div className="relative w-full md:w-1/3 md:mx-8 hidden md:block">
                    <input type="text" placeholder="Quick Search" className="w-full px-4 py-1.5 lg:py-3 bg-white text-sm text-gray-500 rounded-xl focus:outline-none border border-gray-500 focus:border-white pr-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onBlur={() => setIsSearchOpen(false)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
                    />
                    <button className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-default" onClick={handleSearchClick}>
                        {isLoading ? (
                            // show loading spinner during api call
                            <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                        ) : isSearchOpen && suggestions.length > 0 ? (
                            // show close icon if search is open and suggestions exist
                            <X className="w-5 h-5 text-gray-500" />
                        ) : (
                            // show search icon if search is closed or no suggestions exist
                            <Search className="w-5 h-5 text-gray-500" />
                        )}
                    </button>

                    {/* animated suggestions dropdown */}
                    <AnimatePresence>
                        {isSearchOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-full w-full bg-[#18181b] border border-gray-500 rounded-lg shadow-lg mt-1 z-50">
                                {/* render suggestions or no results found message */}
                                {suggestions.length > 0 ?
                                    suggestions.map((item) => (
                                        <Link href={"/"} key={item.id}>
                                            <div className="flex items-center gap-2 p-2 hover:bg-[#252525] rounded-lg cursor-pointer">
                                                <Image
                                                    src={
                                                        item.poster_path
                                                            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                                                            : "/default_poster.jpg"
                                                    }
                                                    alt=""
                                                    width={32}
                                                    height={48}
                                                    className="w-8 aspect-2/3 object-cover rounded"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="text-sm text-white line-clamp-2 h-10">
                                                        {item.title || item.name || "Unnamed"}
                                                    </h3>
                                                    <p>
                                                        {(item.release_date || item.first_air_date).split("-")[0] || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    )) : (
                                        // no results found
                                        <div className="text-sm p-2 text-gray-400 text-center">
                                            No results found
                                        </div>
                                    )}

                            </motion.div>)}
                    </AnimatePresence>
                </motion.div>

                {/* 3- Navigation */}
                <nav className="hidden md:flex md:items-center md:space-x-6">
                    {navLinks.map((link) => (
                        <Link href={link.href} key={link.name} className={` text-xs sm:text-base font-medium relative text-white
                        ${pathname === link.href ? "text-white" : "hover:text-white/80"}`}>
                            {link.name}

                            {pathname === link.href && (
                                <motion.span
                                    transition={{ duration: 0.3 }}
                                    layoutId="underline"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400"
                                />
                            )}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* ========== Start Mobile Menu Design ==========*/}
            <motion.div
                className={`md:hidden backdrop-blur-xs bg-[rgba(24,24,27,0.6)] z-50 absolute left-0 w-full px-4 py-4 ${isMenuOpen ? "block" : "hidden"}`}
                initial={{ y: -20, opacity: 0 }}
                animate={isMenuOpen ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                {/* Search bar */}
                <motion.div className="relative w-full mb-4">
                    <input
                        type="text"
                        placeholder="Quick Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onBlur={() => setIsSearchOpen(false)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
                        className="w-full px-4 py-2 bg-white text-sm text-gray-500 rounded-xl
                        focus:outline-none border border-gray-500 focus:border-white pr-10" />
                    <button className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-default"
                        onClick={handleSearchClick}
                    >
                        {isLoading ? (
                            // show loading spinner during api call
                            <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                        ) : isSearchOpen && suggestions.length > 0 ? (
                            // show close icon if search is open and suggestions exist
                            <X className="w-5 h-5 text-gray-500" />
                        ) : (
                            // show search icon if search is closed or no suggestions exist
                            <Search className="w-5 h-5 text-gray-500" />
                        )}
                    </button>
                    <AnimatePresence>
                        {isSearchOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-full w-full bg-[#18181b] border border-gray-500 rounded-lg shadow-lg mt-1 z-50">
                                {/* render suggestions or no results found message */}
                                {suggestions.length > 0 ?
                                    suggestions.map((item) => (
                                        <Link href={"/"} key={item.id}>
                                            <div className="flex items-center gap-2 p-2 hover:bg-[#252525] rounded-lg cursor-pointer">
                                                <Image
                                                    src={
                                                        item.poster_path
                                                            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                                                            : "/default_poster.jpg"
                                                    }
                                                    alt=""
                                                    width={32}
                                                    height={48}
                                                    className="w-8 aspect-2/3 object-cover rounded"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="text-sm text-white line-clamp-2 h-10">
                                                        {item.title || item.name || "Unnamed"}
                                                    </h3>
                                                    <p>
                                                        {(item.release_date || item.first_air_date).split("-")[0] || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    )) : (
                                        // no results found
                                        <div className="text-sm p-2 text-gray-400 text-center">
                                            No results found
                                        </div>
                                    )}

                            </motion.div>)}
                    </AnimatePresence>
                </motion.div>

                {/* Mobile Navigation Links */}
                <nav className="flex flex-col items-center gap-2">
                    {navLinks.map((link) => (
                        <Link href={link.href} key={link.name} className="block text-base font-medium text-white hover:text-white/80">
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </motion.div>
            {/*========== End Mobile Menu ==========*/}
        </motion.header>
    )
}
