/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
        port: '',
        pathname: '**',
      },
    ],
  },
  rewrites: async () => {
    return [
      {
        source: '/server/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? `http://localhost:5328/server/:path*`
            : `${process.env.NEXT_PUBLIC_FLASK_DEPLOYURL}server/:path*`,
      },
    ]
  },
};

export default nextConfig;
