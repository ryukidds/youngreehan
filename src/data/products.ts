export interface ProductColor {
  name: string;
  hex: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  tagline: string;
  description: string;
  basePrice: number;
  colors: ProductColor[];
  sizes: string[];
  sizeUpcharges?: Record<string, number>;
}

export const products: Product[] = [
  {
    id: "printstar-cvt",
    name: "00085-CVT 5.6온스 베이직 티셔츠",
    brand: "프린트스타",
    category: "데일리 웨어",
    tagline: "전 세계에서 가장 많이 팔리는 기성 무지 티셔츠",
    description: "5.6온스의 도톰하고 탄탄한 17수 코마사 원단으로 제작되어 비침이 적고 형태 안정성이 뛰어납니다. 36가지의 압도적인 컬러 라인업을 제공하며, 수축 방지 가공으로 세탁 후 변형을 최소화했습니다. 단체복 및 브랜드 굿즈 제작용으로 부동의 1위 제품입니다.",
    basePrice: 9900,
    colors: [
      { name: "오트밀", hex: "#e2dbcd", image: "/images/products/printstar-cvt/00085-CVT-039_M.jpg" },
      { name: "모스그레이", hex: "#859897", image: "/images/products/printstar-cvt/00085-CVT-424_M.jpg" },
      { name: "스모크옐로우", hex: "#d2b786", image: "/images/products/printstar-cvt/00085-CVT-213_M.jpg" },
      { name: "코코아브라운", hex: "#5a4540", image: "/images/products/printstar-cvt/00085-CVT-207_M.jpg" },
      { name: "애시드블루", hex: "#98adc2", image: "/images/products/printstar-cvt/00085-CVT-426_M.jpg" },
      { name: "라이트세이지", hex: "#9cb8a7", image: "/images/products/printstar-cvt/00085-CVT-423_M.jpg" },
      { name: "틸그린", hex: "#134e4d", image: "/images/products/printstar-cvt/00085-CVT-206_M.jpg" },
      { name: "화이트", hex: "#ffffff", image: "/images/products/printstar-cvt/00085-CVT-001_M.jpg" },
      { name: "모쿠 그레이", hex: "#c6c8c9", image: "/images/products/printstar-cvt/00085-CVT-003_M.jpg" },
      { name: "레드", hex: "#e6193c", image: "/images/products/printstar-cvt/00085-CVT-010_M.jpg" },
      { name: "네이비", hex: "#0f1d35", image: "/images/products/printstar-cvt/00085-CVT-031_M.jpg" },
      { name: "블랙", hex: "#1a1a1a", image: "/images/products/printstar-cvt/00085-CVT-005_M.jpg" },
      { name: "아이보리", hex: "#faf8f0", image: "/images/products/printstar-cvt/00085-CVT-073_M.jpg" },
      { name: "애쉬", hex: "#e1e4e6", image: "/images/products/printstar-cvt/00085-CVT-044_M.jpg" },
      { name: "실버 그레이", hex: "#b8b6b9", image: "/images/products/printstar-cvt/00085-CVT-153_M.jpg" },
      { name: "라이트 퍼플", hex: "#c3b2db", image: "/images/products/printstar-cvt/00085-CVT-188_M.jpg" },
      { name: "퍼플", hex: "#48339b", image: "/images/products/printstar-cvt/00085-CVT-014_M.jpg" },
      { name: "데님", hex: "#536881", image: "/images/products/printstar-cvt/00085-CVT-109_M.jpg" },
      { name: "차콜", hex: "#494b52", image: "/images/products/printstar-cvt/00085-CVT-129_M.jpg" },
      { name: "라이트 블루", hex: "#a2dbe7", image: "/images/products/printstar-cvt/00085-CVT-133_M.jpg" },
      { name: "터코이즈", hex: "#00a2cc", image: "/images/products/printstar-cvt/00085-CVT-034_M.jpg" },
      { name: "재팬 블루", hex: "#1b4aa6", image: "/images/products/printstar-cvt/00085-CVT-171_M.jpg" },
      { name: "로얄 블루", hex: "#054cb9", image: "/images/products/printstar-cvt/00085-CVT-032_M.jpg" },
      { name: "아이스 그린", hex: "#9be0cd", image: "/images/products/printstar-cvt/00085-CVT-195_M.jpg" },
      { name: "그린", hex: "#00874e", image: "/images/products/printstar-cvt/00085-CVT-025_M.jpg" },
      { name: "올리브", hex: "#565d38", image: "/images/products/printstar-cvt/00085-CVT-128_M.jpg" },
      { name: "라이트 핑크", hex: "#ffccd5", image: "/images/products/printstar-cvt/00085-CVT-132_M.jpg" },
      { name: "핑크", hex: "#ec839e", image: "/images/products/printstar-cvt/00085-CVT-011_M.jpg" },
      { name: "핫핑크", hex: "#e6006f", image: "/images/products/printstar-cvt/00085-CVT-146_M.jpg" },
      { name: "라이트 옐로우", hex: "#fff4ab", image: "/images/products/printstar-cvt/00085-CVT-134_M.jpg" },
      { name: "데이지", hex: "#ffcc00", image: "/images/products/printstar-cvt/00085-CVT-165_M.jpg" },
      { name: "오렌지", hex: "#ff5f00", image: "/images/products/printstar-cvt/00085-CVT-015_M.jpg" },
      { name: "버건디", hex: "#731630", image: "/images/products/printstar-cvt/00085-CVT-112_M.jpg" },
      { name: "인디고", hex: "#182a47", image: "/images/products/printstar-cvt/00085-CVT-097_M.jpg" },
      { name: "아미그린", hex: "#4a533c", image: "/images/products/printstar-cvt/00085-CVT-037_M.jpg" },
      { name: "라이트 베이지", hex: "#eddabf", image: "/images/products/printstar-cvt/00095-CVE-455_M.jpg" }
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"],
    sizeUpcharges: { "2XL": 1000, "3XL": 1500, "4XL": 2000 }
  },
  {
    id: "tshirt",
    name: "2000 오리지널 티셔츠",
    brand: "길단",
    category: "데일리 웨어",
    tagline: "부드럽고 톡톡한 20수 코마사 원단",
    description: "탄탄한 시보리와 이중 봉제로 늘어남을 방지하고, 고온 워싱 가공을 거쳐 세탁 후 줄어짐이나 비틀림이 없는 고품질 기본 면 티셔츠입니다. 단체복이나 데일리 웨어 모두에 완벽합니다.",
    basePrice: 18000,
    colors: [
      { name: "코발트 블루", hex: "#0052ff", image: "/images/tshirt.png" },
      { name: "화이트", hex: "#ffffff", image: "/images/tshirt.png" },
      { name: "블랙", hex: "#000000", image: "/images/tshirt.png" },
      { name: "차콜", hex: "#3f3f46", image: "/images/tshirt.png" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    sizeUpcharges: { "2XL": 2000, "3XL": 2000 }
  },
  {
    id: "hoodie",
    name: "9500 헤비웨이트 후드티",
    brand: "길단",
    category: "굿즈/라이프스타일",
    tagline: "묵직한 950g 기모 안감 후드티셔츠",
    description: "각 잡히는 탄탄한 모자와 묵직한 중량감의 헤비 쮸리 원단으로 제작되었습니다. 안감은 부드러운 기모 가공이 되어 보온성이 뛰어나며, 고퀄리티 자수 및 인쇄 작업에 최적화되어 있습니다.",
    basePrice: 39000,
    colors: [
      { name: "코발트 블루", hex: "#0052ff", image: "/images/hoodie.png" },
      { name: "화이트", hex: "#ffffff", image: "/images/hoodie.png" },
      { name: "블랙", hex: "#000000", image: "/images/hoodie.png" },
      { name: "차콜", hex: "#3f3f46", image: "/images/hoodie.png" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    sizeUpcharges: { "2XL": 2500, "3XL": 3000 }
  },
  {
    id: "sweatshirt",
    name: "S700 리버스위브 맨투맨",
    brand: "챔피온",
    category: "데일리 웨어",
    tagline: "클래식한 짜임새의 고중량 스웨트셔츠",
    description: "측면 패널 수축을 방지하는 특허받은 리버스 위브 직조 기술로 제작된 헤비웨이트 맨투맨입니다. 왼쪽 손목에 정품 로고 패치가 들어가 있으며 세련된 단체 아우터로 최적입니다.",
    basePrice: 45000,
    colors: [
      { name: "그레이", hex: "#d1d5db", image: "/images/hoodie.png" },
      { name: "블랙", hex: "#000000", image: "/images/hoodie.png" },
      { name: "네이비", hex: "#1e3a8a", image: "/images/hoodie.png" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    sizeUpcharges: { "2XL": 2000 }
  },
  {
    id: "aaa-tshirt",
    name: "1301 클래식 무지 티셔츠",
    brand: "트리플에이",
    category: "데일리 웨어",
    tagline: "스트릿 패션의 교과서, 6온스 헤비코튼",
    description: "특유의 거칠고 탄탄한 질감으로 스트릿 매니아층의 사랑을 받아온 오리지널 AAA 1301 제품입니다. 넥라인이 쉽게 늘어나지 않으며 박시한 핏이 연출됩니다.",
    basePrice: 15000,
    colors: [
      { name: "화이트", hex: "#ffffff", image: "/images/tshirt.png" },
      { name: "블랙", hex: "#000000", image: "/images/tshirt.png" },
      { name: "차콜", hex: "#3f3f46", image: "/images/tshirt.png" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    sizeUpcharges: { "2XL": 2000, "3XL": 2000 }
  },
  {
    id: "cap",
    name: "HQ-01 레트로 핏 코튼 볼캡",
    brand: "하이퍼콰이엇",
    category: "굿즈/라이프스타일",
    tagline: "빈티지 워싱 마감의 프리미엄 야구모자",
    description: "어디에나 매칭하기 좋은 6패널 빈티지 볼캡입니다. 황동 조절 버클이 장착되어 사이즈 조절이 용이하며, 전면 자수 인쇄 시 뛰어난 입체감을 선사합니다.",
    basePrice: 22000,
    colors: [
      { name: "블랙", hex: "#000000", image: "/images/tshirt.png" },
      { name: "베이지", hex: "#f5f5dc", image: "/images/tshirt.png" },
      { name: "그린", hex: "#15803d", image: "/images/tshirt.png" }
    ],
    sizes: ["FREE"]
  },
  {
    id: "ecobag",
    name: "HQ-02 캔버스 데일리 에코백",
    brand: "하이퍼콰이엇",
    category: "굿즈/라이프스타일",
    tagline: "튼튼한 10수 캔버스 도톰 에코백",
    description: "바닥 폭이 깊어 넉넉한 수납공간을 자랑하며 도톰한 캔버스 원단으로 쳐짐이 덜합니다. 가방 내부 포켓이 있어 수납이 용이하고 브랜드 굿즈 및 사은품 제작용으로 인기가 높습니다.",
    basePrice: 12000,
    colors: [
      { name: "아이보리", hex: "#fafaf9", image: "/images/tshirt.png" },
      { name: "블랙", hex: "#000000", image: "/images/tshirt.png" }
    ],
    sizes: ["FREE"]
  }
];
