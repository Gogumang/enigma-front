// 로맨스 스캠 패턴 데이터

export interface ScamPattern {
  keyword: string;
  weight: number; // 위험도 가중치 (1-10)
  category: 'love_bombing' | 'financial' | 'urgency' | 'isolation' | 'identity' | 'excuse';
  stage: number; // 스캠 진행 단계 (1-5)
}

export const scamPatterns: ScamPattern[] = [
  // Love Bombing (1단계: 감정 폭격)
  { keyword: '운명', weight: 3, category: 'love_bombing', stage: 1 },
  { keyword: '첫눈에 반했', weight: 4, category: 'love_bombing', stage: 1 },
  { keyword: '소울메이트', weight: 5, category: 'love_bombing', stage: 1 },
  { keyword: '평생', weight: 3, category: 'love_bombing', stage: 1 },
  { keyword: '결혼', weight: 4, category: 'love_bombing', stage: 1 },
  { keyword: '너만 있으면', weight: 4, category: 'love_bombing', stage: 1 },
  { keyword: '진정한 사랑', weight: 3, category: 'love_bombing', stage: 1 },
  { keyword: '처음이야', weight: 3, category: 'love_bombing', stage: 1 },
  { keyword: '특별해', weight: 2, category: 'love_bombing', stage: 1 },
  { keyword: '내 전부', weight: 4, category: 'love_bombing', stage: 1 },

  // Identity Red Flags (2단계: 신원 이상 징후)
  { keyword: '해외 파병', weight: 6, category: 'identity', stage: 2 },
  { keyword: '석유 시추', weight: 7, category: 'identity', stage: 2 },
  { keyword: '유엔', weight: 5, category: 'identity', stage: 2 },
  { keyword: 'UN 평화유지군', weight: 7, category: 'identity', stage: 2 },
  { keyword: '의사', weight: 2, category: 'identity', stage: 2 },
  { keyword: '군인', weight: 3, category: 'identity', stage: 2 },
  { keyword: '엔지니어', weight: 2, category: 'identity', stage: 2 },
  { keyword: '시리아', weight: 5, category: 'identity', stage: 2 },
  { keyword: '아프가니스탄', weight: 5, category: 'identity', stage: 2 },
  { keyword: '이라크', weight: 5, category: 'identity', stage: 2 },

  // Excuses (3단계: 회피 및 변명)
  { keyword: '영상통화 안돼', weight: 6, category: 'excuse', stage: 3 },
  { keyword: '카메라 고장', weight: 7, category: 'excuse', stage: 3 },
  { keyword: '보안상', weight: 5, category: 'excuse', stage: 3 },
  { keyword: '기밀', weight: 5, category: 'excuse', stage: 3 },
  { keyword: '만날 수 없', weight: 6, category: 'excuse', stage: 3 },
  { keyword: '휴가 못 나와', weight: 5, category: 'excuse', stage: 3 },
  { keyword: '폰이 안 터져', weight: 4, category: 'excuse', stage: 3 },

  // Financial Setup (4단계: 금전 요구 준비)
  { keyword: '투자', weight: 7, category: 'financial', stage: 4 },
  { keyword: '코인', weight: 8, category: 'financial', stage: 4 },
  { keyword: '비트코인', weight: 8, category: 'financial', stage: 4 },
  { keyword: '암호화폐', weight: 8, category: 'financial', stage: 4 },
  { keyword: '수익', weight: 5, category: 'financial', stage: 4 },
  { keyword: '원금 보장', weight: 9, category: 'financial', stage: 4 },
  { keyword: '고수익', weight: 8, category: 'financial', stage: 4 },
  { keyword: '비밀 계좌', weight: 9, category: 'financial', stage: 4 },

  // Urgency & Money Request (5단계: 긴급 금전 요구)
  { keyword: '급하게', weight: 7, category: 'urgency', stage: 5 },
  { keyword: '지금 당장', weight: 7, category: 'urgency', stage: 5 },
  { keyword: '오늘 안에', weight: 8, category: 'urgency', stage: 5 },
  { keyword: '송금', weight: 9, category: 'financial', stage: 5 },
  { keyword: '계좌', weight: 6, category: 'financial', stage: 5 },
  { keyword: '병원비', weight: 8, category: 'financial', stage: 5 },
  { keyword: '수술비', weight: 8, category: 'financial', stage: 5 },
  { keyword: '비행기표', weight: 7, category: 'financial', stage: 5 },
  { keyword: '세관', weight: 8, category: 'financial', stage: 5 },
  { keyword: '통관비', weight: 9, category: 'financial', stage: 5 },
  { keyword: '빌려줘', weight: 8, category: 'financial', stage: 5 },
  { keyword: '돈이 필요', weight: 9, category: 'financial', stage: 5 },
  { keyword: '갚을게', weight: 7, category: 'financial', stage: 5 },
  { keyword: '잠깐만', weight: 4, category: 'urgency', stage: 5 },
  { keyword: '상속', weight: 8, category: 'financial', stage: 5 },
  { keyword: '유산', weight: 7, category: 'financial', stage: 5 },
  { keyword: '금괴', weight: 9, category: 'financial', stage: 5 },
  { keyword: '선물 보냈', weight: 6, category: 'financial', stage: 5 },

  // Isolation (고립화)
  { keyword: '우리 둘만', weight: 4, category: 'isolation', stage: 3 },
  { keyword: '비밀로 해', weight: 6, category: 'isolation', stage: 3 },
  { keyword: '아무한테도 말하지 마', weight: 7, category: 'isolation', stage: 3 },
  { keyword: '가족한테 말하면', weight: 7, category: 'isolation', stage: 3 },
  { keyword: '친구들은 몰라', weight: 5, category: 'isolation', stage: 3 },
];

// 사기 번역기 매핑
export const scamTranslations: Record<string, string> = {
  // Love Bombing
  '사랑해': '신뢰를 쌓는 중...',
  '보고 싶어': '당신의 감정에 투자하는 중',
  '운명이야': '타겟 확정',
  '결혼하고 싶어': '장기 사기 준비 완료',
  '너만 있으면 돼': '고립화 작업 시작',
  '첫눈에 반했어': '스캠 스크립트 1페이지',
  '소울메이트': '감정적 조종 시작',
  '평생 함께하고 싶어': '큰 금액 요구 준비 중',

  // Excuses
  '영상통화는 좀...': '가짜 신원 들킬까봐 무서움',
  '지금은 만날 수 없어': '실제로 존재하지 않는 사람',
  '보안상 이유로': '거짓말 탐지 회피 중',
  '카메라가 고장났어': '다른 사람 사진 쓰는 중',

  // Financial
  '투자 기회가 있어': '사기 본론 시작',
  '원금 보장이야': '100% 사기',
  '급하게 돈이 필요해': '드디어 수확 시간',
  '병원비가 필요해': '동정심 착취 공격',
  '잠깐만 빌려줘': '영원히 안 갚을 예정',
  '세관에서 막혔어': '존재하지 않는 선물',
  '너한테 선물 보냈어': '통관비 사기 준비',
  '곧 갚을게': '두 번 다시 연락 안 할 예정',

  // Urgency
  '지금 당장': '생각할 시간 주면 안 됨',
  '오늘 안에 해야 해': '판단력 마비 공격',
  '시간이 없어': '압박하면 넘어온다',
};

// 단계별 설명
export const stageDescriptions: Record<number, { name: string; description: string; daysEstimate: string }> = {
  1: {
    name: '감정 폭격 (Love Bombing)',
    description: '과도한 애정 표현과 빠른 관계 진전으로 신뢰 구축',
    daysEstimate: '1-14일',
  },
  2: {
    name: '신원 구축 (Identity Building)',
    description: '해외 주재, 전문직 등 검증 어려운 신분 주장',
    daysEstimate: '7-21일',
  },
  3: {
    name: '회피 및 고립 (Avoidance & Isolation)',
    description: '영상통화 거부, 만남 회피, 주변인과의 단절 유도',
    daysEstimate: '14-30일',
  },
  4: {
    name: '금전 준비 (Financial Setup)',
    description: '투자 기회 언급, 재정 상황 파악',
    daysEstimate: '21-45일',
  },
  5: {
    name: '금전 요구 (Money Request)',
    description: '긴급 상황을 가장한 직접적인 금전 요구',
    daysEstimate: '30-60일',
  },
};

// 면역 훈련 시나리오
export const trainingScenarios = [
  {
    id: 'scenario_1',
    title: '해외 군인 시나리오',
    description: '시리아 파병 군인이라고 주장하는 사람과의 대화',
    messages: [
      { role: 'scammer', text: '안녕하세요. 저는 미군 대위 James입니다. 현재 시리아에 파병 중이에요.' },
      { role: 'scammer', text: '당신의 프로필을 보고 첫눈에 반했어요. 운명인 것 같아요.' },
      { role: 'scammer', text: '여기는 인터넷이 불안정해서 영상통화는 어려워요. 보안상의 이유도 있고요.' },
      { role: 'scammer', text: '곧 휴가가 나오면 한국으로 가서 당신을 만나고 싶어요.' },
      { role: 'scammer', text: '그런데 휴가 신청을 위해 수수료가 필요한데, 지금 계좌가 동결되어 있어요...' },
    ],
    redFlags: ['해외 파병', '첫눈에 반함', '영상통화 불가', '금전 요구'],
  },
  {
    id: 'scenario_2',
    title: '투자 사기 시나리오',
    description: '암호화폐 투자를 권유하는 연인',
    messages: [
      { role: 'scammer', text: '자기야, 나 요즘 코인 투자로 엄청 벌었어!' },
      { role: 'scammer', text: '특별한 플랫폼이 있는데, 원금 보장에 수익률이 엄청나.' },
      { role: 'scammer', text: '우리 같이 하면 빨리 돈 모아서 결혼하자!' },
      { role: 'scammer', text: '이 기회는 지금뿐이야. 오늘 안에 가입해야 해.' },
      { role: 'scammer', text: '나를 믿지 못하는 거야? 우리 사이가 그 정도밖에 안 돼?' },
    ],
    redFlags: ['암호화폐 투자', '원금 보장', '긴급성 강조', '감정적 협박'],
  },
  {
    id: 'scenario_3',
    title: '선물 통관비 시나리오',
    description: '비싼 선물을 보냈다며 통관비를 요구',
    messages: [
      { role: 'scammer', text: '자기야! 너한테 특별한 선물을 보냈어. 금목걸이야!' },
      { role: 'scammer', text: '그런데 세관에서 연락이 왔는데, 통관비가 필요하대.' },
      { role: 'scammer', text: '내가 해외에 있어서 한국 계좌로 송금을 못 해.' },
      { role: 'scammer', text: '잠깐만 대신 내줄 수 있어? 내가 도착하면 바로 갚을게.' },
      { role: 'scammer', text: '이거 안 내면 선물이 폐기된대. 제발...' },
    ],
    redFlags: ['존재하지 않는 선물', '통관비 요구', '해외 체류 핑계', '긴급성'],
  },
];

// 카테고리 한글명
export const categoryNames: Record<string, string> = {
  love_bombing: '감정 폭격',
  financial: '금전 관련',
  urgency: '긴급성 강조',
  isolation: '고립화',
  identity: '신원 의심',
  excuse: '회피/변명',
};
