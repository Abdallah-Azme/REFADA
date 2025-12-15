import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  linting: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  output: "standalone",
};

export default withNextIntl(nextConfig);
