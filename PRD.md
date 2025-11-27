# Project Requirements Document (PRD): 고정지출 관리 웹앱 (Fixed Cost Manager)

## 1. 프로젝트 개요
- **목표:** 매달 발생하는 고정 지출을 기록하고 리스트로 확인하는 모바일 친화적 웹 애플리케이션.
- **현재 단계:** MVP (최소 기능 제품) - 알림 기능 제외, 데이터 저장 및 조회 중심.

## 2. 기술 스택 (Tech Stack)
- **Build Tool:** Vite (React + TypeScript)
- **Styling:** Tailwind CSS v4+
- **UI Component:** Shadcn-UI (Radix UI 기반)
- **Backend/DB:** Supabase (Auth, Postgres Database)
- **Deployment:** Vercel
- **Linting/Formatting:** ESLint, Prettier

## 3. 기능 명세 (Feature Specifications)

### 3.1 인증 (Authentication)
- Supabase Auth를 사용한다.
- **Provider:** Kakao (OAuth)
- 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트된다.
- 로그인 성공 시 메인 대시보드로 이동한다.

### 3.2 고정지출 관리 (Expense Management)
- **지출 등록 (Create):**
  - 서비스명 (예: 넷플릭스)
  - 금액 (원화, 숫자만 입력)
  - 결제일 (매월 1~31일 중 선택)
  - 카테고리 (구독, 공과금, 할부 등 - 옵션)
- **지출 목록 조회 (Read):**
  - 등록된 지출을 카드 형태의 리스트로 보여준다.
  - 상단에 '총 월 고정지출 합계'를 표시한다.
- **지출 삭제 (Delete):**
  - 리스트 아이템에서 삭제 버튼을 통해 데이터를 삭제한다.

## 4. 데이터베이스 스키마 (Database Schema)

### Table: `expenses`
| Column Name | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid | Primary Key, default: `gen_random_uuid()` |
| `user_id` | uuid | Foreign Key to `auth.users`, Not Null |
| `service_name` | text | 서비스 이름 (Not Null) |
| `amount` | integer | 금액 (Not Null) |
| `payment_day` | integer | 결제일 (1~31) (Not Null) |
| `category` | text | 카테고리 (Nullable) |
| `created_at` | timestamptz | 생성일, default: `now()` |

- **RLS (Row Level Security):**
  - 사용자는 자신의 데이터(`user_id`가 일치하는 행)만 `SELECT`, `INSERT`, `DELETE` 할 수 있어야 함.

## 5. 개발 로드맵 (Development Phases)

AI는 아래 순서에 따라 작업을 진행해야 한다.

### Phase 1: 초기화 및 패키지 설치
- Vite로 React + TypeScript 프로젝트 생성 (`.`)
- Tailwind CSS 및 PostCSS 설정
- `tsconfig.json`에서 path alias(`@/*`) 설정
- Shadcn-UI 초기화 (`npx shadcn-ui@latest init`)
- 필요 패키지 설치:
  - `@supabase/supabase-js`
  - `lucide-react` (아이콘)
  - `react-router-dom` (라우팅)

### Phase 2: 환경 설정 및 유틸리티
- `.env.local` 파일 템플릿 생성 (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- `lib/supabase.ts` 클라이언트 생성
- `eslint`, `prettier` 설정 파일 구성 및 스크립트 추가

### Phase 3: 기본 UI 및 기능 구현
- 해당 서비스는 웹/앱이야.
- mobile로 구현이 되어야 하고, Min width = 350px / Max width = 500px로 고정할거야.
- 그리고 추가적으로 vite/PWA 설정을 할 거야. 해당 설정을 해서 모바일에서 설치해서 사용할 수 있게 할 거야. 
- 기본적인 UI 스탠스 -> 한국 토스 기업과 같은 깔끔한 디자인 + 색깔 계열은 토스 색깔에서 조금 붉은 색깔 example #df6464b6
- Topbar구현 - Service Title : Fixed Expenses
- Shadcn 컴포넌트 설치 (`button`, `input`, `card`, `form`, `label` 등)
- 페이지 구조:
  - `/login`: 카카오 로그인 버튼 + 진짜 실제 앱과 같이 로그인 되도록 해줘
  - `/`: 메인 대시보드 (지출 목록 + 총합 + 추가 버튼)
- 기능 구현:
  - Supabase 연동 로직 (데이터 fetch, insert)
  - RLS 정책을 포함한 SQL 스크립트 제공 (사용자가 Supabase 대시보드에서 실행할 것)


### Phase 4: 서비스 고도화
- 해당 서비스의 고도화 버전은 가계부야
- 가계부 서비스의 기능들을 리서치하고 해당 기능들을 넣어줘
- 기능에 필요한 sql 문을 만들어줘 supabase SQL Editor로 생성이 가능하게
- 이러한 가계부 서비스들을 관리하기 위한 마이페이지를 만들어줘
- 경쟁력 있는 가계부면서도 되게 심플할 수 있게 리서치를 하고, 해당 기능들을 적용시켜줘
- 디자인의 베이스는 토스야. 토스처럼 깔끔한 디자인을 만들어줘.