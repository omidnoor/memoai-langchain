/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  // env: {
  //   OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  //   SERP_API_KEY: process.env.SERP_API_KEY,
  //   PINECONE_API_KEY: process.env.PINECONE_API_KEY,
  //   PINECONE_ENV: process.env.PINECONE_ENV,
  //   PINECONE_INDEX: process.env.PINECONE_INDEX,
  // },
};

module.exports = nextConfig;
