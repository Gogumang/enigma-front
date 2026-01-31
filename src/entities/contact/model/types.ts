export interface Contact {
  id: string;
  name: string;
  messenger: 'kakao' | 'instagram' | 'telegram' | 'facebook';
  createdAt: number;
}

export const messengerNames: Record<string, string> = {
  kakao: '카카오톡',
  instagram: '인스타그램',
  telegram: '텔레그램',
  facebook: '페이스북',
};
