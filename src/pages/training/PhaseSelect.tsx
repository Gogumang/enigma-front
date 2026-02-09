import type { Persona } from '@/entities/persona';
import { ChevronLeftIcon } from '@/shared/ui/icons';
import {
  BackButton,
  DifficultyBadge,
  FullScreenContainer,
  HeaderInner,
  HeaderTitle,
  PersonaAvatar,
  PersonaCard,
  PersonaGrid,
  PersonaInfo,
  PersonaName,
  PersonaOccupation,
  PersonaSelectScreen,
  PersonaSubtitle,
  PersonaTitle,
  TopHeader,
  platformConfig,
} from './TrainingPage.styles';

interface PhaseSelectProps {
  personas: Persona[];
  onSelect: (personaId: string) => void;
}

export default function PhaseSelect({ personas, onSelect }: PhaseSelectProps) {
  return (
    <FullScreenContainer>
      <TopHeader>
        <HeaderInner>
          <BackButton to="/">
            <ChevronLeftIcon />
          </BackButton>
          <HeaderTitle>면역 훈련</HeaderTitle>
        </HeaderInner>
      </TopHeader>
      <PersonaSelectScreen>
        <PersonaTitle>사기꾼을 선택하세요</PersonaTitle>
        <PersonaSubtitle>5번의 대화를 통해 로맨스 스캠 대응력을 테스트합니다</PersonaSubtitle>
        <PersonaGrid>
          {personas.map((persona: Persona) => {
            const pConfig = platformConfig[persona.platform];
            return (
              <PersonaCard
                key={persona.id}
                onClick={() => onSelect(persona.id)}
                $platform={persona.platform}
              >
                <PersonaAvatar
                  $color={pConfig?.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}
                  $image={persona.profile_photo}
                  $platform={persona.platform}
                />
                <PersonaInfo>
                  <PersonaName>{persona.name}</PersonaName>
                  <PersonaOccupation>{persona.occupation}</PersonaOccupation>
                </PersonaInfo>
                <DifficultyBadge $level={persona.difficulty}>
                  {persona.difficulty <= 2 ? '쉬움' : persona.difficulty === 3 ? '보통' : '어려움'}
                </DifficultyBadge>
              </PersonaCard>
            );
          })}
        </PersonaGrid>
      </PersonaSelectScreen>
    </FullScreenContainer>
  );
}
