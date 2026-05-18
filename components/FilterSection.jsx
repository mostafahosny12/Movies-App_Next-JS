"use client";
import { useState, useEffect } from "react";
export default function FilterSection({ genres = [], languages = [], placeholder }) {
  // initialize state for filter values
  const [filters, setFilters] = useState({
    genre: "all",
    year: "all",
    rating: "all",
    language: "all",
    sortBy: "",
    query: "",
  });

  // sync filter state with URL query parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFilters((prev) => ({
      ...prev,
      genre: params.get("genre") || "",
      year: params.get("year") || "",
      rating: params.get("rating") || "",
      language: params.get("language") || "",
      sortBy: params.get("sortBy") || "",
      query: params.get("query") || "",
    }))
  }, []); // empty dependency array to run once on mount
  // handle changes to filter inputs and update state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value })); // update the specific filter field
  };

  // handle search button click to update URL with  filter values
  const handleSearch = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([keyframes, value]) => {
      if (value) params.set(keyframes, value); // add non-empty filter values to URL 
    });
    params.set("page", 1) // reset to page 1 for new filter results
    window.history.pushState({}, "", `?${params}`) // update URL without reload
  };

  // define static filter options for years and rating,and sort by
  const filterOptions = {
    years: ["2025", "2024", "2020-now", "2010-2019", "2000-2009", "1990-1999"],
    ratings: ["9", "8", "7", "6", "5", "4", "3", "2", "1"],
    sortBy: [
      { label: "Most Popular", value: "popularity.desc" },
      { label: "Newest", value: "release_date.desc" },
      { label: "Oldest", value: "release_date.asc" },
      { label: "Top Rated", value: "vote_average.desc" },
    ],
  };
  // create reusable dropdown component for filter selections
  function Dropdown({ label, name, options, value, onChange }) {
    return (
      <div>
        <label className="block mb-2 ml-1 text-sm">{label}</label>
        <select name={name} value={value} onChange={onChange} className="bg-[#252525] rounded-md px-3 py-2 w-full">
          <option value="">All</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
  return (
    <section className="bg-black text-white py-6 mt-20">
      <div className="px-4 md:px-10 xl:px-36">
        <div className="mb-6">
          <label className="block mb-2 ml-1 text-sm font-semibold">Search</label>
          <input
            type="text"
            name="query"
            placeholder={placeholder}
            autoComplete="off"
            value={filters.query}
            onChange={handleChange}
            className="bg-[#252525] rounded-xl px-4 py-2 w-full text-sm text-white placeholder-white focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {/* Genre dropdown */}
          <Dropdown
            label="Genre"
            name="genre"
            value={filters.genre}
            onChange={handleChange}
            options={genres.map((genre) => ({ label: genre.name, value: genre.id }))}
          />
          {/* Year dropdown */}
          <Dropdown
            label="Year"
            name="year"
            value={filters.year}
            onChange={handleChange}
            options={filterOptions.years.map((year) => ({ label: year, value: year }))}
          />
          {/* Rating dropdown */}
          <Dropdown
            label="Rating"
            name="rating"
            options={filterOptions.ratings.map((rating) => ({ label: `${rating}+`, value: rating }))}
            value={filters.rating}
            onChange={handleChange}
          />
          {/* Language dropdown */}
          <Dropdown
            label="Language"
            name="language"
            options={languages.map((language) => ({ label: language.english_name, value: language.iso_639_1 }))}
            value={filters.language}
            onChange={handleChange}
          />
          {/* Sort By dropdown */}
          <Dropdown
            label="Sort By"
            name="sortBy"
            options={filterOptions.sortBy}
            value={filters.sortBy}
            onChange={handleChange}
          />
          {/* Search button */}
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className=" w-full px-5 py-2 rounded-md text-black font-semibold bg-yellow-400 hover:bg-yellow-500 cursor-pointer transition"
            >
              Search
            </button>
          </div>
        </div>

      </div>
    </section>)
}
