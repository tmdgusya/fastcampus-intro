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
    name: "오버핏 울 블렌드 아우터",
    price: 289000,
    imageUrl: "/images/product-01.svg",
    description:
      "넉넉한 오버핏 실루엣의 울 블렌드 아우터입니다. 흐르는 듯 자연스러운 핏으로 일상적인 레이어링에 적합합니다. 부드러운 텍스처가 닿는 순간부터 편안함을 전합니다.",
  },
  {
    id: "2",
    name: "하이넥 케이블 니트",
    price: 89000,
    imageUrl: "/images/product-02.svg",
    description:
      "클래식한 케이블 패턴의 하이넥 니트입니다. 골지 짜임의 하이넥이 목선을 따뜻하게 감싸줍니다. 베이직한 데님과 함께 겨울 내내 부담 없이 입기 좋습니다.",
  },
  {
    id: "3",
    name: "플로럴 롱 원피스",
    price: 159000,
    imageUrl: "/images/product-03.svg",
    description:
      "은은한 플로럴 패턴이 흐르는 롱 기장 원피스입니다. 가벼운 소재가 바람에 자연스럽게 흩날려 여름부터 초가을까지 다양하게 활용할 수 있습니다.",
  },
  {
    id: "4",
    name: "와이드 버튼다운 셔츠",
    price: 79000,
    imageUrl: "/images/product-04.svg",
    description:
      "여유로운 와이드 핏의 버튼다운 셔츠입니다. 산뜻한 코튼 혼방 원단으로 통기성이 좋고, 단추를 풀어 레이어링하면 캐주얼한 무드까지 연출할 수 있습니다.",
  },
  {
    id: "5",
    name: "벨트 트렌치 코트",
    price: 320000,
    imageUrl: "/images/product-05.svg",
    description:
      "웨이스트 벨트로 실루엣을 조절할 수 있는 트렌치 코트입니다. 클래식한 더블 버튼 디테일과 떨어지는 핏이 스타일리시한 첫인상을 만들어 줍니다. 봄·가을 환절기 아우터로 제격입니다.",
  },
  {
    id: "6",
    name: "미니멀 크로스백",
    price: 119000,
    imageUrl: "/images/product-06.svg",
    description:
      "깔끔한 선의 미니멀 크로스백입니다. 가볍고 내구성 좋은 소재로 제작되어 데일리 백으로 부담 없이 사용할 수 있습니다. 조절 가능한 스트랩으로 사이즈에 맞게 착용하세요.",
  },
  {
    id: "7",
    name: "포인트토 로퍼",
    price: 139000,
    imageUrl: "/images/product-07.svg",
    description:
      "날렵한 포인트토가 특징인 로퍼입니다. 부드러운 합성 가죽으로 제작되어 오래 신어도 편안합니다. 슬랙스부터 데님까지 다양한 하의와 매치하기 좋습니다.",
  },
  {
    id: "8",
    name: "실크 스카프 랩",
    price: 49000,
    imageUrl: "/images/product-08.svg",
    description:
      "실크 블렌드 원단의 가벼운 스카프입니다. 은은한 광택과 부드러운 촉감으로 목이나 헤어에 두르면 포인트가 됩니다. 작은 사이즈로 언제든 가볍게 연출할 수 있습니다.",
  },
];
