/**
 * 가격을 한국어 콤마 포맷으로 변환한다.
 * 예: formatPrice(12000) → "12,000원"
 * 모든 가격 표시는 이 함수를 사용해야 한다. (직접 포맷 금지)
 */
export function formatPrice(price: number): string {
  return `${price.toLocaleString("ko-KR")}원`;
}
