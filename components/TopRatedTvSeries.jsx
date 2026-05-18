import Card from "./Card";

// fetch the top rated tv series from TMDB
async function fetchTopRatedTvSeries() {
    // get the TMDB API key from environment variables
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    // make api request to get the top rated tv series
    const res = await fetch(
        `https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}`);
    // if the request fails, return an empty array
    if (!res.ok) return [];
    // convert the response to JSON and display only 5 tv series 
    const data = await res.json();
    const tvSeries = data.results ? data.results.slice(0, 5) : [];
    // return the tv series list
    return tvSeries;
}

export default async function TopRatedTvSeries() {
    const tvSeries = await fetchTopRatedTvSeries();
    return (
        <section className="py-8 px-4 sm:px-8 md:px-20 bg-black text-white">
            <h2 className="text-2xl font-bold mb-4 sm:text-3xl md:text-4xl text-yellow-400">Top Rated TV Series</h2>
            <div className="flex overflow-x-auto gap-14 pb-4">
                {tvSeries.length > 0 ? (
                    tvSeries.map((item) => <Card key={item.id} media={item} />)) :
                    (<p className="text-gray-400">No top rated tv series found.</p>)}
            </div>

        </section>
    )
}
