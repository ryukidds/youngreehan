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
    id: "00083-bbt",
    name: "00083-BBT 라이트 라운드 티셔츠 (면32수)",
    brand: "프린트스타",
    category: "데일리 웨어",
    tagline: "가볍고 시원한 착용감의 4.0온스 라이트 티셔츠",
    description: "32수 편면 조직(135g/㎡)으로 가볍게 짜여 한여름 이너나 대량 단체복 제작으로 적합합니다.",
    basePrice: 7600,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00083-bbt/00083-BBT-001_M.jpg"
        },
        {
              "name": "모쿠 그레이",
              "hex": "#c6c8c9",
              "image": "/images/products/00083-bbt/00083-BBT-003_M.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00083-bbt/00083-BBT-005_M.jpg"
        },
        {
              "name": "퍼플",
              "hex": "#48339b",
              "image": "/images/products/00083-bbt/00083-BBT-014_M.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00083-bbt/00083-BBT-031_M.jpg"
        },
        {
              "name": "로얄 블루",
              "hex": "#054cb9",
              "image": "/images/products/00083-bbt/00083-BBT-032_M.jpg"
        },
        {
              "name": "버건디",
              "hex": "#731630",
              "image": "/images/products/00083-bbt/00083-BBT-112_M.jpg"
        },
        {
              "name": "라이트 블루",
              "hex": "#a2dbe7",
              "image": "/images/products/00083-bbt/00083-BBT-133_M.jpg"
        }
  ],
    sizes: ["150", "160", "S", "M", "L", "XL", "2XL"],
    sizeUpcharges: {"2XL": 1000}
  },
  {
    id: "00085-cvt",
    name: "00085-CVT 베이직 라운드 티셔츠 (면17수)",
    brand: "프린트스타",
    category: "데일리 웨어",
    tagline: "누적 판매 1위, 전 세계 표준 베이직 티셔츠",
    description: "5.6온스(190g/㎡)의 도톰하고 탄탄한 17수 면 원단으로 비침이 없어 단체복 및 굿즈 제작용 부동의 1위입니다.",
    basePrice: 9400,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00085-cvt/00085-CVT-001_M.jpg"
        },
        {
              "name": "모쿠 그레이",
              "hex": "#c6c8c9",
              "image": "/images/products/00085-cvt/00085-CVT-003_M.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00085-cvt/00085-CVT-005_M.jpg"
        },
        {
              "name": "레드",
              "hex": "#e6193c",
              "image": "/images/products/00085-cvt/00085-CVT-010_M.jpg"
        },
        {
              "name": "핑크",
              "hex": "#f472b6",
              "image": "/images/products/00085-cvt/00085-CVT-011_M.jpg"
        },
        {
              "name": "퍼플",
              "hex": "#48339b",
              "image": "/images/products/00085-cvt/00085-CVT-014_M.jpg"
        },
        {
              "name": "오렌지",
              "hex": "#ff5f00",
              "image": "/images/products/00085-cvt/00085-CVT-015_M.jpg"
        },
        {
              "name": "그린",
              "hex": "#00874e",
              "image": "/images/products/00085-cvt/00085-CVT-025_M.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00085-cvt/00085-CVT-031_M.jpg"
        },
        {
              "name": "로얄 블루",
              "hex": "#054cb9",
              "image": "/images/products/00085-cvt/00085-CVT-032_M.jpg"
        },
        {
              "name": "터코이즈",
              "hex": "#00a2cc",
              "image": "/images/products/00085-cvt/00085-CVT-034_M.jpg"
        },
        {
              "name": "아미그린",
              "hex": "#4a533c",
              "image": "/images/products/00085-cvt/00085-CVT-037_M.jpg"
        },
        {
              "name": "오트밀",
              "hex": "#e2dbcd",
              "image": "/images/products/00085-cvt/00085-CVT-039_M.jpg"
        },
        {
              "name": "애쉬",
              "hex": "#e1e4e6",
              "image": "/images/products/00085-cvt/00085-CVT-044_M.jpg"
        },
        {
              "name": "아이보리",
              "hex": "#faf8f0",
              "image": "/images/products/00085-cvt/00085-CVT-073_M.jpg"
        },
        {
              "name": "인디고",
              "hex": "#182a47",
              "image": "/images/products/00085-cvt/00085-CVT-097_M.jpg"
        },
        {
              "name": "데님",
              "hex": "#536881",
              "image": "/images/products/00085-cvt/00085-CVT-109_M.jpg"
        },
        {
              "name": "버건디",
              "hex": "#731630",
              "image": "/images/products/00085-cvt/00085-CVT-112_M.jpg"
        },
        {
              "name": "올리브",
              "hex": "#565d38",
              "image": "/images/products/00085-cvt/00085-CVT-128_M.jpg"
        },
        {
              "name": "차콜",
              "hex": "#494b52",
              "image": "/images/products/00085-cvt/00085-CVT-129_M.jpg"
        },
        {
              "name": "라이트 핑크",
              "hex": "#ffccd5",
              "image": "/images/products/00085-cvt/00085-CVT-132_M.jpg"
        },
        {
              "name": "라이트 블루",
              "hex": "#a2dbe7",
              "image": "/images/products/00085-cvt/00085-CVT-133_M.jpg"
        },
        {
              "name": "라이트 옐로우",
              "hex": "#fff4ab",
              "image": "/images/products/00085-cvt/00085-CVT-134_M.jpg"
        },
        {
              "name": "핫핑크",
              "hex": "#e6006f",
              "image": "/images/products/00085-cvt/00085-CVT-146_M.jpg"
        },
        {
              "name": "실버 그레이",
              "hex": "#b8b6b9",
              "image": "/images/products/00085-cvt/00085-CVT-153_M.jpg"
        },
        {
              "name": "데이지",
              "hex": "#ffcc00",
              "image": "/images/products/00085-cvt/00085-CVT-165_M.jpg"
        },
        {
              "name": "재팬 블루",
              "hex": "#1b4aa6",
              "image": "/images/products/00085-cvt/00085-CVT-171_M.jpg"
        },
        {
              "name": "라이트 퍼플",
              "hex": "#c3b2db",
              "image": "/images/products/00085-cvt/00085-CVT-188_M.jpg"
        },
        {
              "name": "아이스 그린",
              "hex": "#9be0cd",
              "image": "/images/products/00085-cvt/00085-CVT-195_M.jpg"
        },
        {
              "name": "틸그린",
              "hex": "#134e4d",
              "image": "/images/products/00085-cvt/00085-CVT-206_M.jpg"
        },
        {
              "name": "코코아브라운",
              "hex": "#5a4540",
              "image": "/images/products/00085-cvt/00085-CVT-207_M.jpg"
        },
        {
              "name": "스모크옐로우",
              "hex": "#d2b786",
              "image": "/images/products/00085-cvt/00085-CVT-213_M.jpg"
        },
        {
              "name": "라이트세이지",
              "hex": "#9cb8a7",
              "image": "/images/products/00085-cvt/00085-CVT-423_M.jpg"
        },
        {
              "name": "모스그레이",
              "hex": "#859897",
              "image": "/images/products/00085-cvt/00085-CVT-424_M.jpg"
        },
        {
              "name": "애시드블루",
              "hex": "#98adc2",
              "image": "/images/products/00085-cvt/00085-CVT-426_M.jpg"
        }
  ],
    sizes: ["110", "120", "130", "140", "150", "160", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"],
    sizeUpcharges: {"2XL": 1000, "3XL": 1500, "4XL": 2000}
  },
  {
    id: "00086-dmt",
    name: "00086-DMT 스탠다드 라운드 티셔츠 (면20수)",
    brand: "프린트스타",
    category: "데일리 웨어",
    tagline: "알맞게 슬림하며 적당한 두께의 20수 면 티셔츠",
    description: "적당한 두께감(170g/㎡)의 20수 원사를 사용하여 입었을 때 바디 실루엣이 세련되고 편안합니다.",
    basePrice: 8400,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00086-dmt/00086-DMT-001_M.jpg"
        },
        {
              "name": "모쿠 그레이",
              "hex": "#c6c8c9",
              "image": "/images/products/00086-dmt/00086-DMT-003_M.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00086-dmt/00086-DMT-005_M.jpg"
        },
        {
              "name": "레드",
              "hex": "#e6193c",
              "image": "/images/products/00086-dmt/00086-DMT-010_M.jpg"
        },
        {
              "name": "퍼플",
              "hex": "#48339b",
              "image": "/images/products/00086-dmt/00086-DMT-014_M.jpg"
        },
        {
              "name": "오렌지",
              "hex": "#ff5f00",
              "image": "/images/products/00086-dmt/00086-DMT-015_M.jpg"
        },
        {
              "name": "옐로우",
              "hex": "#facc15",
              "image": "/images/products/00086-dmt/00086-DMT-020_M.jpg"
        },
        {
              "name": "라이트 그린",
              "hex": "#86efac",
              "image": "/images/products/00086-dmt/00086-DMT-024_M.jpg"
        },
        {
              "name": "민트 그린",
              "hex": "#a7f3d0",
              "image": "/images/products/00086-dmt/00086-DMT-026_M.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00086-dmt/00086-DMT-031_M.jpg"
        },
        {
              "name": "로얄 블루",
              "hex": "#054cb9",
              "image": "/images/products/00086-dmt/00086-DMT-032_M.jpg"
        },
        {
              "name": "터코이즈",
              "hex": "#00a2cc",
              "image": "/images/products/00086-dmt/00086-DMT-034_M.jpg"
        },
        {
              "name": "아미그린",
              "hex": "#4a533c",
              "image": "/images/products/00086-dmt/00086-DMT-037_M.jpg"
        },
        {
              "name": "오트밀",
              "hex": "#e2dbcd",
              "image": "/images/products/00086-dmt/00086-DMT-039_M.jpg"
        },
        {
              "name": "버건디",
              "hex": "#731630",
              "image": "/images/products/00086-dmt/00086-DMT-112_M.jpg"
        },
        {
              "name": "차콜",
              "hex": "#494b52",
              "image": "/images/products/00086-dmt/00086-DMT-129_M.jpg"
        },
        {
              "name": "라이트 핑크",
              "hex": "#ffccd5",
              "image": "/images/products/00086-dmt/00086-DMT-132_M.jpg"
        },
        {
              "name": "라이트 블루",
              "hex": "#a2dbe7",
              "image": "/images/products/00086-dmt/00086-DMT-133_M.jpg"
        }
  ],
    sizes: ["100", "110", "120", "130", "140", "150", "160", "S", "M", "L", "XL", "2XL", "3XL"],
    sizeUpcharges: {"2XL": 1000, "3XL": 1500}
  },
  {
    id: "00087-oet",
    name: "00087-OET 하이 그레이드 리브 바인딩 티셔츠 (OE면사 16수)",
    brand: "프린트스타",
    category: "데일리 웨어",
    tagline: "아메리칸 감성의 터프한 오픈엔드 원사 바인딩 넥 티셔츠",
    description: "오픈엔드(OE)사로 짜여 드라이하고 거친 텍스처를 선사하며 넥 라인을 이중 바인딩 마감하여 변형을 막아줍니다.",
    basePrice: 10200,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00087-oet/00087-OET-001_L.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00087-oet/00087-OET-005_L.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00087-oet/00087-OET-031_L.jpg"
        },
        {
              "name": "아미그린",
              "hex": "#4a533c",
              "image": "/images/products/00087-oet/00087-OET-037_L.jpg"
        },
        {
              "name": "아이보리",
              "hex": "#faf8f0",
              "image": "/images/products/00087-oet/00087-OET-073_L.jpg"
        },
        {
              "name": "차콜",
              "hex": "#494b52",
              "image": "/images/products/00087-oet/00087-OET-129_L.jpg"
        },
        {
              "name": "메트로블루",
              "hex": "#1e40af",
              "image": "/images/products/00087-oet/00087-OET-167_L.jpg"
        },
        {
              "name": "코코아브라운",
              "hex": "#5a4540",
              "image": "/images/products/00087-oet/00087-OET-207_L.jpg"
        },
        {
              "name": "스모크옐로우",
              "hex": "#d2b786",
              "image": "/images/products/00087-oet/00087-OET-213_L.jpg"
        },
        {
              "name": "스모크블랙",
              "hex": "#262626",
              "image": "/images/products/00087-oet/00087-OET-223_L.jpg"
        },
        {
              "name": "모스그레이",
              "hex": "#859897",
              "image": "/images/products/00087-oet/00087-OET-424_L.jpg"
        },
        {
              "name": "애시드블루",
              "hex": "#98adc2",
              "image": "/images/products/00087-oet/00087-OET-426_L.jpg"
        },
        {
              "name": "라이트 베이지",
              "hex": "#eddabf",
              "image": "/images/products/00087-oet/00087-OET-455_L.jpg"
        }
  ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    sizeUpcharges: {"2XL": 1000, "3XL": 1500}
  },
  {
    id: "00095-cve",
    name: "00095-CVE 베이직 라운드 티셔츠 (면17수, 트렌디 컬러)",
    brand: "프린트스타",
    category: "데일리 웨어",
    tagline: "00085-CVT 면사 사양에 최신 감성 컬러를 가미한 스페셜 컬렉션",
    description: "프린트스타 대표작 00085-CVT와 동일한 원단감에 트렌디한 시즌 한정 색상을 특별 제공합니다.",
    basePrice: 9400,
    colors: [
        {
              "name": "시멘트",
              "hex": "#a1a1aa",
              "image": "/images/products/00095-cve/00095-CVE-151_M.jpg"
        },
        {
              "name": "코요테",
              "hex": "#a16207",
              "image": "/images/products/00095-cve/00095-CVE-236_M.jpg"
        },
        {
              "name": "샌드카키",
              "hex": "#78716c",
              "image": "/images/products/00095-cve/00095-CVE-454_M.jpg"
        }
  ],
    sizes: ["160", "XS", "S", "M", "L", "XL", "2XL", "3XL"],
    sizeUpcharges: {"2XL": 1000, "3XL": 1500}
  },
  {
    id: "00102-cvl",
    name: "00102-CVL 베이직 라운드 긴팔 티셔츠 (면17수)",
    brand: "프린트스타",
    category: "데일리 웨어",
    tagline: "탄탄한 17수 베이직 라운드 티셔츠의 오리지널 긴팔 버전",
    description: "5.6온스 면 100% 원단으로 제작되어 비침이 없고 사계절 내내 코디하기 유용한 기본 라운드 긴팔 티셔츠입니다.",
    basePrice: 13000,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00102-cvl/00102-CVL-001_M.jpg"
        },
        {
              "name": "모쿠 그레이",
              "hex": "#c6c8c9",
              "image": "/images/products/00102-cvl/00102-CVL-003_M.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00102-cvl/00102-CVL-005_M.jpg"
        },
        {
              "name": "레드",
              "hex": "#e6193c",
              "image": "/images/products/00102-cvl/00102-CVL-010_M.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00102-cvl/00102-CVL-031_M.jpg"
        },
        {
              "name": "로얄 블루",
              "hex": "#054cb9",
              "image": "/images/products/00102-cvl/00102-CVL-032_M.jpg"
        },
        {
              "name": "아미그린",
              "hex": "#4a533c",
              "image": "/images/products/00102-cvl/00102-CVL-037_M.jpg"
        },
        {
              "name": "버건디",
              "hex": "#731630",
              "image": "/images/products/00102-cvl/00102-CVL-112_M.jpg"
        }
  ],
    sizes: ["110", "130", "150", "XS", "S", "M", "L", "XL", "2XL", "3XL"],
    sizeUpcharges: {"2XL": 1500, "3XL": 2000}
  },
  {
    id: "00109-pct",
    name: "00109-PCT 베이직 라운드 포켓 티셔츠 (면17수)",
    brand: "프린트스타",
    category: "데일리 웨어",
    tagline: "왼가슴 유틸리티 포켓이 장착된 실용적인 데일리 티셔츠",
    description: "17수 평직 원단으로 제작되어 튼튼하며 왼쪽 가슴에 실용적인 크기의 포켓이 위치해 포인트 이너로 적합합니다.",
    basePrice: 10600,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00109-pct/00109-PCT-001.jpg"
        },
        {
              "name": "모쿠 그레이",
              "hex": "#c6c8c9",
              "image": "/images/products/00109-pct/00109-PCT-003_1.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00109-pct/00109-PCT-005.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00109-pct/00109-PCT-031.jpg"
        },
        {
              "name": "아미그린",
              "hex": "#4a533c",
              "image": "/images/products/00109-pct/00109-PCT-037.jpg"
        }
  ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    sizeUpcharges: {"2XL": 1000, "3XL": 1500}
  },
  {
    id: "00110-cll",
    name: "00110-CLL 베이직 라운드 시보리 긴팔 티셔츠 (면17수)",
    brand: "프린트스타",
    category: "데일리 웨어",
    tagline: "소매단 시보리(시보리) 마감으로 흘러내림을 방지한 긴팔 티셔츠",
    description: "손목 리브(시보리) 처리가 되어 있어 소매 걷어 올리기 편하며 형태 안정성이 뛰어난 17수 긴팔 티셔츠입니다.",
    basePrice: 14400,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00110-cll/00110-CLL-001_M.jpg"
        },
        {
              "name": "모쿠 그레이",
              "hex": "#c6c8c9",
              "image": "/images/products/00110-cll/00110-CLL-003_M.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00110-cll/00110-CLL-005_M.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00110-cll/00110-CLL-031_M.jpg"
        },
        {
              "name": "아이보리",
              "hex": "#faf8f0",
              "image": "/images/products/00110-cll/00110-CLL-073_M.jpg"
        }
  ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    sizeUpcharges: {"2XL": 1500, "3XL": 2000}
  },
  {
    id: "00113-bcv",
    name: "00113-BCV 오버핏 라운드 티셔츠 (면17수)",
    brand: "프린트스타",
    category: "데일리 웨어",
    tagline: "넓은 어깨폭과 짧은 기장으로 스타일리시한 와이드 루즈핏 티셔츠",
    description: "어깨 라인이 넉넉히 떨어지는 루즈핏 실루엣으로 요즘 스트릿 코디 및 크롭 스타일링에 완벽하게 어울립니다.",
    basePrice: 11400,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00113-bcv/00113-BCV-001_M.jpg"
        },
        {
              "name": "모쿠 그레이",
              "hex": "#c6c8c9",
              "image": "/images/products/00113-bcv/00113-BCV-003_L.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00113-bcv/00113-BCV-005_M.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00113-bcv/00113-BCV-031_M.jpg"
        },
        {
              "name": "카멜",
              "hex": "#b45309",
              "image": "/images/products/00113-bcv/00113-BCV-154_M.jpg"
        },
        {
              "name": "더스티 핑크",
              "hex": "#f472b6",
              "image": "/images/products/00113-bcv/00113-BCV-400_M.jpg"
        },
        {
              "name": "다크 브라운",
              "hex": "#3b2314",
              "image": "/images/products/00113-bcv/00113-BCV-453_M.jpg"
        },
        {
              "name": "더스티 블루",
              "hex": "#60a5fa",
              "image": "/images/products/00113-bcv/00113-BCV-463_M.jpg"
        }
  ],
    sizes: ["S", "M", "L", "XL"],
    sizeUpcharges: {}
  },
  {
    id: "00141-nvp",
    name: "00141-NVP 드라이 포켓 폴로셔츠 (T/C)",
    brand: "프린트스타",
    category: "데일리 웨어",
    tagline: "드라이 흡습 속건 기능이 접목된 가슴 포켓 포멀 폴로 셔츠",
    description: "면과 폴리에스터의 혼방으로 편안한 착용감과 쾌적한 땀 흡수 기능을 동시에 겸비하여 쿨비즈 단체복으로 안성맞춤입니다.",
    basePrice: 12000,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00141-nvp/00141-NVP-001_L.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00141-nvp/00141-NVP-005_L.jpg"
        },
        {
              "name": "오렌지",
              "hex": "#ff5f00",
              "image": "/images/products/00141-nvp/00141-NVP-015_L.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00141-nvp/00141-NVP-031_L.jpg"
        },
        {
              "name": "로얄 블루",
              "hex": "#054cb9",
              "image": "/images/products/00141-nvp/00141-NVP-032_L.jpg"
        }
  ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
    sizeUpcharges: {"2XL": 1500, "3XL": 2000, "4XL": 2500, "5XL": 3000}
  },
  {
    id: "00148-hvt",
    name: "00148-HVT 헤비 라운드 티셔츠 (면14수)",
    brand: "프린트스타",
    category: "데일리 웨어",
    tagline: "7.4온스의 압도적인 중량감, 프린트스타 최상위 헤비웨이트 면티",
    description: "가장 두꺼운 14수 오리지널 카드사를 활용해 비침 우려가 전혀 없으며 오래 세탁해도 변형이 거의 없는 프리미엄 티셔츠입니다.",
    basePrice: 12800,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00148-hvt/00148-HVT-001_M.jpg"
        },
        {
              "name": "모쿠 그레이",
              "hex": "#c6c8c9",
              "image": "/images/products/00148-hvt/00148-HVT-003_M.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00148-hvt/00148-HVT-005_M.jpg"
        },
        {
              "name": "레드",
              "hex": "#e6193c",
              "image": "/images/products/00148-hvt/00148-HVT-010_M.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00148-hvt/00148-HVT-031_M.jpg"
        },
        {
              "name": "로얄 블루",
              "hex": "#054cb9",
              "image": "/images/products/00148-hvt/00148-HVT-032_M.jpg"
        },
        {
              "name": "아미그린",
              "hex": "#4a533c",
              "image": "/images/products/00148-hvt/00148-HVT-037_M.jpg"
        },
        {
              "name": "아이보리",
              "hex": "#faf8f0",
              "image": "/images/products/00148-hvt/00148-HVT-073_M.jpg"
        },
        {
              "name": "버건디",
              "hex": "#731630",
              "image": "/images/products/00148-hvt/00148-HVT-112_M.jpg"
        },
        {
              "name": "라이트 핑크",
              "hex": "#ffccd5",
              "image": "/images/products/00148-hvt/00148-HVT-132_M.jpg"
        },
        {
              "name": "라이트 블루",
              "hex": "#a2dbe7",
              "image": "/images/products/00148-hvt/00148-HVT-133_M.jpg"
        },
        {
              "name": "사파리",
              "hex": "#b45309",
              "image": "/images/products/00148-hvt/00148-HVT-136_M.jpg"
        },
        {
              "name": "아이비그린",
              "hex": "#064e3b",
              "image": "/images/products/00148-hvt/00148-HVT-138_M.jpg"
        },
        {
              "name": "더스티 핑크",
              "hex": "#f472b6",
              "image": "/images/products/00148-hvt/00148-HVT-400_M.jpg"
        },
        {
              "name": "라이트세이지",
              "hex": "#9cb8a7",
              "image": "/images/products/00148-hvt/00148-HVT-423_M.jpg"
        },
        {
              "name": "다크 브라운",
              "hex": "#3b2314",
              "image": "/images/products/00148-hvt/00148-HVT-453_M.jpg"
        },
        {
              "name": "라이트 베이지",
              "hex": "#eddabf",
              "image": "/images/products/00148-hvt/00148-HVT-455_M.jpg"
        },
        {
              "name": "더스티 블루",
              "hex": "#60a5fa",
              "image": "/images/products/00148-hvt/00148-HVT-463_M.jpg"
        }
  ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    sizeUpcharges: {"2XL": 1500, "3XL": 2000}
  },
  {
    id: "00149-hvl",
    name: "00149-HVL 헤비 라운드 시보리 긴팔 티셔츠 (면14수)",
    brand: "프린트스타",
    category: "데일리 웨어",
    tagline: "7.4온스의 초고밀도 원단과 시보리 마감 프리미엄 긴팔 티셔츠",
    description: "최상급 14수 코튼사로 묵직한 중량감을 느낄 수 있으며 손목 리브 마감으로 완성도를 높인 프리미엄 라운드 롱슬리브입니다.",
    basePrice: 16800,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00149-hvl/00149-HVL-001_M.jpg"
        },
        {
              "name": "모쿠 그레이",
              "hex": "#c6c8c9",
              "image": "/images/products/00149-hvl/00149-HVL-003_M.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00149-hvl/00149-HVL-005_M.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00149-hvl/00149-HVL-031_M.jpg"
        },
        {
              "name": "라이트 핑크",
              "hex": "#ffccd5",
              "image": "/images/products/00149-hvl/00149-HVL-132_M.jpg"
        }
  ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    sizeUpcharges: {"2XL": 2000, "3XL": 2500}
  },
  {
    id: "00183-nsc",
    name: "00183-NSC 헤비웨이트 맨투맨 (9.7oz)",
    brand: "프린트스타",
    category: "데일리 웨어",
    tagline: "9.7온스 기모 안감의 탄탄한 스탠다드 핏 크루넥 스웨트셔츠",
    description: "도톰한 기모 짜임 구조로 방한성과 부드러운 촉감을 강조한 데일리 크루넥 맨투맨입니다.",
    basePrice: 24800,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00183-nsc/00183-NSC-001_L.jpg"
        },
        {
              "name": "모쿠 그레이",
              "hex": "#c6c8c9",
              "image": "/images/products/00183-nsc/00183-NSC-003_L.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00183-nsc/00183-NSC-005_L.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00183-nsc/00183-NSC-031_L.jpg"
        },
        {
              "name": "로얄 블루",
              "hex": "#054cb9",
              "image": "/images/products/00183-nsc/00183-NSC-032_L.jpg"
        },
        {
              "name": "오트밀",
              "hex": "#e2dbcd",
              "image": "/images/products/00183-nsc/00183-NSC-039_L.jpg"
        },
        {
              "name": "버건디",
              "hex": "#731630",
              "image": "/images/products/00183-nsc/00183-NSC-112_L.jpg"
        }
  ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"],
    sizeUpcharges: {"2XL": 2000, "3XL": 3000, "4XL": 4000}
  },
  {
    id: "00188-nnh",
    name: "00188-NNH 헤비웨이트 풀오버 후드티 (9.7oz)",
    brand: "프린트스타",
    category: "굿즈/라이프스타일",
    tagline: "9.7온스 고밀도 기모 원단의 오리지널 풀오버 후드티",
    description: "바디 전체를 따뜻하게 감싸주는 헤비웨이트 스웨트 원단과 이중 후드로 각이 잡히는 오리지널 후디입니다.",
    basePrice: 36800,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00188-nnh/00188-NNH-001_L.jpg"
        },
        {
              "name": "모쿠 그레이",
              "hex": "#c6c8c9",
              "image": "/images/products/00188-nnh/00188-NNH-003_L.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00188-nnh/00188-NNH-005_L.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00188-nnh/00188-NNH-031_L.jpg"
        },
        {
              "name": "로얄 블루",
              "hex": "#054cb9",
              "image": "/images/products/00188-nnh/00188-NNH-032_L.jpg"
        },
        {
              "name": "오트밀",
              "hex": "#e2dbcd",
              "image": "/images/products/00188-nnh/00188-NNH-039_L.jpg"
        },
        {
              "name": "버건디",
              "hex": "#731630",
              "image": "/images/products/00188-nnh/00188-NNH-112_L.jpg"
        }
  ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"],
    sizeUpcharges: {"2XL": 2500, "3XL": 3500, "4XL": 4500}
  },
  {
    id: "00189-nnz",
    name: "00189-NNZ 헤비웨이트 집업 후드티 (9.7oz)",
    brand: "프린트스타",
    category: "굿즈/라이프스타일",
    tagline: "아우터로 활용성 극대화, 9.7온스 기모 집업 후드",
    description: "견고한 전면 메탈 지퍼 슬라이더와 양측 핸드 워머 포켓이 접목되어 레이어드 자켓으로 활용도가 높습니다.",
    basePrice: 41800,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00189-nnz/00189-NNZ-001_L.jpg"
        },
        {
              "name": "모쿠 그레이",
              "hex": "#c6c8c9",
              "image": "/images/products/00189-nnz/00189-NNZ-003_L.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00189-nnz/00189-NNZ-005_L.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00189-nnz/00189-NNZ-031_L.jpg"
        },
        {
              "name": "로얄 블루",
              "hex": "#054cb9",
              "image": "/images/products/00189-nnz/00189-NNZ-032_L.jpg"
        },
        {
              "name": "오트밀",
              "hex": "#e2dbcd",
              "image": "/images/products/00189-nnz/00189-NNZ-039_L.jpg"
        },
        {
              "name": "버건디",
              "hex": "#731630",
              "image": "/images/products/00189-nnz/00189-NNZ-112_L.jpg"
        }
  ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"],
    sizeUpcharges: {"2XL": 2500, "3XL": 3500, "4XL": 4500}
  },
  {
    id: "00207-nah",
    name: "00207-NAH 스탠다드 후드 윈드브레이커",
    brand: "프린트스타",
    category: "굿즈/라이프스타일",
    tagline: "생활 방수와 바람막이 기능의 캐주얼 아우터 후드 자켓",
    description: "내구성 높은 나일론/폴리 태피터 소재로 찬바람을 완벽히 차단하고 가벼운 빗방울을 튕겨내는 아웃도어 쉘입니다.",
    basePrice: 29800,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00207-nah/00207-NAH-001_L.jpg"
        },
        {
              "name": "그레이",
              "hex": "#9ca3af",
              "image": "/images/products/00207-nah/00207-NAH-002_L.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00207-nah/00207-NAH-005_L.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00207-nah/00207-NAH-031_L.jpg"
        },
        {
              "name": "아미그린",
              "hex": "#4a533c",
              "image": "/images/products/00207-nah/00207-NAH-037_L.jpg"
        },
        {
              "name": "애시드블루",
              "hex": "#98adc2",
              "image": "/images/products/00207-nah/00207-NAH-426_L.jpg"
        },
        {
              "name": "라이트 베이지",
              "hex": "#eddabf",
              "image": "/images/products/00207-nah/00207-NAH-455_L.jpg"
        }
  ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    sizeUpcharges: {"2XL": 2000}
  },
  {
    id: "00208-naz",
    name: "00208-NAZ 스탠다드 집업 스탠드 카라 자켓",
    brand: "프린트스타",
    category: "굿즈/라이프스타일",
    tagline: "단정하고 활동성이 용이한 집업 바람막이",
    description: "하이넥 구조의 스탠드 카라로 체온 유지가 쉬우며 트레이닝 및 작업용 유니폼으로 활용하기 편리합니다.",
    basePrice: 32800,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00208-naz/00208-NAZ-001_L.jpg"
        },
        {
              "name": "그레이",
              "hex": "#9ca3af",
              "image": "/images/products/00208-naz/00208-NAZ-002_L.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00208-naz/00208-NAZ-005_L.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00208-naz/00208-NAZ-031_L.jpg"
        },
        {
              "name": "아미그린",
              "hex": "#4a533c",
              "image": "/images/products/00208-naz/00208-NAZ-037_L.jpg"
        },
        {
              "name": "애시드블루",
              "hex": "#98adc2",
              "image": "/images/products/00208-naz/00208-NAZ-426_L.jpg"
        },
        {
              "name": "라이트 베이지",
              "hex": "#eddabf",
              "image": "/images/products/00208-naz/00208-NAZ-455_L.jpg"
        }
  ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    sizeUpcharges: {"2XL": 2000}
  },
  {
    id: "00210-nac",
    name: "00210-NAC 스탠다드 윈드브레이커 코치 자켓",
    brand: "프린트스타",
    category: "굿즈/라이프스타일",
    tagline: "레트로 스트릿 룩의 대명사, 밑단 조절형 코치 자켓",
    description: "소매 리브 처리와 밑단 드로코드가 설계되어 다채로운 연출이 가능하며 힙한 자수 프린팅 마킹에 제격입니다.",
    basePrice: 34800,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00210-nac/00210-NAC-001_L.jpg"
        },
        {
              "name": "그레이",
              "hex": "#9ca3af",
              "image": "/images/products/00210-nac/00210-NAC-002_L.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00210-nac/00210-NAC-005_L.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00210-nac/00210-NAC-031_L.jpg"
        },
        {
              "name": "아미그린",
              "hex": "#4a533c",
              "image": "/images/products/00210-nac/00210-NAC-037_L.jpg"
        },
        {
              "name": "애시드블루",
              "hex": "#98adc2",
              "image": "/images/products/00210-nac/00210-NAC-426_L.jpg"
        },
        {
              "name": "라이트 베이지",
              "hex": "#eddabf",
              "image": "/images/products/00210-nac/00210-NAC-455_L.jpg"
        }
  ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    sizeUpcharges: {"2XL": 2000}
  },
  {
    id: "00216-mlh",
    name: "00216-MLH 라이트 풀오버 후드티 (8.4oz)",
    brand: "프린트스타",
    category: "굿즈/라이프스타일",
    tagline: "8.4온스의 가볍고 활동하기 편리한 사계절 풀오버 후디",
    description: "얇지만 탄탄한 타올 쮸리 원단(기모 없음)으로 가을/겨울뿐 아니라 봄철 아우터 이너로도 편안합니다.",
    basePrice: 26800,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00216-mlh/00216-MLH-001_L.jpg"
        },
        {
              "name": "모쿠 그레이",
              "hex": "#c6c8c9",
              "image": "/images/products/00216-mlh/00216-MLH-003_L.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00216-mlh/00216-MLH-005_L.jpg"
        },
        {
              "name": "블루",
              "hex": "#3b82f6",
              "image": "/images/products/00216-mlh/00216-MLH-030_L.jpg"
        },
        {
              "name": "오트밀",
              "hex": "#e2dbcd",
              "image": "/images/products/00216-mlh/00216-MLH-039_L.jpg"
        },
        {
              "name": "버건디",
              "hex": "#731630",
              "image": "/images/products/00216-mlh/00216-MLH-112_L.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00216-mlh/00216-MLH-174_L.jpg"
        }
  ],
    sizes: ["110", "130", "150", "WM", "S", "M", "L", "XL", "2XL", "3XL"],
    sizeUpcharges: {"2XL": 2000, "3XL": 3000}
  },
  {
    id: "00217-mlz",
    name: "00217-MLZ 라이트 집업 후드티 (8.4oz)",
    brand: "프린트스타",
    category: "굿즈/라이프스타일",
    tagline: "간편한 탈착이 매력적인 8.4온스 슬림 핏 집업 후디",
    description: "스포티하고 단정한 핏의 실루엣으로 데일리 가볍게 아우터 레이어링 자켓으로 걸쳐 입기 최적입니다.",
    basePrice: 31800,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00217-mlz/00217-MLZ-001_L.jpg"
        },
        {
              "name": "모쿠 그레이",
              "hex": "#c6c8c9",
              "image": "/images/products/00217-mlz/00217-MLZ-003_L.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00217-mlz/00217-MLZ-005_L.jpg"
        },
        {
              "name": "블루",
              "hex": "#3b82f6",
              "image": "/images/products/00217-mlz/00217-MLZ-030_L.jpg"
        },
        {
              "name": "오트밀",
              "hex": "#e2dbcd",
              "image": "/images/products/00217-mlz/00217-MLZ-039_L.jpg"
        },
        {
              "name": "버건디",
              "hex": "#731630",
              "image": "/images/products/00217-mlz/00217-MLZ-112_L.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00217-mlz/00217-MLZ-174_L.jpg"
        }
  ],
    sizes: ["110", "130", "150", "WM", "S", "M", "L", "XL", "2XL", "3XL"],
    sizeUpcharges: {"2XL": 2000, "3XL": 3000}
  },
  {
    id: "00218-mlp",
    name: "00218-MLP 라이트 스웨트 조거 팬츠 (8.4oz)",
    brand: "프린트스타",
    category: "데일리 웨어",
    tagline: "발목을 감싸주어 단정한 8.4온스 스웨트 조거 팬츠",
    description: "허리 고무줄 스트링과 탄력 있는 발목 시보리로 스포티함과 홈웨어를 넘나드는 편리한 착용감을 줍니다.",
    basePrice: 21800,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00218-mlp/00218-MLP-001_L.jpg"
        },
        {
              "name": "모쿠 그레이",
              "hex": "#c6c8c9",
              "image": "/images/products/00218-mlp/00218-MLP-003_L.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00218-mlp/00218-MLP-005_L.jpg"
        },
        {
              "name": "블루",
              "hex": "#3b82f6",
              "image": "/images/products/00218-mlp/00218-MLP-030_L.jpg"
        },
        {
              "name": "오트밀",
              "hex": "#e2dbcd",
              "image": "/images/products/00218-mlp/00218-MLP-039_L.jpg"
        },
        {
              "name": "버건디",
              "hex": "#731630",
              "image": "/images/products/00218-mlp/00218-MLP-112_L.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00218-mlp/00218-MLP-174_L.jpg"
        }
  ],
    sizes: ["110", "130", "150", "WM", "S", "M", "L", "XL", "2XL"],
    sizeUpcharges: {"2XL": 2000}
  },
  {
    id: "00219-mlc",
    name: "00219-MLC 라이트 크루넥 맨투맨 (8.4oz)",
    brand: "프린트스타",
    category: "데일리 웨어",
    tagline: "부담 없이 편안하게 즐기는 8.4온스 크루넥 스웨트 셔츠",
    description: "적당한 두께감의 쮸리 원단(100% 면)으로 사계절 내내 단체복 유니폼으로 즐길 수 있는 미니멀 맨투맨입니다.",
    basePrice: 18800,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00219-mlc/00219-MLC-001_L.jpg"
        },
        {
              "name": "모쿠 그레이",
              "hex": "#c6c8c9",
              "image": "/images/products/00219-mlc/00219-MLC-003_L.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00219-mlc/00219-MLC-005_L.jpg"
        },
        {
              "name": "블루",
              "hex": "#3b82f6",
              "image": "/images/products/00219-mlc/00219-MLC-030_L.jpg"
        },
        {
              "name": "오트밀",
              "hex": "#e2dbcd",
              "image": "/images/products/00219-mlc/00219-MLC-039_L.jpg"
        },
        {
              "name": "버건디",
              "hex": "#731630",
              "image": "/images/products/00219-mlc/00219-MLC-112_L.jpg"
        },
        {
              "name": "브라이트 그린",
              "hex": "#22c55e",
              "image": "/images/products/00219-mlc/00219-MLC-172_L.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00219-mlc/00219-MLC-174_L.jpg"
        }
  ],
    sizes: ["110", "130", "150", "WM", "S", "M", "L", "XL", "2XL", "3XL"],
    sizeUpcharges: {"2XL": 1500, "3XL": 2500}
  },
  {
    id: "00220-mhp",
    name: "00220-MHP 헤비웨이트 크루넥 스웨트 셔츠 (9.7oz)",
    brand: "프린트스타",
    category: "데일리 웨어",
    tagline: "9.7온스의 보온성 높은 기모 안감 볼드 크루넥",
    description: "중후한 핏의 고중량 원단으로 실루엣이 탄탄하며 추운 겨울철 이너로 완벽합니다.",
    basePrice: 23800,
    colors: [
        {
              "name": "모쿠 그레이",
              "hex": "#c6c8c9",
              "image": "/images/products/00220-mhp/00220-MHP-003_L.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00220-mhp/00220-MHP-005_L.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00220-mhp/00220-MHP-174_L.jpg"
        }
  ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"],
    sizeUpcharges: {"2XL": 2000, "3XL": 3000, "4XL": 4000}
  },
  {
    id: "00238-rfj",
    name: "00238-RFJ 리버서블 양면 플리스 자켓",
    brand: "프린트스타",
    category: "굿즈/라이프스타일",
    tagline: "플리스와 바람막이를 양면으로 착용하는 리버서블 아우터",
    description: "한 면은 부드러운 보아 플리스 원단, 반대편은 바람막이 방풍 타포린 원단으로 제작되어 날씨에 맞춰 두 가지 연출이 가능한 헤비 방한 아우터입니다.",
    basePrice: 39800,
    colors: [
        {
              "name": "그레이",
              "hex": "#9ca3af",
              "image": "/images/products/00238-rfj/00238-RFJ-002_L.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00238-rfj/00238-RFJ-005_L.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00238-rfj/00238-RFJ-031_L.jpg"
        }
  ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    sizeUpcharges: {"2XL": 3000}
  },
  {
    id: "00271-bfc",
    name: "00271-BFC 스탠다드 맨투맨 스웨트 (T/C)",
    brand: "프린트스타",
    category: "데일리 웨어",
    tagline: "T/C 혼방으로 세탁 후 변형과 주름을 방지한 스탠다드 크루넥",
    description: "면과 폴리에스터 혼방 기모 스웨트 원단으로 보풀이 적고 내구성이 대단히 뛰어난 단체 맨투맨입니다.",
    basePrice: 20800,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00271-bfc/00271-BFC-001_L.jpg"
        },
        {
              "name": "모쿠 그레이",
              "hex": "#c6c8c9",
              "image": "/images/products/00271-bfc/00271-BFC-003_L.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00271-bfc/00271-BFC-005_L.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00271-bfc/00271-BFC-031_L.jpg"
        },
        {
              "name": "아미그린",
              "hex": "#4a533c",
              "image": "/images/products/00271-bfc/00271-BFC-037_L.jpg"
        },
        {
              "name": "차콜",
              "hex": "#494b52",
              "image": "/images/products/00271-bfc/00271-BFC-129_L.jpg"
        }
  ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"],
    sizeUpcharges: {"2XL": 2000, "3XL": 3000, "4XL": 4000}
  },
  {
    id: "00272-bfh",
    name: "00272-BFH 스탠다드 풀오버 후드티 (T/C)",
    brand: "프린트스타",
    category: "굿즈/라이프스타일",
    tagline: "합리적인 가격의 스탠다드 핏 무지 후드티셔츠",
    description: "부드러운 기모 스웨트 원단으로 제작되어 가격 대비 높은 보온성과 핏 완성도를 보여줍니다.",
    basePrice: 28800,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00272-bfh/00272-BFH-001_L.jpg"
        },
        {
              "name": "모쿠 그레이",
              "hex": "#c6c8c9",
              "image": "/images/products/00272-bfh/00272-BFH-003_L.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00272-bfh/00272-BFH-005_L.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00272-bfh/00272-BFH-031_L.jpg"
        },
        {
              "name": "아미그린",
              "hex": "#4a533c",
              "image": "/images/products/00272-bfh/00272-BFH-037_L.jpg"
        },
        {
              "name": "차콜",
              "hex": "#494b52",
              "image": "/images/products/00272-bfh/00272-BFH-129_L.jpg"
        }
  ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"],
    sizeUpcharges: {"2XL": 2500, "3XL": 3500, "4XL": 4500}
  },
  {
    id: "00273-bfz",
    name: "00273-BFZ 스탠다드 집업 후드티 (T/C)",
    brand: "프린트스타",
    category: "굿즈/라이프스타일",
    tagline: "캐주얼 단체 아우터 1순위, 기모 집업 후드 자켓",
    description: "실용적인 지퍼 여밈 구조로 아침저녁 간편하게 레이어드하기 좋은 대중적인 기모 조크 후드집업입니다.",
    basePrice: 33800,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00273-bfz/00273-BFZ-001_L.jpg"
        },
        {
              "name": "모쿠 그레이",
              "hex": "#c6c8c9",
              "image": "/images/products/00273-bfz/00273-BFZ-003_L.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00273-bfz/00273-BFZ-005_L.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00273-bfz/00273-BFZ-031_L.jpg"
        },
        {
              "name": "아미그린",
              "hex": "#4a533c",
              "image": "/images/products/00273-bfz/00273-BFZ-037_L.jpg"
        },
        {
              "name": "차콜",
              "hex": "#494b52",
              "image": "/images/products/00273-bfz/00273-BFZ-129_L.jpg"
        }
  ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"],
    sizeUpcharges: {"2XL": 2500, "3XL": 3500, "4XL": 4500}
  },
  {
    id: "00300-act",
    name: "00300-ACT 드라이 메쉬 라운드 반팔 티셔츠",
    brand: "글리머",
    category: "액티브 웨어",
    tagline: "흡습 속건의 강자, 4.4온스 액티브 드라이 티셔츠",
    description: "폴리에스터 100% 매쉬 편조직 원단으로 스포츠, 레저 및 격렬한 땀 배출 활동에 압도적인 건조 속도를 선사합니다. UV 자외선 차단 90% 이상 기능이 포함되어 야외 활동용 단체복으로 최고입니다.",
    basePrice: 6800,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00300-act/00300-ACT-001_M.jpg"
        },
        {
              "name": "그레이",
              "hex": "#9ca3af",
              "image": "/images/products/00300-act/00300-ACT-002_M.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00300-act/00300-ACT-005_M.jpg"
        },
        {
              "name": "레드",
              "hex": "#e6193c",
              "image": "/images/products/00300-act/00300-ACT-010_M.jpg"
        },
        {
              "name": "핑크",
              "hex": "#f472b6",
              "image": "/images/products/00300-act/00300-ACT-011_M.jpg"
        },
        {
              "name": "퍼플",
              "hex": "#48339b",
              "image": "/images/products/00300-act/00300-ACT-014_M.jpg"
        },
        {
              "name": "오렌지",
              "hex": "#ff5f00",
              "image": "/images/products/00300-act/00300-ACT-015_M.jpg"
        },
        {
              "name": "그린",
              "hex": "#00874e",
              "image": "/images/products/00300-act/00300-ACT-025_M.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00300-act/00300-ACT-031_M.jpg"
        },
        {
              "name": "로얄 블루",
              "hex": "#054cb9",
              "image": "/images/products/00300-act/00300-ACT-032_M.jpg"
        },
        {
              "name": "터코이즈",
              "hex": "#00a2cc",
              "image": "/images/products/00300-act/00300-ACT-034_M.jpg"
        },
        {
              "name": "아미그린",
              "hex": "#4a533c",
              "image": "/images/products/00300-act/00300-ACT-037_M.jpg"
        },
        {
              "name": "색상 047",
              "hex": "#9ca3af",
              "image": "/images/products/00300-act/00300-ACT-047_M.jpg"
        },
        {
              "name": "색상 048",
              "hex": "#9ca3af",
              "image": "/images/products/00300-act/00300-ACT-048_M.jpg"
        },
        {
              "name": "민트블루",
              "hex": "#7dd3fc",
              "image": "/images/products/00300-act/00300-ACT-096_M.jpg"
        },
        {
              "name": "버건디",
              "hex": "#731630",
              "image": "/images/products/00300-act/00300-ACT-112_M.jpg"
        },
        {
              "name": "올리브",
              "hex": "#565d38",
              "image": "/images/products/00300-act/00300-ACT-128_M.jpg"
        },
        {
              "name": "라이트 핑크",
              "hex": "#ffccd5",
              "image": "/images/products/00300-act/00300-ACT-132_M.jpg"
        },
        {
              "name": "라이트 블루",
              "hex": "#a2dbe7",
              "image": "/images/products/00300-act/00300-ACT-133_M.jpg"
        },
        {
              "name": "라이트 옐로우",
              "hex": "#fff4ab",
              "image": "/images/products/00300-act/00300-ACT-134_M.jpg"
        },
        {
              "name": "핫핑크",
              "hex": "#e6006f",
              "image": "/images/products/00300-act/00300-ACT-146_M.jpg"
        },
        {
              "name": "실버 그레이",
              "hex": "#b8b6b9",
              "image": "/images/products/00300-act/00300-ACT-153_M.jpg"
        },
        {
              "name": "라임",
              "hex": "#84cc16",
              "image": "/images/products/00300-act/00300-ACT-155_M.jpg"
        },
        {
              "name": "데이지",
              "hex": "#ffcc00",
              "image": "/images/products/00300-act/00300-ACT-165_M.jpg"
        },
        {
              "name": "다크 그레이",
              "hex": "#374151",
              "image": "/images/products/00300-act/00300-ACT-187_M.jpg"
        },
        {
              "name": "라이트 퍼플",
              "hex": "#c3b2db",
              "image": "/images/products/00300-act/00300-ACT-188_M.jpg"
        },
        {
              "name": "코요테",
              "hex": "#a16207",
              "image": "/images/products/00300-act/00300-ACT-236_M.jpg"
        },
        {
              "name": "라이트 베이지",
              "hex": "#eddabf",
              "image": "/images/products/00300-act/00300-ACT-455_M.jpg"
        },
        {
              "name": "스 그레이",
              "hex": "#9ca3af",
              "image": "/images/products/00300-act/00300-ACT-901_M.jpg"
        },
        {
              "name": "스 블루",
              "hex": "#3b82f6",
              "image": "/images/products/00300-act/00300-ACT-902_M.jpg"
        },
        {
              "name": "스 레드",
              "hex": "#e6193c",
              "image": "/images/products/00300-act/00300-ACT-903_M.jpg"
        },
        {
              "name": "스 퍼플",
              "hex": "#48339b",
              "image": "/images/products/00300-act/00300-ACT-905_M.jpg"
        }
  ],
    sizes: ["100", "110", "120", "130", "140", "150", "SS", "S", "M", "L", "LL", "3L", "4L", "5L"],
    sizeUpcharges: {"3L": 500, "4L": 1000, "5L": 1500}
  },
  {
    id: "00302-adp",
    name: "00302-ADP 드라이 메쉬 칼라 폴로셔츠",
    brand: "글리머",
    category: "액티브 웨어",
    tagline: "단정함과 스포티함의 조화, 칼라형 드라이 반팔 폴로",
    description: "속건성이 우수한 메쉬 소재 카라 셔츠로 매장 유니폼, 쿨비즈 사내복, 골프 및 테니스웨어로 두루 각광받습니다.",
    basePrice: 9600,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00302-adp/00302-ADP-001_M.jpg"
        },
        {
              "name": "그레이",
              "hex": "#9ca3af",
              "image": "/images/products/00302-adp/00302-ADP-002_M.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00302-adp/00302-ADP-005_M.jpg"
        },
        {
              "name": "레드",
              "hex": "#e6193c",
              "image": "/images/products/00302-adp/00302-ADP-010_M.jpg"
        },
        {
              "name": "핑크",
              "hex": "#f472b6",
              "image": "/images/products/00302-adp/00302-ADP-011_M.jpg"
        },
        {
              "name": "퍼플",
              "hex": "#48339b",
              "image": "/images/products/00302-adp/00302-ADP-014_M.jpg"
        },
        {
              "name": "오렌지",
              "hex": "#ff5f00",
              "image": "/images/products/00302-adp/00302-ADP-015_M.jpg"
        },
        {
              "name": "그린",
              "hex": "#00874e",
              "image": "/images/products/00302-adp/00302-ADP-025_M.jpg"
        },
        {
              "name": "민트 그린",
              "hex": "#a7f3d0",
              "image": "/images/products/00302-adp/00302-ADP-026_M.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00302-adp/00302-ADP-031_M.jpg"
        },
        {
              "name": "로얄 블루",
              "hex": "#054cb9",
              "image": "/images/products/00302-adp/00302-ADP-032_M.jpg"
        },
        {
              "name": "터코이즈",
              "hex": "#00a2cc",
              "image": "/images/products/00302-adp/00302-ADP-034_M.jpg"
        },
        {
              "name": "아미그린",
              "hex": "#4a533c",
              "image": "/images/products/00302-adp/00302-ADP-037_M.jpg"
        },
        {
              "name": "버건디",
              "hex": "#731630",
              "image": "/images/products/00302-adp/00302-ADP-112_M.jpg"
        },
        {
              "name": "라이트 핑크",
              "hex": "#ffccd5",
              "image": "/images/products/00302-adp/00302-ADP-132_M.jpg"
        },
        {
              "name": "라이트 블루",
              "hex": "#a2dbe7",
              "image": "/images/products/00302-adp/00302-ADP-133_M.jpg"
        },
        {
              "name": "핫핑크",
              "hex": "#e6006f",
              "image": "/images/products/00302-adp/00302-ADP-146_M.jpg"
        },
        {
              "name": "라임",
              "hex": "#84cc16",
              "image": "/images/products/00302-adp/00302-ADP-155_M.jpg"
        },
        {
              "name": "데이지",
              "hex": "#ffcc00",
              "image": "/images/products/00302-adp/00302-ADP-165_M.jpg"
        },
        {
              "name": "다크 그레이",
              "hex": "#374151",
              "image": "/images/products/00302-adp/00302-ADP-187_M.jpg"
        }
  ],
    sizes: ["120", "130", "140", "150", "SS", "S", "M", "L", "LL", "3L", "4L", "5L"],
    sizeUpcharges: {"3L": 500, "4L": 1000, "5L": 1500}
  },
  {
    id: "00304-alt",
    name: "00304-ALT 드라이 메쉬 라운드 긴팔 티셔츠",
    brand: "글리머",
    category: "액티브 웨어",
    tagline: "사계절 자외선으로부터 피부를 보호하는 드라이 긴팔 티셔츠",
    description: "UPF50+ 자외선 차단 설계와 고속 건조 메쉬 원단을 접목해 러닝, 등산, 라이딩 시 필수 레이어로 추천됩니다.",
    basePrice: 8800,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00304-alt/00304-ALT-001_L.jpg"
        },
        {
              "name": "그레이",
              "hex": "#9ca3af",
              "image": "/images/products/00304-alt/00304-ALT-002_L.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00304-alt/00304-ALT-005_L.jpg"
        },
        {
              "name": "레드",
              "hex": "#e6193c",
              "image": "/images/products/00304-alt/00304-ALT-010_L.jpg"
        },
        {
              "name": "퍼플",
              "hex": "#48339b",
              "image": "/images/products/00304-alt/00304-ALT-014_L.jpg"
        },
        {
              "name": "라이트 그린",
              "hex": "#86efac",
              "image": "/images/products/00304-alt/00304-ALT-024_L.jpg"
        },
        {
              "name": "그린",
              "hex": "#00874e",
              "image": "/images/products/00304-alt/00304-ALT-025_L.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00304-alt/00304-ALT-031_L.jpg"
        },
        {
              "name": "로얄 블루",
              "hex": "#054cb9",
              "image": "/images/products/00304-alt/00304-ALT-032_L.jpg"
        },
        {
              "name": "터코이즈",
              "hex": "#00a2cc",
              "image": "/images/products/00304-alt/00304-ALT-034_L.jpg"
        },
        {
              "name": "아미그린",
              "hex": "#4a533c",
              "image": "/images/products/00304-alt/00304-ALT-037_L.jpg"
        },
        {
              "name": "버건디",
              "hex": "#731630",
              "image": "/images/products/00304-alt/00304-ALT-112_L.jpg"
        },
        {
              "name": "라이트 블루",
              "hex": "#a2dbe7",
              "image": "/images/products/00304-alt/00304-ALT-133_L.jpg"
        }
  ],
    sizes: ["140", "150", "SS", "S", "M", "L", "LL", "3L", "4L", "5L"],
    sizeUpcharges: {"3L": 500, "4L": 1000, "5L": 1500}
  },
  {
    id: "00313-abn",
    name: "00313-ABN 드라이 버튼다운 폴로셔츠 (반팔)",
    brand: "글리머",
    category: "액티브 웨어",
    tagline: "목 깃이 무너지지 않는 세련된 버튼다운 쿨 드라이 셔츠",
    description: "버튼으로 칼라 끝깃을 고정하는 디자인으로 비즈니스 캐주얼 및 고품격 점포 서빙 유니폼으로 훌륭합니다.",
    basePrice: 10800,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00313-abn/00313-ABN-001_L.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00313-abn/00313-ABN-005_L.jpg"
        },
        {
              "name": "레드",
              "hex": "#e6193c",
              "image": "/images/products/00313-abn/00313-ABN-010_L.jpg"
        },
        {
              "name": "그린",
              "hex": "#00874e",
              "image": "/images/products/00313-abn/00313-ABN-025_L.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00313-abn/00313-ABN-031_L.jpg"
        },
        {
              "name": "로얄 블루",
              "hex": "#054cb9",
              "image": "/images/products/00313-abn/00313-ABN-032_L.jpg"
        },
        {
              "name": "코발트 블루",
              "hex": "#0052ff",
              "image": "/images/products/00313-abn/00313-ABN-033_L.jpg"
        },
        {
              "name": "터코이즈",
              "hex": "#00a2cc",
              "image": "/images/products/00313-abn/00313-ABN-034_L.jpg"
        },
        {
              "name": "버건디",
              "hex": "#731630",
              "image": "/images/products/00313-abn/00313-ABN-112_L.jpg"
        },
        {
              "name": "라이트 핑크",
              "hex": "#ffccd5",
              "image": "/images/products/00313-abn/00313-ABN-132_L.jpg"
        },
        {
              "name": "라임",
              "hex": "#84cc16",
              "image": "/images/products/00313-abn/00313-ABN-155_L.jpg"
        },
        {
              "name": "데이지",
              "hex": "#ffcc00",
              "image": "/images/products/00313-abn/00313-ABN-165_L.jpg"
        }
  ],
    sizes: ["SS", "S", "M", "L", "LL", "3L", "4L", "5L"],
    sizeUpcharges: {"3L": 500, "4L": 1000, "5L": 1500}
  },
  {
    id: "00321-acr",
    name: "00321-ACR 드라이 버튼다운 시보리 폴로셔츠",
    brand: "글리머",
    category: "액티브 웨어",
    tagline: "깃 버튼다운과 소매 리브 처리가 적용된 디테일러 폴로셔츠",
    description: "소매단이 단정하게 조여져 핏이 깨끗하고 스포츠 시 단정한 움직임을 유지시켜 줍니다.",
    basePrice: 11200,
    colors: [
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00321-acr/00321-ACR-005_L.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00321-acr/00321-ACR-031_L.jpg"
        },
        {
              "name": "다크 그레이",
              "hex": "#374151",
              "image": "/images/products/00321-acr/00321-ACR-187_L.jpg"
        },
        {
              "name": "스 그레이",
              "hex": "#9ca3af",
              "image": "/images/products/00321-acr/00321-ACR-901_L.jpg"
        }
  ],
    sizes: ["SS", "S", "M", "L", "LL", "3L", "4L", "5L"],
    sizeUpcharges: {"3L": 500, "4L": 1000, "5L": 1500}
  },
  {
    id: "00325-acp",
    name: "00325-ACP 드라이 메쉬 포켓 폴로셔츠 (반팔)",
    brand: "글리머",
    category: "액티브 웨어",
    tagline: "왼가슴 포켓 장착으로 펜 및 무전기 수납이 편한 쿨비즈 셔츠",
    description: "포켓 수납 편의성을 극대화한 스포츠 드라이 카라티셔츠로 배달 및 필드 야외 작업에 요긴합니다.",
    basePrice: 10200,
    colors: [
        {
              "name": "그레이",
              "hex": "#9ca3af",
              "image": "/images/products/00325-acp/00325-ACP-002_L.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00325-acp/00325-ACP-005_L.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00325-acp/00325-ACP-031_L.jpg"
        },
        {
              "name": "다크 그레이",
              "hex": "#374151",
              "image": "/images/products/00325-acp/00325-ACP-187_L.jpg"
        }
  ],
    sizes: ["SS", "S", "M", "L", "LL", "3L", "4L", "5L"],
    sizeUpcharges: {"3L": 500, "4L": 1000, "5L": 1500}
  },
  {
    id: "00330-avp",
    name: "00330-AVP 드라이 V넥 반팔 폴로셔츠",
    brand: "글리머",
    category: "액티브 웨어",
    tagline: "목선이 슬림하고 샤프해 보이는 V넥 드라이 칼라티",
    description: "답답한 단추 칼라 대신 V라인 트임 넥라인을 사용해 넥 가이드 착용 및 쾌적한 핏을 유도합니다.",
    basePrice: 9800,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00330-avp/00330-AVP-001_M.jpg"
        },
        {
              "name": "그레이",
              "hex": "#9ca3af",
              "image": "/images/products/00330-avp/00330-AVP-002_M.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00330-avp/00330-AVP-005_M.jpg"
        },
        {
              "name": "레드",
              "hex": "#e6193c",
              "image": "/images/products/00330-avp/00330-AVP-010_M.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00330-avp/00330-AVP-031_M.jpg"
        },
        {
              "name": "로얄 블루",
              "hex": "#054cb9",
              "image": "/images/products/00330-avp/00330-AVP-032_M.jpg"
        },
        {
              "name": "터코이즈",
              "hex": "#00a2cc",
              "image": "/images/products/00330-avp/00330-AVP-034_M.jpg"
        },
        {
              "name": "버건디",
              "hex": "#731630",
              "image": "/images/products/00330-avp/00330-AVP-112_M.jpg"
        },
        {
              "name": "라이트 핑크",
              "hex": "#ffccd5",
              "image": "/images/products/00330-avp/00330-AVP-132_M.jpg"
        },
        {
              "name": "라이트 블루",
              "hex": "#a2dbe7",
              "image": "/images/products/00330-avp/00330-AVP-133_M.jpg"
        },
        {
              "name": "라임",
              "hex": "#84cc16",
              "image": "/images/products/00330-avp/00330-AVP-155_M.jpg"
        },
        {
              "name": "데이지",
              "hex": "#ffcc00",
              "image": "/images/products/00330-avp/00330-AVP-165_M.jpg"
        }
  ],
    sizes: ["SS", "S", "M", "L", "LL", "3L", "4L", "5L"],
    sizeUpcharges: {"3L": 500, "4L": 1000, "5L": 1500}
  },
  {
    id: "00335-alp",
    name: "00335-ALP 드라이 메쉬 포켓 긴팔 폴로셔츠",
    brand: "글리머",
    category: "액티브 웨어",
    tagline: "사계절 유니폼 정석, 포켓 롱슬리브 드라이 칼라셔츠",
    description: "소매부터 가슴 수납, 속건 드라이 기술까지 유니폼의 모든 자질을 갖춘 만능 롱 카라티셔츠입니다.",
    basePrice: 12000,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00335-alp/00335-ALP-001_L.jpg"
        },
        {
              "name": "그레이",
              "hex": "#9ca3af",
              "image": "/images/products/00335-alp/00335-ALP-002_L.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00335-alp/00335-ALP-005_L.jpg"
        },
        {
              "name": "레드",
              "hex": "#e6193c",
              "image": "/images/products/00335-alp/00335-ALP-010_L.jpg"
        },
        {
              "name": "민트 그린",
              "hex": "#a7f3d0",
              "image": "/images/products/00335-alp/00335-ALP-026_L.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00335-alp/00335-ALP-031_L.jpg"
        },
        {
              "name": "로얄 블루",
              "hex": "#054cb9",
              "image": "/images/products/00335-alp/00335-ALP-032_L.jpg"
        },
        {
              "name": "버건디",
              "hex": "#731630",
              "image": "/images/products/00335-alp/00335-ALP-112_L.jpg"
        },
        {
              "name": "라이트 블루",
              "hex": "#a2dbe7",
              "image": "/images/products/00335-alp/00335-ALP-133_L.jpg"
        }
  ],
    sizes: ["SS", "S", "M", "L", "LL", "3L", "4L", "5L"],
    sizeUpcharges: {"3L": 500, "4L": 1000, "5L": 1500}
  },
  {
    id: "00338-amz",
    name: "00338-AMZ 드라이 하프지퍼 스포티 폴로셔츠",
    brand: "글리머",
    category: "액티브 웨어",
    tagline: "하프 아노락 지퍼 칼라로 입고 벗기 편한 액티브 티셔츠",
    description: "목 앞부분의 지퍼 슬라이더로 통풍 조절이 빠르며 테니스, 등산 등 동호회웨어로 인기가 높습니다.",
    basePrice: 11600,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00338-amz/00338-AMZ-001_L.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00338-amz/00338-AMZ-005_L.jpg"
        },
        {
              "name": "레드",
              "hex": "#e6193c",
              "image": "/images/products/00338-amz/00338-AMZ-010_L.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00338-amz/00338-AMZ-031_L.jpg"
        },
        {
              "name": "로얄 블루",
              "hex": "#054cb9",
              "image": "/images/products/00338-amz/00338-AMZ-032_L.jpg"
        },
        {
              "name": "터코이즈",
              "hex": "#00a2cc",
              "image": "/images/products/00338-amz/00338-AMZ-034_L.jpg"
        },
        {
              "name": "다크 그레이",
              "hex": "#374151",
              "image": "/images/products/00338-amz/00338-AMZ-187_L.jpg"
        }
  ],
    sizes: ["SS", "S", "M", "L", "LL", "3L", "4L", "5L"],
    sizeUpcharges: {"3L": 500, "4L": 1000, "5L": 1500}
  },
  {
    id: "00339-ayp",
    name: "00339-AYP 드라이 레이어드 칼라 반팔 폴로셔츠",
    brand: "글리머",
    category: "액티브 웨어",
    tagline: "목 카라와 소매 끝단 배색 포인트를 준 레이어드 폴로셔츠",
    description: "이너웨어를 덧입은 듯한 감각적인 시각 레이어드 마감으로 캐주얼하고 젊은 인상을 부여합니다.",
    basePrice: 10600,
    colors: [
        {
              "name": "색상 312",
              "hex": "#9ca3af",
              "image": "/images/products/00339-ayp/00339-AYP-312_L.jpg"
        },
        {
              "name": "색상 650",
              "hex": "#9ca3af",
              "image": "/images/products/00339-ayp/00339-AYP-650_L.jpg"
        },
        {
              "name": "색상 664",
              "hex": "#9ca3af",
              "image": "/images/products/00339-ayp/00339-AYP-664_L.jpg"
        },
        {
              "name": "색상 665",
              "hex": "#9ca3af",
              "image": "/images/products/00339-ayp/00339-AYP-665_L.jpg"
        },
        {
              "name": "색상 666",
              "hex": "#9ca3af",
              "image": "/images/products/00339-ayp/00339-AYP-666_L.jpg"
        },
        {
              "name": "색상 710",
              "hex": "#9ca3af",
              "image": "/images/products/00339-ayp/00339-AYP-710_L.jpg"
        },
        {
              "name": "색상 732",
              "hex": "#9ca3af",
              "image": "/images/products/00339-ayp/00339-AYP-732_L.jpg"
        }
  ],
    sizes: ["SS", "S", "M", "L", "LL", "3L", "4L", "5L"],
    sizeUpcharges: {"3L": 500, "4L": 1000, "5L": 1500}
  },
  {
    id: "00346-afc",
    name: "00346-AFC 드라이 후드티 (쮸리)",
    brand: "글리머",
    category: "액티브 웨어",
    tagline: "기능성 흡습 드라이 원사의 라이트 핏 캐주얼 후드티",
    description: "면과 폴리 기능성 조합으로 무겁지 않고 세탁 건조가 빨라 피트니스 웨어로 강추됩니다.",
    basePrice: 17800,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00346-afc/00346-AFC-001_L.jpg"
        },
        {
              "name": "모쿠 그레이",
              "hex": "#c6c8c9",
              "image": "/images/products/00346-afc/00346-AFC-003_L.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00346-afc/00346-AFC-005_L.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00346-afc/00346-AFC-031_L.jpg"
        },
        {
              "name": "버건디",
              "hex": "#731630",
              "image": "/images/products/00346-afc/00346-AFC-112_L.jpg"
        }
  ],
    sizes: ["SS", "S", "M", "L", "LL", "3L", "4L", "5L"],
    sizeUpcharges: {"3L": 1000, "4L": 1500, "5L": 2000}
  },
  {
    id: "00347-afh",
    name: "00347-AFH 드라이 풀오버 후드티 (쮸리)",
    brand: "글리머",
    category: "액티브 웨어",
    tagline: "속건 드라이 원사로 설계된 캐주얼 집업 후디",
    description: "아웃도어 활동이나 운동 중간에 가볍게 지퍼로 온도 조절을 할 수 있는 쮸리 후드집업입니다.",
    basePrice: 19800,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00347-afh/00347-AFH-001_L.jpg"
        },
        {
              "name": "모쿠 그레이",
              "hex": "#c6c8c9",
              "image": "/images/products/00347-afh/00347-AFH-003_L.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00347-afh/00347-AFH-005_L.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00347-afh/00347-AFH-031_L.jpg"
        },
        {
              "name": "버건디",
              "hex": "#731630",
              "image": "/images/products/00347-afh/00347-AFH-112_L.jpg"
        }
  ],
    sizes: ["SS", "S", "M", "L", "LL", "3L", "4L", "5L"],
    sizeUpcharges: {"3L": 1000, "4L": 1500, "5L": 2000}
  },
  {
    id: "00348-afz",
    name: "00348-AFZ 드라이 스탠드 칼라 집업 자켓",
    brand: "글리머",
    category: "액티브 웨어",
    tagline: "깃을 세운 깔끔한 트랙 탑 타입의 드라이 집업 트레이너",
    description: "운동선수 단체복 및 코치 자켓으로 최적이며 형태 복원력이 좋아 단체 바람막이 대용으로 유용합니다.",
    basePrice: 16800,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00348-afz/00348-AFZ-001_L.jpg"
        },
        {
              "name": "모쿠 그레이",
              "hex": "#c6c8c9",
              "image": "/images/products/00348-afz/00348-AFZ-003_L.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00348-afz/00348-AFZ-005_L.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00348-afz/00348-AFZ-031_L.jpg"
        },
        {
              "name": "버건디",
              "hex": "#731630",
              "image": "/images/products/00348-afz/00348-AFZ-112_L.jpg"
        }
  ],
    sizes: ["SS", "S", "M", "L", "LL", "3L", "4L", "5L"],
    sizeUpcharges: {"3L": 1000, "4L": 1500, "5L": 2000}
  },
  {
    id: "00350-ait",
    name: "00350-AIT 드라이 인터록 초경량 반팔 티셔츠",
    brand: "글리머",
    category: "액티브 웨어",
    tagline: "3.5온스의 깃털 같은 무게, 부드러운 양면 인터록 드라이티",
    description: "양면 모두 매끄럽게 편직(인터록)되어 피부 마찰이 없고 신축성이 매우 뛰어난 고속 속건 티셔츠입니다.",
    basePrice: 6400,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00350-ait/00350-AIT-001_L.jpg"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00350-ait/00350-AIT-005_L.jpg"
        },
        {
              "name": "레드",
              "hex": "#e6193c",
              "image": "/images/products/00350-ait/00350-AIT-010_L.jpg"
        },
        {
              "name": "퍼플",
              "hex": "#48339b",
              "image": "/images/products/00350-ait/00350-AIT-014_L.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00350-ait/00350-AIT-031_L.jpg"
        },
        {
              "name": "로얄 블루",
              "hex": "#054cb9",
              "image": "/images/products/00350-ait/00350-AIT-032_L.jpg"
        },
        {
              "name": "라이트 블루",
              "hex": "#a2dbe7",
              "image": "/images/products/00350-ait/00350-AIT-133_L.jpg"
        },
        {
              "name": "다크 그레이",
              "hex": "#374151",
              "image": "/images/products/00350-ait/00350-AIT-187_L.jpg"
        }
  ],
    sizes: ["120", "130", "140", "150", "SS", "S", "M", "L", "LL", "3L", "4L", "5L"],
    sizeUpcharges: {"3L": 500, "4L": 1000, "5L": 1500}
  },
  {
    id: "00353-ain",
    name: "00353-AIN 드라이 인터록 V넥 반팔 티셔츠",
    brand: "글리머",
    category: "액티브 웨어",
    tagline: "목선이 편안한 샤프 V넥 초경량 인터록 드라이티",
    description: "가볍고 매끄러운 양면 조밀 원사에 고급스러운 V라인 커팅을 가미한 피트니스 셔츠입니다.",
    basePrice: 6400,
    colors: [
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00353-ain/00353-AIN-005_L.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00353-ain/00353-AIN-031_L.jpg"
        },
        {
              "name": "다크 그레이",
              "hex": "#374151",
              "image": "/images/products/00353-ain/00353-AIN-187_L.jpg"
        }
  ],
    sizes: ["SS", "S", "M", "L", "LL", "3L", "4L", "5L"],
    sizeUpcharges: {"3L": 500, "4L": 1000, "5L": 1500}
  },
  {
    id: "00731-cck",
    name: "00731-CCK 코튼 캔버스 워크웨어 코치 자켓",
    brand: "프린트스타",
    category: "굿즈/라이프스타일",
    tagline: "도톰한 코튼 캔버스 원단으로 워크자켓 감성을 극대화한 아우터",
    description: "내구성 높은 코튼 캔버스 마감으로 레트로 워크 마니아들이 만족하는 가을/겨울 캐주얼 자켓입니다.",
    basePrice: 36800,
    colors: [
        {
              "name": "화이트",
              "hex": "#ffffff",
              "image": "/images/products/00731-cck/00731-CCK-001_F.png"
        },
        {
              "name": "베이지",
              "hex": "#d6c5b0",
              "image": "/images/products/00731-cck/00731-CCK-004_F.png"
        },
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00731-cck/00731-CCK-005_F.png"
        },
        {
              "name": "레드",
              "hex": "#e6193c",
              "image": "/images/products/00731-cck/00731-CCK-010_F_B.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00731-cck/00731-CCK-031_F_B.png"
        },
        {
              "name": "로얄 블루",
              "hex": "#054cb9",
              "image": "/images/products/00731-cck/00731-CCK-032_F_B.jpg"
        },
        {
              "name": "아미그린",
              "hex": "#4a533c",
              "image": "/images/products/00731-cck/00731-CCK-037_F_B.png"
        }
  ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    sizeUpcharges: {"2XL": 3000}
  },
  {
    id: "00760-enb",
    name: "00760-ENB 드라이 집업 트레이닝 트랙 자켓",
    brand: "글리머",
    category: "액티브 웨어",
    tagline: "사이드 배색 라인이 매력적인 에어로쿨 집업 자켓",
    description: "스포티한 세로 배색 밴딩 처리로 팔 라인이 길고 날렵해 보이는 에너제틱 바람막이 자켓입니다.",
    basePrice: 18800,
    colors: [
        {
              "name": "내추럴",
              "hex": "#fafaf9",
              "image": "/images/products/00760-enb/00760-ENB-106_F-BIG.jpg"
        }
  ],
    sizes: ["SS", "S", "M", "L", "LL", "3L", "4L", "5L"],
    sizeUpcharges: {"3L": 1000, "4L": 1500, "5L": 2000}
  },
  {
    id: "00762-enn",
    name: "00762-ENN 드라이 메쉬 스포티 반바지 (트레이닝 숏팬츠)",
    brand: "글리머",
    category: "액티브 웨어",
    tagline: "운동 시 쾌적함을 극대화해 주는 드라이 메쉬 반바지",
    description: "허리 고무줄과 실용적인 깊이의 양측 포켓, 그리고 숨쉬는 메쉬 소재를 적용한 고속 건조 반바지입니다.",
    basePrice: 12800,
    colors: [
        {
              "name": "내추럴",
              "hex": "#fafaf9",
              "image": "/images/products/00762-enn/00762-ENN-106_F.jpg"
        }
  ],
    sizes: ["SS", "S", "M", "L", "LL", "3L", "4L", "5L"],
    sizeUpcharges: {"3L": 500, "4L": 1000, "5L": 1500}
  },
  {
    id: "00778-tcc",
    name: "00778-TCC 코튼 캔버스 심플 데일리 에코백",
    brand: "프린트스타",
    category: "굿즈/라이프스타일",
    tagline: "친환경 코튼 캔버스 원단으로 튼튼한 다용도 에코백",
    description: "브랜드 판촉 및 어깨끈이 튼튼해 데일리 책가방으로 사랑받는 베이직 에코백입니다.",
    basePrice: 4800,
    colors: [
        {
              "name": "블랙",
              "hex": "#1a1a1a",
              "image": "/images/products/00778-tcc/00778-TCC-005_M.jpg"
        },
        {
              "name": "네이비",
              "hex": "#0f1d35",
              "image": "/images/products/00778-tcc/00778-TCC-031_M.jpg"
        },
        {
              "name": "터코이즈",
              "hex": "#00a2cc",
              "image": "/images/products/00778-tcc/00778-TCC-034_M.jpg"
        },
        {
              "name": "내추럴",
              "hex": "#fafaf9",
              "image": "/images/products/00778-tcc/00778-TCC-106_M.jpg"
        },
        {
              "name": "라이트 블루",
              "hex": "#a2dbe7",
              "image": "/images/products/00778-tcc/00778-TCC-133_M.jpg"
        },
        {
              "name": "핫핑크",
              "hex": "#e6006f",
              "image": "/images/products/00778-tcc/00778-TCC-146_M.jpg"
        }
  ],
    sizes: ["FREE"],
    sizeUpcharges: {}
  },
  {
    id: "00780-twt",
    name: "00780-TWT 코튼 캔버스 캐주얼 토트백",
    brand: "프린트스타",
    category: "굿즈/라이프스타일",
    tagline: "밑단 가이드가 넓어 수납이 넉넉한 캔버스 토트백",
    description: "도시락 수납이나 가벼운 피크닉 소품 수납에 요긴하며 직조감이 예쁜 프리미엄 토트백입니다.",
    basePrice: 5800,
    colors: [
        {
              "name": "색상 201",
              "hex": "#9ca3af",
              "image": "/images/products/00780-twt/00780-TWT-201_M.jpg"
        },
        {
              "name": "색상 204",
              "hex": "#9ca3af",
              "image": "/images/products/00780-twt/00780-TWT-204_M.jpg"
        },
        {
              "name": "색상 205",
              "hex": "#9ca3af",
              "image": "/images/products/00780-twt/00780-TWT-205_M.jpg"
        },
        {
              "name": "색상 725",
              "hex": "#9ca3af",
              "image": "/images/products/00780-twt/00780-TWT-725_M.jpg"
        }
  ],
    sizes: ["FREE"],
    sizeUpcharges: {}
  },
];
