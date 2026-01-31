export function formatDate(date: Date | number | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('ko-KR');
}

export function formatDateTime(date: Date | number | string): string {
  const d = new Date(date);
  return d.toLocaleString('ko-KR');
}

export function getRiskLevel(score: number): 'safe' | 'warning' | 'danger' {
  if (score < 30) return 'safe';
  if (score < 60) return 'warning';
  return 'danger';
}

export function getRiskLevelText(level: 'safe' | 'warning' | 'danger'): string {
  switch (level) {
    case 'safe':
      return '안전';
    case 'warning':
      return '주의 필요';
    case 'danger':
      return '위험';
  }
}

export function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    love_bombing: '러브바밍',
    financial: '금전 요구',
    financial_request: '금전 요구',
    urgency: '긴급성',
    avoidance: '회피 행동',
    inconsistency: '일관성 없음',
    isolation: '고립 유도',
    sympathy: '동정심 유발',
    romance_scam: '로맨스 스캠',
    sob_story: '동정심 유발',
    future_faking: '미래 약속',
    identity: '신원 사칭',
    excuse: '회피/변명',
  };
  return names[category] || category;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
