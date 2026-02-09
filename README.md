# Enigma

> 스캠을 해독하다

AI 기반 로맨스 스캠 예방 서비스

## 주요 기능

### 종합 분석 (`/analyze`)
- 다단계 위저드 방식의 종합 스캠 분석
- 이미지 업로드 → 대화 스크린샷 → 연락처 정보 입력 → 결과 확인
- 딥페이크 + 프로필 역검색 + 대화 분석 + 사기 이력 + URL 검사를 한번에 수행
- 얼굴 감지 및 선택 기능

### 간편 검증 (`/verify`)
- URL, 전화번호, 계좌번호를 하나의 입력창에서 자동 판별
- 입력 유형에 따라 피싱/사기 이력 자동 검사

### 딥페이크 검사 (`/image-search`)
- 이미지/영상 드래그 앤 드롭 업로드
- AI 기반 딥페이크 분석
- 자동 이미지 압축

### 대화 분석 (`/chat`)
- 텍스트 대화 분석
- 스크린샷 OCR 분석
- 로맨스 스캠 패턴 탐지

### 프로필 검색 (`/profile-search`)
- 이미지 기반 역검색
- 스캐머 DB 조회

### URL 검사 (`/url`)
- 피싱 URL 탐지
- HTTPS 확인

### 사기 이력 조회 (`/fraud`)
- 전화번호/계좌번호/이메일 조회
- 신고 이력 확인

### 면역 훈련 (`/training`)
- AI 스캐머와 대화 시뮬레이션
- 플랫폼별 채팅 UI (카카오톡, 텔레그램, 인스타그램/페이스북)
- 스캠 대응력 점수 측정
- 사용된 전술 분석

### 스캠 신고
- 스캠 신고 접수
- 기존 신고 이력 확인
- AI 기반 신고 가이드 생성 (긴급 조치, 신고 절차, 유관 기관 안내)

## 기술 스택

| 분류 | 기술 |
|------|------|
| **Framework** | React 19 + Vite 6 |
| **Language** | TypeScript 5.6 |
| **Routing** | TanStack Router |
| **Data Fetching** | TanStack Query |
| **State** | Zustand 5 (persist + immer) |
| **Styling** | Emotion (CSS-in-JS) |
| **Animation** | Framer Motion, Lottie |
| **Form** | React Hook Form + Zod |
| **File Upload** | react-dropzone + browser-image-compression |
| **Lint/Format** | Biome |
| **Architecture** | Feature-Sliced Design (FSD) |

## 환경 변수

```bash
# .env.local
VITE_API_URL=http://localhost:4000
```

## 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build
```

http://localhost:3000 에서 확인

## 프로젝트 구조 (FSD)

```
src/
├── main.tsx                    # 앱 엔트리포인트
├── routeTree.gen.ts            # TanStack Router 자동 생성
│
├── routes/                     # 라우트 정의
│   ├── __root.tsx
│   ├── index.tsx               # → HomePage
│   ├── chat.tsx                # → ChatPage
│   ├── training.tsx            # → TrainingPage
│   ├── url.tsx                 # → UrlPage
│   ├── fraud.tsx               # → FraudPage
│   ├── analyze/
│   │   ├── index.tsx           # → ComprehensiveAnalyzePage
│   │   └── $id.tsx             # → AnalyzePage (동적 라우트)
│   ├── image-search/
│   │   ├── index.tsx           # → ImageSearchPage
│   │   └── result.tsx          # → ImageResultPage
│   ├── profile-search/
│   │   ├── index.tsx           # → ProfileSearchPage
│   │   └── result.tsx          # → ProfileSearchResultPage
│   └── verify/
│       ├── index.tsx           # → VerifyPage
│       └── result.tsx          # → VerifyResultPage
│
├── pages/                      # 페이지 컴포넌트
│   ├── home/
│   ├── chat/
│   ├── training/               # 플랫폼별 채팅 UI 포함
│   ├── url/
│   ├── fraud/
│   ├── verify/
│   ├── image-search/
│   ├── profile-search/
│   └── analyze/                # 다단계 위저드 컴포넌트 포함
│
├── features/                   # 비즈니스 로직 (TanStack Query hooks)
│   ├── analyze-chat/           # 대화 분석 API
│   ├── analyze-comprehensive/  # 종합 분석 API
│   ├── check-url/              # URL 검사 API
│   ├── check-fraud/            # 사기 이력 조회 API
│   ├── detect-deepfake/        # 딥페이크 분석 API
│   ├── search-profile/         # 프로필 검색 API
│   ├── immune-training/        # 면역 훈련 API
│   ├── report-scam/            # 스캠 신고 API
│   ├── verify/                 # 간편 검증 API
│   └── manage-contacts/        # 연락처 관리 (Zustand store)
│
├── entities/                   # 비즈니스 엔티티
│   ├── contact/
│   ├── analysis/
│   ├── persona/
│   └── scam-pattern/
│
└── shared/                     # 공유 인프라
    ├── api/
    │   └── client.ts           # API 클라이언트
    ├── config/
    │   └── env.ts              # 환경 변수
    ├── stores/
    │   └── themeStore.ts       # 다크 모드 (Zustand)
    ├── styles/
    │   └── theme.ts            # 테마 설정
    ├── assets/
    │   └── lottie/             # Lottie 애니메이션
    ├── lib/
    │   ├── storage.ts          # localStorage/sessionStorage
    │   └── utils.ts
    └── ui/                     # 공통 UI 컴포넌트
        ├── PageLayout/
        ├── Button/
        ├── Input/
        ├── Card/
        ├── Modal/
        ├── ImageDropzone/      # 드래그앤드롭 이미지 업로드
        └── icons/              # 아이콘 컴포넌트 (27종)
```

## 백엔드 연동

`deepfake-detector-py` 백엔드 서버가 필요합니다.

```bash
# 백엔드 실행
cd ../deepfake-detector-py
uv run python -m src.main
```
