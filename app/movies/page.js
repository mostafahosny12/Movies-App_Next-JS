"use client";

import MediaDisplay from "@/components/MediaDisplay";
import Pagination from "@/components/Pagination";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useMemo, Suspense } from "react";
import FilterSection from "@/components/FilterSection";

import useSWR from "swr";
// create helper function to fetch JSON data from URL (used with SWR to automatically fetch and cache data)
const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch data");
    return res.json();
  });

// filter section - step 1 : define fixed year ranges for filtering movies by release date
const yearRanges = {
  2025: { gte: "2025-01-01", lte: "2025-12-31" },
  2024: { gte: "2024-01-01", lte: "2024-12-31" },
  "2020-now": { gte: "2020-01-01" },
  "2010-2019": { gte: "2010-01-01", lte: "2019-12-31" },
  "2000-2009": { gte: "2000-01-01", lte: "2009-12-31" },
  "1990-1999": { gte: "1990-01-01", lte: "1999-12-31" },
};

function MoviesContent() {
  const router = useRouter(); // to change the page url when the pagination happens
  const pathname = usePathname(); // to get the current page path
  const searchParams = useSearchParams(); //to read the current url query (like: ?page=2)

  //get the current page number from the url and update the page state (defaults to 1 if missing or invalid)
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  // filter section - step 2 : extract filter values from the url (default tot "all")
  const genre = searchParams.get("genre") || "all";
  const year = searchParams.get("year") || "all";
  const rating = searchParams.get("rating") || "all";
  const language = searchParams.get("language") || "all";
  const sortBy = searchParams.get("sortBy") || "popularity.desc";
  const query = searchParams.get("query") || "";

  // filter section - step 3 :  convert the selected year to a date range object for filtering
  const yearRange = yearRanges[year] || {};

  // filter section - step 4 : modify the API URL to support both discover and search modes based on query presence
  // define the TMDB API URL to get a list of popular movies - include the page at the api url
  const baseUrl = query
    ? `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    : `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`;

  // filter section - step 5 :  apply filter parameters to the API URL in discover mode
  const apiURL = new URL(baseUrl);
  apiURL.searchParams.set("page", page);
  if (!query) {
    if (genre !== "all") apiURL.searchParams.set("with_genres", genre);
    if (language !== "all")
      apiURL.searchParams.set("with_original_language", language);
    if (rating !== "all") apiURL.searchParams.set("vote_average.gte", rating);
    if (sortBy !== "all") apiURL.searchParams.set("sort_by", sortBy);
    if (yearRange.gte)
      apiURL.searchParams.set("primary_release_date.gte", yearRange.gte);
    if (yearRange.lte)
      apiURL.searchParams.set("primary_release_date.lte", yearRange.lte);
  }
  // use SWR to fetch and cache the movies data
  const { data: moviesData } = useSWR(apiURL.toString(), fetcher);

  // filter section - step 6 : feth genres and languages for filter dropdowns options

  const { data: languagesData } = useSWR(
    `https://api.themoviedb.org/3/configuration/languages?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
    fetcher,
  );
  const { data: genresData } = useSWR(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`,
    fetcher,
  );

  // filter section - step 7 : add a helper function to manually filter movies in search mode (because TMDB search endpoint does not support filter params)
  function filterMovies(movies) {
    return movies.filter((movie) => {
      const date = new Date(movie.release_date || "");
      return (
        (genre === "all" || movie.genre_ids.includes(parseInt(genre))) &&
        (language === "all" || movie.original_language === language) &&
        (rating === "all" || movie.vote_average >= parseFloat(rating)) &&
        (!yearRange.gte || date >= new Date(yearRange.gte)) &&
        (!yearRange.lte || date <= new Date(yearRange.lte))
      );
    });
  }

  // filter section - step 8 : apply the manual filtering in search mode using useMemo to optimize performance
  const filteredMovies = useMemo(() => {
    if (!moviesData) return [];
    return query
      ? filterMovies(moviesData.results, { genre, language, rating, yearRange })
      : moviesData.results;
  }, [moviesData, genre, language, rating, yearRange, query]);

  // get total number of pages from the api response, and fallback to 1 if not available
  const totalPages = moviesData?.total_pages || 1;

  // filter section - step 9 : extract genres and languages for filterSection component,default to empty arrays if undefined
  const genres = genresData?.genres || [];
  const languages = languagesData || [];
  // update the url with the new page number when navigate to a diffrent page
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // filter section - step 10 : update the loading state to include genres and languages data
  // if data is still loading, show a loading message
  if (!moviesData || !genresData || !languagesData)
    return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4">
      {/* filter section - step 11 : add filterSection component to render filter UI with genres and languages */}
      <FilterSection
        genres={genres}
        languages={languages}
        placeholder="Search movies..."
      />
      {/* use filterMovies insted of movies in mediaDisplay component */}
      <MediaDisplay items={filteredMovies} />
      {/* Show the pagination only if there are enough results - update pagination to reflect filteredMovies length */}
      {filteredMovies.length >= 15 && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onpageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default function MoviesPage() {
  return (
    <Suspense
      fallback={
        <div className="text-white text-center mt-10">Loading movies...</div>
      }
    >
      <MoviesContent />
    </Suspense>
  );
}
