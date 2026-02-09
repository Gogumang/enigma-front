import { motion } from 'framer-motion';
import {
  ButtonRow,
  InputGroup,
  PrimaryButton,
  Section,
  SectionDesc,
  SectionTitle,
  SkipButton,
  Tab,
  TabRow,
  TextInput,
  UrlInputWrapper,
  UrlPrefix,
  UrlTextInput,
} from './ComprehensiveAnalyzePage.styles';
import { slideVariants } from './comprehensiveUtils';

interface StepContactInfoProps {
  direction: number;
  contactType: 'phone' | 'account' | 'url';
  contactValue: string;
  onContactTypeChange: (type: 'phone' | 'account' | 'url') => void;
  onContactValueChange: (value: string) => void;
  onNext: () => void;
}

export default function StepContactInfo({
  direction,
  contactType,
  contactValue,
  onContactTypeChange,
  onContactValueChange,
  onNext,
}: StepContactInfoProps) {
  return (
    <motion.div
      key="step3"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <Section>
        <SectionTitle>연락처 정보 확인</SectionTitle>
        <SectionDesc>확인할 정보 유형을 선택하고 입력하세요</SectionDesc>

        <TabRow>
          <Tab
            $active={contactType === 'phone'}
            onClick={() => {
              onContactTypeChange('phone');
              onContactValueChange('');
            }}
          >
            전화번호
          </Tab>
          <Tab
            $active={contactType === 'account'}
            onClick={() => {
              onContactTypeChange('account');
              onContactValueChange('');
            }}
          >
            계좌번호
          </Tab>
          <Tab
            $active={contactType === 'url'}
            onClick={() => {
              onContactTypeChange('url');
              onContactValueChange('');
            }}
          >
            URL
          </Tab>
        </TabRow>

        <InputGroup>
          {contactType === 'url' ? (
            <UrlInputWrapper>
              <UrlPrefix>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  role="img"
                  aria-label="URL"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </UrlPrefix>
              <UrlTextInput
                value={contactValue}
                onChange={(e) => onContactValueChange(e.target.value)}
                placeholder="example.com"
              />
            </UrlInputWrapper>
          ) : (
            <TextInput
              value={contactValue}
              onChange={(e) => onContactValueChange(e.target.value)}
              placeholder={contactType === 'phone' ? '01012345678' : '123-456-7890123'}
              type={contactType === 'phone' ? 'tel' : 'text'}
            />
          )}
        </InputGroup>

        <ButtonRow>
          <SkipButton onClick={onNext}>건너뛰기</SkipButton>
          <PrimaryButton
            $disabled={!contactValue.trim()}
            disabled={!contactValue.trim()}
            onClick={onNext}
          >
            분석 시작
          </PrimaryButton>
        </ButtonRow>
      </Section>
    </motion.div>
  );
}
