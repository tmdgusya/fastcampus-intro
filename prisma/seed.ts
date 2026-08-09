import { prisma } from "../src/lib/prisma";

/**
 * PRD `docs/prd/README.md`의 "샘플 데이터" 표에 확정된 6개 상품.
 * `id`는 고유 문자열, `price`는 정수(원). `imageUrl`은 `/images/` 로컬 경로.
 */
const products = [
  {
    id: "1",
    name: "미니멀 화이트 머그컵",
    price: 12000,
    imageUrl: "/images/product-01.png",
    description:
      "군더더기 없는 300ml 세라믹 머그컵입니다. 담백한 화이트 컬러로 어떤 테이블에도 잘 어울려요. 전자레인지와 식기세척기 사용이 가능해 실생활에서 편리하게 쓸 수 있습니다.",
  },
  {
    id: "2",
    name: "원목 도마 세트",
    price: 29000,
    imageUrl: "/images/product-02.png",
    description:
      "아카시아 원목으로 만든 대·소 2종 도마 세트입니다. 자연스러운 나뭇결이 그대로 살아 있어 주방에 포근한 분위기를 더해줘요. 내구성이 좋아 오래 사용할 수 있습니다.",
  },
  {
    id: "3",
    name: "코튼 캔버스 에코백",
    price: 18000,
    imageUrl: "/images/product-03.png",
    description:
      "두툼한 12온스 캔버스로 제작한 데일리 에코백입니다. 안쪽에 수납 주머니 1개가 있어 작은 소지품을 따로 정리하기 좋아요. 가볍고 튼튼해서 장보기부터 여행까지 두루 쓰기 좋습니다.",
  },
  {
    id: "4",
    name: "아로마 소이 캔들",
    price: 22000,
    imageUrl: "/images/product-04.png",
    description:
      "100% 천연 소이왁스로 만든 향초입니다. 은은한 우디 향이 실내를 차분하게 감싸줘요. 약 40시간 동안 꾸준히 연소됩니다.",
  },
  {
    id: "5",
    name: "스테인리스 텀블러 500ml",
    price: 25000,
    imageUrl: "/images/product-05.png",
    description:
      "이중 진공 단열 구조의 스테인리스 텀블러입니다. 6시간 보온과 12시간 보냉이 가능해 계절에 관계없이 쓰기 좋아요. 누수 방지 뚜껑으로 가방에 넣어도 안심됩니다.",
  },
  {
    id: "6",
    name: "리넨 룸슬리퍼",
    price: 15000,
    imageUrl: "/images/product-06.png",
    description:
      "통기성이 좋은 리넨 소재의 실내 슬리퍼입니다. 논슬립 밑창으로 미끄러짐을 방지해 안전하게 신을 수 있어요. 부드러운 착용감으로 실내에서 편안하게 사용할 수 있습니다.",
  },
];

async function main(): Promise<void> {
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product,
    });
  }
  console.log(`Seeded ${products.length} products.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });