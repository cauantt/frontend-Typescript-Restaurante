/** @type {import('next').NextConfig} */
const nextConfig = {


    // next.config.js

    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'firebasestorage.googleapis.com',
          pathname: '/v0/b/**',
        },
      ],
    },
  
  


};

export default nextConfig;
