/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.0.23"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ftp3.syscom.mx",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.syscom.mx",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
