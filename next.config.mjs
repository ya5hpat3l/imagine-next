/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "bmvcgvji2pyb.compat.objectstorage.ap-mumbai-1.oraclecloud.com",
                // port: "",
                pathname: "/imagine/**",
            }
        ],
    }
};

export default nextConfig;
