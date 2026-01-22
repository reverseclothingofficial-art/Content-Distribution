import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d1z5rlctx30xsi.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
