/**
 * 상품 데이터 — 단일 진실 공급원(SSOT).
 * 페이지·컴포넌트는 이 배열을 직접 import 하여 렌더링한다. (fetch/API 없음)
 * 값은 PRD 공통 문서(`docs/prd/README.md` 샘플 데이터 표)에 확정된 것을 따른다.
 */
export interface Product {
  /** 고유 식별자. 라우팅(/products/[id])에 사용 */
  id: string;
  /** 상품명 */
  name: string;
  /** 가격 (단위: 원, 정수) */
  price: number;
  /** 로컬 이미지 경로. 예: "/images/product-01.png" */
  imageUrl: string;
  /** 상세 설명 (2~4문장) */
  description: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "미니멀 화이트 머그컵",
    price: 12000,
    imageUrl: "/images/product-01.png",
    description:
      "군더더기 없는 300ml 세라믹 머그컵입니다. 부드러운 곡선의 화이트 마감으로 어떤 테이블에도 잘 어울립니다. 전자레인지와 식기세척기 사용이 가능해 데일리로 편하게 쓸 수 있습니다.",
  },
  {
    id: "2",
    name: "원목 도마 세트",
    price: 29000,
    imageUrl: "/images/product-02.png",
    description:
      "아카시아 원목으로 만든 대·소 2종 도마 세트입니다. 자연스러운 나뭇결이 그대로 살아 있어 주방에 따뜻한 포인트가 됩니다. 야채, 빵, 과일 등 용도에 따라 골라 쓰기 좋습니다.",
  },
  {
    id: "3",
    name: "코튼 캔버스 에코백",
    price: 18000,
    imageUrl: "/images/product-03.png",
    description:
      "두툼한 12온스 캔버스로 제작한 데일리 에코백입니다. 수납이 편리한 안주머니가 1개 들어 있습니다. 튼튼한 재질로 장보기와 외출 모두 부담 없이 사용할 수 있습니다.",
  },
  {
    id: "4",
    name: "아로마 소이 캔들",
    price: 22000,
    imageUrl: "/images/product-04.png",
    description:
      "100% 천연 소이왁스로 만든 향초입니다. 은은한 우디 향이 실내 분위기를 차분하게 만들어 줍니다. 약 40시간 연소가 가능해 오래도록 사용할 수 있습니다.",
  },
  {
    id: "5",
    name: "스테인리스 텀블러 500ml",
    price: 25000,
    imageUrl: "/images/product-05.png",
    description:
      "이중 진공 단열 구조로 6시간 보온, 12시간 보냉을 유지합니다. 누수 방지 뚜껑이 적용되어 가방에 넣고 다녀도 안심입니다. 매트한 마감으로 미니멀한 디자인을 완성했습니다.",
  },
  {
    id: "6",
    name: "리넨 룸슬리퍼",
    price: 15000,
    imageUrl: "/images/product-06.png",
    description:
      "통기성이 좋은 리넨 소재의 실내 슬리퍼입니다. 논슬립 밑창으로 미끄러운 바닥에서도 안정적으로 착용할 수 있습니다. 가볍고 부드러운 착용감으로 실내 생활에 편안함을 더합니다.",
  },
];
