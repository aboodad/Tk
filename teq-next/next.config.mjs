/** @type {import('next').NextConfig} */

// ملفات الاتصال بـ Supabase (src/integrations/supabase/*) تقرأ المتغيرات عبر
// import.meta.env['VITE_*'] — نعرّفها هنا وقت البناء حتى تعمل كما هي بدون أي تعديل عليها.
const viteEnv = {
  VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "",
  VITE_SUPABASE_PUBLISHABLE_KEY:
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_PUBLISHABLE_KEY ?? "",
  VITE_SUPABASE_PROJECT_ID: process.env.VITE_SUPABASE_PROJECT_ID ?? process.env.SUPABASE_PROJECT_ID ?? "",
};

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "date-fns"],
  },
  webpack(config, { webpack }) {
    config.plugins.push(
      new webpack.DefinePlugin({
        "import.meta.env": JSON.stringify(viteEnv),
      }),
    );
    return config;
  },
};

export default nextConfig;
