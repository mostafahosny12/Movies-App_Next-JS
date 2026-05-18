import Card from "./Card";

// fetch the trending movies of the week from TMDB
async function fetchTrendingMovies() {
    // get the TMDB API key from environment variables
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    // make api request to get the trending movies
    const res = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`);
    // if the request fails, return an empty array
    if (!res.ok) return [];
    // convert the response to JSON and display only 5 movies starting from index 3
    const data = await res.json();
    const movies = data.results ? data.results.slice(3, 8) : [];
    // return the movies list
    return movies;
}

export default async function TrendingMovies() {
    const movies = await fetchTrendingMovies();
    return (
        <section className="py-8 px-4 sm:px-8 md:px-20 bg-black text-white">
            <h2 className="text-2xl font-bold mb-4 sm:text-3xl md:text-4xl text-yellow-400">Trending Movies</h2>
            <div className="flex overflow-x-auto gap-14 pb-4">
                {movies.length > 0 ? (
                    movies.map((movie) => <Card key={movie.id} media={movie} />)) :
                    (<p className="text-gray-400">No trending movies found.</p>)}
            </div>

        </section>
    )
}
