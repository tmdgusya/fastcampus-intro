import { NextResponse } from "next/server";
import { getProductById } from "@/lib/products";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * `GET /api/products/:id` — 단일 상품을 반환한다.
 * 프론트엔드 상품 상세 화면(`/products/[id]`)에서 사용한다.
 * 존재하지 않는 id는 404로 응답한다.
 */
export async function GET(
  _request: Request,
  { params }: RouteContext,
): Promise<NextResponse> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return NextResponse.json(
      { error: "해당 상품을 찾을 수 없습니다." },
      { status: 404 },
    );
  }

  return NextResponse.json(product);
}