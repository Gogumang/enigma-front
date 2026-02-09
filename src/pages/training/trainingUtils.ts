import type { Persona, Post } from '@/entities/persona';

export const MAX_TURNS = 5;

export const PROFANITY_LIST = [
  '시발',
  '씨발',
  '시bal',
  '씨bal',
  'ㅅㅂ',
  'ㅆㅂ',
  '씹',
  '존나',
  'ㅈㄴ',
  '개새끼',
  '새끼',
  'ㅅㄲ',
  '병신',
  'ㅂㅅ',
  '지랄',
  'ㅈㄹ',
  '미친놈',
  '미친년',
  '꺼져',
  '닥쳐',
  '엿먹어',
  '죽어',
  '뒤져',
  '썅',
  '좆',
  'ㅈ같',
  '니미',
  '니애미',
  '느금마',
  '느금',
  '에미',
  '애미',
  '아가리',
  '주둥이',
  '쓰레기',
  '찐따',
  '한남',
  'fuck',
  'shit',
  'bitch',
  'asshole',
  'damn',
  'bastard',
];

export const checkProfanity = (text: string): boolean => {
  const lowerText = text.toLowerCase().replace(/\s/g, '');
  return PROFANITY_LIST.some((word) => lowerText.includes(word.toLowerCase().replace(/\s/g, '')));
};

export const generateSuccessFeedback = (userMessage: string): string[] => {
  const feedbacks: string[] = [];

  if (userMessage.includes('사기') || userMessage.includes('스캠')) {
    feedbacks.push('사기 패턴을 정확하게 인식했습니다');
  }
  if (userMessage.includes('신고') || userMessage.includes('경찰')) {
    feedbacks.push('적절한 신고 의지를 보여주었습니다');
  }
  if (userMessage.includes('차단') || userMessage.includes('끊')) {
    feedbacks.push('단호하게 대화를 종료하려 했습니다');
  }
  if (userMessage.includes('영상통화') || userMessage.includes('만나')) {
    feedbacks.push('신원 확인을 요청했습니다');
  }
  if (userMessage.includes('의심') || userMessage.includes('수상')) {
    feedbacks.push('의심스러운 점을 놓치지 않았습니다');
  }
  if (
    userMessage.includes('안 줘') ||
    userMessage.includes('못 줘') ||
    userMessage.includes('거절')
  ) {
    feedbacks.push('금전 요청을 단호하게 거절했습니다');
  }

  if (feedbacks.length === 0) {
    feedbacks.push('스캐머의 수법에 넘어가지 않았습니다');
  }

  feedbacks.push('냉정하고 논리적으로 대응했습니다');
  feedbacks.push('스캐머가 더 이상 설득이 불가능하다고 판단했습니다');

  return feedbacks.slice(0, 4);
};

export const getGradeText = (score: number) => {
  if (score >= 90) return '완벽한 대응!';
  if (score >= 80) return '훌륭해요!';
  if (score >= 70) return '잘했어요';
  if (score >= 50) return '조금 더 주의하세요';
  return '위험해요!';
};

export const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'facebook':
      return 'f';
    case 'kakaotalk':
      return 'K';
    case 'instagram':
      return 'IG';
    case 'x':
      return 'X';
    case 'telegram':
      return 'T';
    case 'line':
      return 'L';
    case 'linkedin':
      return 'in';
    case 'tinder':
      return 'T';
    default:
      return 'SNS';
  }
};

export const generatePosts = (persona: Persona): Post[] => {
  const platform = persona.platform;

  if (['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin'].includes(platform)) {
    return [];
  }

  const basePosts: Post[] = [
    {
      id: '1',
      type: 'photo',
      content: '오늘 날씨가 정말 좋네요! 산책하기 딱 좋은 날이에요.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      likes: 127,
      comments: 23,
      time: '2시간 전',
    },
    {
      id: '2',
      type: 'status',
      content: '새로운 시작을 앞두고 설레는 마음입니다. 좋은 인연을 기다리고 있어요.',
      likes: 89,
      comments: 15,
      time: '1일 전',
    },
    {
      id: '3',
      type: 'photo',
      content: '맛있는 커피 한 잔과 함께하는 여유로운 오후',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
      likes: 234,
      comments: 41,
      time: '3일 전',
    },
  ];

  if (platform === 'instagram') {
    return basePosts.map((post) => ({
      ...post,
      type: 'photo' as const,
      image: post.image || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    }));
  }

  return basePosts;
};
