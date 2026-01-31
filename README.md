# Enigma

> 스캠을 해독하다

AI 기반 로맨스 스캠 예방 서비스

## 주요 기능

### 딥페이크 검사기 (`/image-search`)
- 이미지/영상 드래그 앤 드롭 업로드
- AI 기반 딥페이크 분석
- 자동 이미지 압축

### 대화 분석 (`/chat`)
- 텍스트 대화 분석
- 스크린샷 분석
- 로맨스 스캠 패턴 탐지

### 프로필 검색 (`/profile-search`)
- 이미지 기반 역검색
- 스캐머 DB 조회
- 스캐머 신고

### URL 검사 (`/url`)
- 피싱 URL 탐지
- HTTPS 확인

### 사기 이력 조회 (`/fraud`)
- 전화번호/계좌번호/이메일 조회
- 신고 이력 확인

### 면역 훈련 (`/training`)
- AI 스캐머와 대화 시뮬레이션
- 스캠 대응력 점수 측정
- 사용된 전술 분석

## 기술 스택

| 분류 | 기술 |
|------|------|
| **Framework** | React 19 + Vite |
| **Language** | TypeScript |
| **Routing** | TanStack Router |
| **Data Fetching** | TanStack Query |
| **State** | Zustand (persist) |
| **Styling** | Emotion (CSS-in-JS) |
| **File Upload** | react-dropzone + browser-image-compression |
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
│   ├── profile-search.tsx      # → ProfileSearchPage
│   ├── image-search/
│   │   ├── index.tsx           # → ImageSearchPage
│   │   └── result.tsx          # → ImageResultPage
│   └── analyze/
│       └── $id.tsx             # → AnalyzePage (동적 라우트)
│
├── pages/                      # 페이지 컴포넌트
│   ├── home/
│   ├── chat/
│   ├── training/
│   ├── url/
│   ├── fraud/
│   ├── profile-search/
│   ├── image-search/
│   └── analyze/
│
├── features/                   # 비즈니스 로직 (TanStack Query hooks, Zustand stores)
│   ├── analyze-chat/           # 대화 분석 API
│   ├── check-url/              # URL 검사 API
│   ├── check-fraud/            # 사기 이력 조회 API
│   ├── detect-deepfake/        # 딥페이크 분석 API
│   ├── search-profile/         # 프로필 검색 API
│   ├── immune-training/        # 면역 훈련 API
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
        └── icons/
```

## 주요 라이브러리 사용법

### TanStack Query (데이터 페칭)
```tsx
// features/check-url/api/urlApi.ts
export function useUrlCheck() {
  return useMutation({
    mutationFn: async (url: string) => {
      return apiClient.post('/api/url/check', { url });
    },
  });
}

// 페이지에서 사용
const urlCheck = useUrlCheck();
await urlCheck.mutateAsync('https://example.com');
```

### Zustand (상태 관리)
```tsx
// features/manage-contacts/model/contactsStore.ts
export const useContactsStore = create(
  persist(
    immer((set) => ({
      contacts: [],
      addContact: (contact) => set((s) => { s.contacts.unshift(contact); }),
    })),
    { name: 'enigma-contacts' }
  )
);
```

### ImageDropzone (이미지 업로드)
```tsx
<ImageDropzone
  onFileSelect={(file) => setFile(file)}
  accept="image+video"    // 'image' 또는 'image+video'
  title="이미지를 업로드하세요"
  hint="드래그하거나 클릭"
  maxSizeMB={5}           // 초과시 자동 압축
/>
```

## 백엔드 연동

`deepfake-detector-py` 백엔드 서버가 필요합니다.

```bash
# 백엔드 실행
cd ../deepfake-detector-py
uv run python -m src.main
```

## 기존 Next.js 파일

마이그레이션 후 `src/app/`, `src/components/`, `src/lib/` 폴더의 기존 Next.js 파일들은 삭제해도 됩니다.
