export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "미니멀 화이트 머그컵",
    price: 12000,
    imageUrl: "/images/product-01.png",
    description:
      "군더더기 없는 디자인의 300ml 세라믹 머그컵입니다. 매끈한 화이트 톤으로 어떤 공간에도 잘 어울립니다. 전자레인지와 식기세척기 사용이 가능해 관리가 편합니다.",
  },
  {
    id: "2",
    name: "원목 도마 세트",
    price: 29000,
    imageUrl: "/images/product-02.png",
    description:
      "아카시아 원목으로 만든 대·소 2종 도마 세트입니다. 자연스러운 나뭇결이 그대로 살아 있어 감각적입니다. 재료 손질용과 서빙용으로 나눠 쓰기 좋습니다.",
  },
  {
    id: "3",
    name: "코튼 캔버스 에코백",
    price: 18000,
    imageUrl: "/images/product-03.png",
    description:
      "두툼한 12온스 캔버스 원단으로 제작한 데일리 에코백입니다. 형태가 잘 잡혀 물건을 넉넉히 담아도 안정적입니다. 안주머니가 1개 있어 소지품 정리에 유용합니다.",
  },
  {
    id: "4",
    name: "아로마 소이 캔들",
    price: 22000,
    imageUrl: "/images/product-04.png",
    description:
      "100% 천연 소이왁스로 만든 향초입니다. 은은한 우디 향이 공간을 편안하게 채워 줍니다. 약 40시간 동안 연소되어 오래 즐길 수 있습니다.",
  },
  {
    id: "5",
    name: "스테인리스 텀블러 500ml",
    price: 25000,
    imageUrl: "/images/product-05.png",
    description:
      "이중 진공 단열 구조의 500ml 텀블러입니다. 6시간 보온, 12시간 보냉으로 온도를 오래 유지합니다. 누수 방지 뚜껑이 있어 가방에 넣고 다녀도 안심입니다.",
  },
  {
    id: "6",
    name: "리넨 룸슬리퍼",
    price: 15000,
    imageUrl: "/images/product-06.png",
    description:
      "통기성이 좋은 리넨 소재의 실내 슬리퍼입니다. 부드러운 촉감으로 오래 신어도 편안합니다. 논슬립 밑창을 적용해 미끄럼을 방지합니다.",
  },
];
