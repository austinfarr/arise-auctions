/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "www.ariseafrica.org",
      "sothebys-com.brightspotcdn.com",
      "www.pujolsfamilyfoundation.org",
      "images.unsplash.com",
    ],
  },
};

module.exports = nextConfig;
