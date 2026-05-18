import HeroSlider from "./HeroSlider";
// fetch the trending movies from TMDB including extra details for each movie
async function fetchTrendingMovies() {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;


    const res = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`,
        { headers: { "Content-Type": "application/json" }, cache: "no-store" }
    );

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`TMDB trending failed: ${res.status} ${res.statusText} - ${text}`);
    }

    const data = await res.json();
    const movies = data.results ? data.results.slice(0, 3) : [];

    const detailedMovies = await Promise.all(
        movies.map(async (movie) => {
            if (movie.media_type === "movie") {
                const detailRes = await fetch(
                    `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`,
                    { cache: "no-store" }
                );

                if (!detailRes.ok) {
                    const text = await detailRes.text().catch(() => "");
                    throw new Error(`TMDB detail failed: ${detailRes.status} ${detailRes.statusText} - ${text}`);
                }

                const detailData = await detailRes.json();
                return {
                    ...movie,
                    genres: detailData.genres,
                    runtime: detailData.runtime,
                };
            }
            return movie;
        })
    );

    return detailedMovies;
}
export default async function HeroSection() {
    const movies = await fetchTrendingMovies();
    return (
        <HeroSlider movies={movies} />
    )
}
