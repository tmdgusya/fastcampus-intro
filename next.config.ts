import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 실습용: next/image 최적화 캐시(immutable) 때문에 같은 파일명으로
    // 이미지를 교체하면 옛 이미지가 계속 캐시되는 문제가 있어 최적화를 끈다.
    // public/images 원본 파일을 그대로 서빙한다.
    unoptimized: true,
  },
};

export default nextConfig;
