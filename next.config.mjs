/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is to allow loading images from TMDB
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
    qualities: [75, 90],
  },
  /* config options here */
};

export default nextConfig;
