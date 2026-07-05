import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 패션 상품 썸네일이 로컬 SVG placeholder이므로 next/image 가 SVG 를
  // 최적화 대상으로 허용해야 한다. 인라인 스크립트 실행을 막기 위해
  // 엄격한 CSP 를 함께 적용한다.
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
