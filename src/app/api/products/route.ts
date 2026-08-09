import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";

/**
 * `GET /api/products` — 전체 상품 목록을 반환한다.
 * 프론트엔드 상품 목록 화면(`/products`)에서 그리드 렌더링에 사용한다.
 */
export async function GET(): Promise<NextResponse> {
  const products = await getProducts();
  return NextResponse.json(products);
}