/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        domains:["images.unsplash.com",'cloud.appwrite.io','images.remotePatterns']
    },
    eslint:{
        ignoreDuringBuilds:true
    },
    typescript:{
        ignoreBuildErrors:true
    }
};

export default nextConfig;
