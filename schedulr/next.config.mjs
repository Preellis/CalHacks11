/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.experiments.buildHttp = {
      allowedUris: [
        'https://unpkg.com/@xenova/transformers@2.13.2',
      ],
    };
    return config;
  }
};

export default nextConfig;
