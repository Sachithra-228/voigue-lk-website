import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // Public images uploaded to Vercel Blob (gallery / employee portraits)
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // YouTube thumbnails for the click-to-play promo video
      { protocol: "https", hostname: "i.ytimg.com" }
    ]
  },
  async redirects() {
    return [
      // The previous B2B site's pages no longer exist; keep old links working.
      { source: "/insights", destination: "/blog", permanent: true },
      { source: "/insights/:slug", destination: "/blog/:slug", permanent: true },
      { source: "/services/:path*", destination: "/", permanent: true },
      { source: "/industries/:path*", destination: "/", permanent: true },
      { source: "/careers/:slug", destination: "/careers#current-openings", permanent: false }
    ];
  }
};

export default nextConfig;
