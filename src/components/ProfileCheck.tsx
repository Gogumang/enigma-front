'use client';

import { useState } from 'react';
import styled from '@emotion/styled';

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

const Section = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #111111;
  margin: 0 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoCard = styled.div`
  background: #f7f8f9;
  border-radius: 12px;
  padding: 20px;
`;

const StepList = styled.ol`
  margin: 0;
  padding-left: 20px;
  color: #555555;
  font-size: 14px;
  line-height: 1.8;

  li {
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const Link = styled.a`
  color: #06c755;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const TipBox = styled.div`
  background: #fff8e6;
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 12px;
  font-size: 13px;
  color: #996600;
  display: flex;
  gap: 8px;
`;

const FeatureList = styled.ul`
  margin: 0;
  padding-left: 20px;
  color: #555555;
  font-size: 14px;
  line-height: 1.8;
`;

const ChecklistSection = styled.div`
  margin-top: 8px;
`;

const CheckItem = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #f7f8f9;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s;
  margin-bottom: 8px;

  &:hover {
    background: #f0f1f2;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  accent-color: #06c755;
  cursor: pointer;
`;

const CheckLabel = styled.span`
  flex: 1;
  font-size: 14px;
  color: #333333;
`;

const RiskBadge = styled.span`
  background: #ffebee;
  color: #ff334b;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
`;

const ResultBox = styled.div<{ $danger: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  margin-top: 16px;
  background: ${props => props.$danger ? '#ffebee' : '#e6f7ee'};
`;

const ResultIcon = styled.div`
  font-size: 24px;
`;

const ResultContent = styled.div`
  flex: 1;
`;

const ResultTitle = styled.div<{ $danger: boolean }>`
  font-size: 15px;
  font-weight: 600;
  color: ${props => props.$danger ? '#ff334b' : '#06c755'};
  margin-bottom: 2px;
`;

const ResultText = styled.div`
  font-size: 13px;
  color: #555555;
`;

const profileRedFlags = [
  { id: 1, text: '프로필 사진이 모델/연예인처럼 너무 완벽하다', weight: 2 },
  { id: 2, text: '사진이 1-2장밖에 없다', weight: 1 },
  { id: 3, text: '일상 사진이 없고 스튜디오 사진만 있다', weight: 2 },
  { id: 4, text: '친구/팔로워가 거의 없다', weight: 1 },
  { id: 5, text: '계정 생성 날짜가 최근이다', weight: 2 },
  { id: 6, text: '게시물이 거의 없거나 일관성이 없다', weight: 1 },
  { id: 7, text: '해외에 거주한다고 주장한다', weight: 1 },
  { id: 8, text: '영상통화를 피한다', weight: 3 },
  { id: 9, text: '만남을 계속 미룬다', weight: 2 },
  { id: 10, text: '개인정보를 많이 물어본다', weight: 2 },
];

export default function ProfileCheck() {
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  const handleCheck = (id: number) => {
    setCheckedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const calculateRisk = () => {
    return profileRedFlags
      .filter(flag => checkedItems.includes(flag.id))
      .reduce((sum, flag) => sum + flag.weight, 0);
  };

  const riskScore = calculateRisk();
  const isDanger = riskScore >= 5;

  return (
    <Card>
      <CardHeader>
        <Title>프로필 검증</Title>
        <Description>상대방의 프로필이 진짜인지 확인하는 방법을 알려드립니다.</Description>
      </CardHeader>

      <CardBody>
        <Section>
          <SectionTitle>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06c755" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            역이미지 검색으로 사진 도용 확인
          </SectionTitle>
          <InfoCard>
            <StepList>
              <li>상대방의 프로필 사진을 저장합니다.</li>
              <li>
                <Link href="https://images.google.com" target="_blank">Google 이미지</Link> 또는{' '}
                <Link href="https://tineye.com" target="_blank">TinEye</Link>에 접속합니다.
              </li>
              <li>카메라 아이콘을 클릭하고 이미지를 업로드합니다.</li>
              <li>동일 사진이 다른 이름으로 사용되는지 확인합니다.</li>
            </StepList>
            <TipBox>
              <span>💡</span>
              <span>같은 사진이 여러 SNS에서 다른 이름으로 사용된다면 도용된 사진입니다.</span>
            </TipBox>
          </InfoCard>
        </Section>

        <Section>
          <SectionTitle>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06c755" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="m21 15-5-5L5 21"/>
            </svg>
            AI 생성 이미지 특징
          </SectionTitle>
          <InfoCard>
            <FeatureList>
              <li>배경이 흐리거나 일관성이 없음</li>
              <li>귀걸이, 안경 등 액세서리가 비대칭</li>
              <li>머리카락이 부자연스럽게 융합됨</li>
              <li>손가락 개수가 이상하거나 뒤틀림</li>
              <li>피부가 너무 매끈하고 모공이 없음</li>
            </FeatureList>
          </InfoCard>
        </Section>

        <Section>
          <SectionTitle>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06c755" strokeWidth="2">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            프로필 위험 신호 체크
          </SectionTitle>
          <ChecklistSection>
            {profileRedFlags.map(flag => (
              <CheckItem key={flag.id}>
                <Checkbox
                  type="checkbox"
                  checked={checkedItems.includes(flag.id)}
                  onChange={() => handleCheck(flag.id)}
                />
                <CheckLabel>{flag.text}</CheckLabel>
                {flag.weight >= 2 && <RiskBadge>위험</RiskBadge>}
              </CheckItem>
            ))}
          </ChecklistSection>

          {checkedItems.length > 0 && (
            <ResultBox $danger={isDanger}>
              <ResultIcon>{isDanger ? '⚠️' : '✅'}</ResultIcon>
              <ResultContent>
                <ResultTitle $danger={isDanger}>
                  위험 점수: {riskScore}점
                </ResultTitle>
                <ResultText>
                  {isDanger
                    ? '가짜 프로필일 가능성이 높습니다. 주의하세요.'
                    : '아직은 괜찮지만 계속 주시하세요.'
                  }
                </ResultText>
              </ResultContent>
            </ResultBox>
          )}
        </Section>
      </CardBody>
    </Card>
  );
}
