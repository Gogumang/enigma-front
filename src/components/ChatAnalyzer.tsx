'use client';

import { useState } from 'react';
import styled from '@emotion/styled';
import { scamPatterns, categoryNames } from '@/lib/scamPatterns';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e5e5;
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 24px 24px 0;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #111111;
  margin: 0 0 8px;
`;

const Description = styled.p`
  color: #888888;
  font-size: 14px;
  margin: 0;
`;

const CardBody = styled.div`
  padding: 24px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 160px;
  padding: 16px;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.15s, box-shadow 0.15s;
  background: #f7f8f9;

  &:focus {
    outline: none;
    border-color: #06c755;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(6, 199, 85, 0.1);
  }

  &::placeholder {
    color: #aaaaaa;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 16px;
  margin-top: 16px;
  background: #06c755;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #05b54d;
  }

  &:active {
    background: #04a344;
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const ResultContainer = styled.div`
  margin-top: 24px;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const RiskMeter = styled.div`
  margin-bottom: 20px;
`;

const RiskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const RiskLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #555555;
`;

const RiskScore = styled.span<{ $score: number }>`
  font-size: 14px;
  font-weight: 700;
  color: ${props =>
    props.$score < 30 ? '#06c755' :
    props.$score < 60 ? '#ff9500' :
    '#ff334b'
  };
`;

const RiskBar = styled.div`
  height: 8px;
  background: #f2f2f2;
  border-radius: 4px;
  overflow: hidden;
`;

const RiskFill = styled.div<{ $score: number }>`
  height: 100%;
  width: ${props => props.$score}%;
  background: ${props =>
    props.$score < 30 ? '#06c755' :
    props.$score < 60 ? '#ff9500' :
    '#ff334b'
  };
  transition: width 0.5s ease;
  border-radius: 4px;
`;

const DetectedSection = styled.div`
  background: #f7f8f9;
  border-radius: 12px;
  padding: 16px;
`;

const DetectedTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 12px;
`;

const DetectedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DetectedItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
`;

const Badge = styled.span<{ $category: string }>`
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  margin-right: 12px;
  background: ${props => {
    switch (props.$category) {
      case 'love_bombing': return '#fff0f3';
      case 'financial': return '#fff8e6';
      case 'urgency': return '#ffebee';
      case 'isolation': return '#f3e8ff';
      case 'identity': return '#e8f4ff';
      case 'excuse': return '#fff5eb';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.$category) {
      case 'love_bombing': return '#ff334b';
      case 'financial': return '#ff9500';
      case 'urgency': return '#ff334b';
      case 'isolation': return '#9333ea';
      case 'identity': return '#4d73ff';
      case 'excuse': return '#ff6b00';
      default: return '#666666';
    }
  }};
`;

const Keyword = styled.span`
  font-size: 14px;
  color: #333333;
  flex: 1;
`;

const Weight = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #ff334b;
`;

const Summary = styled.div<{ $level: string }>`
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  margin-top: 16px;
  background: ${props =>
    props.$level === 'safe' ? '#e6f7ee' :
    props.$level === 'warning' ? '#fff8e6' :
    '#ffebee'
  };
`;

const SummaryIcon = styled.div`
  font-size: 20px;
  flex-shrink: 0;
`;

const SummaryText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #333333;
`;

const AISection = styled.div`
  margin-top: 16px;
  background: #f0f4ff;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #d0d8ff;
`;

const AISectionTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #4d73ff;
  margin: 0 0 12px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const AIText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: #333333;
  white-space: pre-wrap;
`;

const WarningSignsList = styled.ul`
  margin: 12px 0 0;
  padding-left: 20px;
`;

const WarningSignItem = styled.li`
  font-size: 13px;
  color: #ff334b;
  line-height: 1.6;
  margin-bottom: 4px;
`;

const RecommendationsList = styled.ul`
  margin: 12px 0 0;
  padding-left: 20px;
`;

const RecommendationItem = styled.li`
  font-size: 13px;
  color: #06c755;
  line-height: 1.6;
  margin-bottom: 4px;
`;

interface AnalysisResult {
  score: number;
  detected: Array<{
    keyword: string;
    category: string;
    weight: number;
    stage: number;
  }>;
  aiAnalysis?: string;
  warningSigns?: string[];
  recommendations?: string[];
}

export default function ChatAnalyzer() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeChat = async () => {
    if (!text.trim()) return;

    setLoading(true);

    // 로컬 패턴 분석
    const detected: AnalysisResult['detected'] = [];
    let totalScore = 0;

    scamPatterns.forEach(pattern => {
      if (text.includes(pattern.keyword)) {
        detected.push({
          keyword: pattern.keyword,
          category: pattern.category,
          weight: pattern.weight,
          stage: pattern.stage,
        });
        totalScore += pattern.weight;
      }
    });

    const normalizedScore = Math.min(100, Math.round(totalScore * 2));

    // 백엔드 AI 분석 호출
    try {
      const messages = text.split('\n').filter(line => line.trim());
      const response = await fetch(`${API_URL}/api/chat/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        const aiScore = data.data.riskScore || 0;
        const combinedScore = Math.min(100, Math.round((normalizedScore + aiScore) / 2));

        setResult({
          score: combinedScore > 0 ? combinedScore : normalizedScore,
          detected: detected.sort((a, b) => b.weight - a.weight),
          aiAnalysis: data.data.aiAnalysis,
          warningSigns: data.data.warningSigns,
          recommendations: data.data.recommendations,
        });
      } else {
        setResult({
          score: normalizedScore,
          detected: detected.sort((a, b) => b.weight - a.weight),
        });
      }
    } catch {
      // 백엔드 연결 실패 시 로컬 분석 결과만 사용
      setResult({
        score: normalizedScore,
        detected: detected.sort((a, b) => b.weight - a.weight),
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (score: number) => {
    if (score < 30) return 'safe';
    if (score < 60) return 'warning';
    return 'danger';
  };

  const getRiskText = (score: number) => {
    if (score < 30) return '안전';
    if (score < 60) return '주의';
    return '위험';
  };

  const getSummaryContent = (score: number, detectedCount: number) => {
    if (score < 30) {
      return {
        icon: '✓',
        text: detectedCount === 0
          ? '위험 패턴이 감지되지 않았습니다. 하지만 항상 경계를 유지하세요.'
          : '일부 패턴이 감지되었지만 심각한 수준은 아닙니다. 계속 주시해주세요.'
      };
    }
    if (score < 60) {
      return {
        icon: '!',
        text: '여러 의심스러운 패턴이 감지되었습니다. 상대방의 의도를 주의 깊게 살펴보세요.'
      };
    }
    return {
      icon: '!!',
      text: '높은 위험도가 감지되었습니다. 로맨스 스캠일 가능성이 높습니다. 금전 요구에 절대 응하지 마세요.'
    };
  };

  return (
    <Card>
      <CardHeader>
        <Title>대화 분석</Title>
        <Description>카카오톡, DM 등의 대화 내용을 붙여넣으면 위험도를 분석해드립니다.</Description>
      </CardHeader>

      <CardBody>
        <TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="대화 내용을 붙여넣으세요..."
        />

        <Button onClick={analyzeChat} disabled={!text.trim() || loading}>
          {loading ? 'AI 분석 중...' : '분석하기'}
        </Button>

        {result && (
          <ResultContainer>
            <RiskMeter>
              <RiskHeader>
                <RiskLabel>위험도</RiskLabel>
                <RiskScore $score={result.score}>
                  {result.score}점 · {getRiskText(result.score)}
                </RiskScore>
              </RiskHeader>
              <RiskBar>
                <RiskFill $score={result.score} />
              </RiskBar>
            </RiskMeter>

            {result.detected.length > 0 && (
              <DetectedSection>
                <DetectedTitle>감지된 패턴 {result.detected.length}개</DetectedTitle>
                <DetectedList>
                  {result.detected.map((item, index) => (
                    <DetectedItem key={index}>
                      <Badge $category={item.category}>
                        {categoryNames[item.category]}
                      </Badge>
                      <Keyword>"{item.keyword}"</Keyword>
                      <Weight>+{item.weight}</Weight>
                    </DetectedItem>
                  ))}
                </DetectedList>
              </DetectedSection>
            )}

            <Summary $level={getRiskLevel(result.score)}>
              <SummaryIcon>
                {getSummaryContent(result.score, result.detected.length).icon === '✓' ? '✅' :
                 getSummaryContent(result.score, result.detected.length).icon === '!' ? '⚠️' : '🚨'}
              </SummaryIcon>
              <SummaryText>
                {getSummaryContent(result.score, result.detected.length).text}
              </SummaryText>
            </Summary>

            {result.aiAnalysis && (
              <AISection>
                <AISectionTitle>
                  <span>🤖</span> AI 분석 결과
                </AISectionTitle>
                <AIText>{result.aiAnalysis}</AIText>

                {result.warningSigns && result.warningSigns.length > 0 && (
                  <>
                    <AISectionTitle style={{ marginTop: '16px', color: '#ff334b' }}>
                      <span>⚠️</span> 주의 신호
                    </AISectionTitle>
                    <WarningSignsList>
                      {result.warningSigns.map((sign, idx) => (
                        <WarningSignItem key={idx}>{sign}</WarningSignItem>
                      ))}
                    </WarningSignsList>
                  </>
                )}

                {result.recommendations && result.recommendations.length > 0 && (
                  <>
                    <AISectionTitle style={{ marginTop: '16px', color: '#06c755' }}>
                      <span>💡</span> 권장 사항
                    </AISectionTitle>
                    <RecommendationsList>
                      {result.recommendations.map((rec, idx) => (
                        <RecommendationItem key={idx}>{rec}</RecommendationItem>
                      ))}
                    </RecommendationsList>
                  </>
                )}
              </AISection>
            )}
          </ResultContainer>
        )}
      </CardBody>
    </Card>
  );
}
