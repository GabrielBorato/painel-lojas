/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ["oracledb"]
    },
    output: "standalone",
};

export default nextConfig;
