import HeroSection from "@/components/HeroSection";
import TopRatedMovies from "@/components/TopRatedMovies";
import TopRatedTvSeries from "@/components/TopRatedTvSeries";
import TrendingMovies from "@/components/TrendingMovies";
import TrendingTvSeries from "@/components/TrendingTvSeries";

export default function Home() {
  return (
    <div className="bg-black min-h-screen text-white">
      <HeroSection />
      <TrendingMovies />
      <TopRatedMovies />
      <TrendingTvSeries />
      <TopRatedTvSeries />
    </div>
  );
}
