import type { ComprehensiveResult } from '@/features/analyze-comprehensive';

// ==================== Slide Animation ====================

export const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

// ==================== Types ====================

export interface IdentifiedInfo {
  type: string;
  value: string;
  label: string;
}

export interface ScoreEntry {
  label: string;
  score: number;
  weight: number;
}

// ==================== Helpers ====================

export function getLevel(score: number): 'safe' | 'warning' | 'danger' {
  if (score < 30) return 'safe';
  if (score < 60) return 'warning';
  return 'danger';
}

export function getVerdict(score: number): string {
  if (score >= 70) return '사기 위험이 매우 높습니다';
  if (score >= 50) return '사기 가능성이 있습니다';
  if (score >= 30) return '주의가 필요합니다';
  return '현재까지 안전해 보입니다';
}

export function calculateOverallScore(entries: ScoreEntry[]): number {
  const active = entries.filter((e) => e.score >= 0);
  if (active.length === 0) return 0;
  const totalWeight = active.reduce((sum, e) => sum + e.weight, 0);
  const weightedSum = active.reduce((sum, e) => sum + e.score * e.weight, 0);
  return Math.round(weightedSum / totalWeight);
}

export function mapApiResultToStepData(result: ComprehensiveResult) {
  const deepfakeData = result.deepfake as Record<string, unknown> | null;
  const profileData = result.profile as Record<string, unknown> | null;
  const chatData = result.chat as Record<string, unknown> | null;
  const fraudData = result.fraud as {
    phone?: Record<string, unknown>;
    account?: Record<string, unknown>;
  } | null;
  const urlData = result.url as Record<string, unknown> | null;

  return { deepfakeData, profileData, chatData, fraudData, urlData };
}

export function computeScores(apiResult: ComprehensiveResult) {
  const entries: ScoreEntry[] = [];
  const { deepfakeData, profileData, chatData, fraudData, urlData } =
    mapApiResultToStepData(apiResult);

  if (deepfakeData) {
    const raw = deepfakeData.confidence as number;
    const confidence = raw > 1 ? raw : raw * 100;
    const isDeepfake = deepfakeData.isDeepfake as boolean;
    entries.push({
      label: 'AI',
      score: Math.min(100, Math.round(isDeepfake ? confidence : Math.max(0, 100 - confidence))),
      weight: 0.25,
    });
  }

  if (profileData) {
    const totalFound = (profileData.totalFound as number) ?? 0;
    const profileScore = totalFound > 10 ? Math.min(80, totalFound * 3) : totalFound > 0 ? 20 : 0;
    entries.push({ label: '프로필', score: profileScore, weight: 0.2 });
  }

  if (chatData) {
    entries.push({ label: '대화분석', score: (chatData.riskScore as number) ?? 0, weight: 0.3 });
  }

  if (fraudData) {
    const phoneDanger = (fraudData.phone?.status as string) === 'danger';
    const accountDanger = (fraudData.account?.status as string) === 'danger';
    const fraudScore = phoneDanger || accountDanger ? 100 : 0;
    entries.push({ label: '사기이력', score: fraudScore, weight: 0.15 });
  }

  if (urlData) {
    const status = urlData.status as string;
    const urlScore = status === 'danger' ? 100 : status === 'warning' ? 50 : 0;
    entries.push({ label: 'URL', score: urlScore, weight: 0.1 });
  }

  const overallScore = calculateOverallScore(entries);
  return { entries, overallScore };
}

export function collectIdentifiers(
  apiResult: ComprehensiveResult,
  contactType: string,
  contactValue: string,
): IdentifiedInfo[] {
  const infos: IdentifiedInfo[] = [];
  const val = contactValue.trim();

  if (val && contactType === 'phone') {
    infos.push({ type: 'PHONE', value: val, label: val });
  }
  if (val && contactType === 'account') {
    infos.push({ type: 'ACCOUNT', value: val, label: val });
  }
  if (val && contactType === 'url') {
    infos.push({ type: 'URL', value: val, label: val });
  }

  if (apiResult.profile) {
    const results = (apiResult.profile as Record<string, unknown>).results as
      | Record<string, Array<{ username?: string }>>
      | undefined;
    if (results) {
      for (const [platform, profiles] of Object.entries(results)) {
        for (const p of profiles) {
          if (p.username) {
            infos.push({
              type: 'SNS',
              value: `${platform}:${p.username}`,
              label: `@${p.username} (${platform})`,
            });
          }
        }
      }
    }
  }

  return infos;
}
