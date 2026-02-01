export interface Contact {
  id: string;
  name: string;
  messenger: 'kakao' | 'instagram' | 'telegram' | 'facebook' | 'x' | 'line' | 'linkedin' | 'tinder';
  createdAt: number;
}

export const messengerNames: Record<string, string> = {
  kakao: '카카오톡',
  instagram: '인스타그램',
  telegram: '텔레그램',
  facebook: '페이스북',
  x: 'X (트위터)',
  line: '라인',
  linkedin: '링크드인',
  tinder: '틴더',
};
