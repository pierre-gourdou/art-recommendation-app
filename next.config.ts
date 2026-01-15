import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://${process.env.AWS_PUBLIC_IP}/:path*`,
      },
    ]
  },
  /* config options here */
  reactCompiler: true,  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'artwork-portfolio-project.s3.eu-north-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;


