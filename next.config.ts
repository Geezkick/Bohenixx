const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https" as const, hostname: "lh3.googleusercontent.com" },
      { protocol: "https" as const, hostname: "avatars.githubusercontent.com" },
      { protocol: "https" as const, hostname: "*.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
