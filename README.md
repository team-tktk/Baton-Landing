# Baton-Landing

BATON 서비스 소개 랜딩 페이지입니다. Astro로 만든 정적 사이트라 빌드 결과물이 순수 HTML과 CSS이고, 프레임워크 런타임을 브라우저로 내려보내지 않습니다.

## 실행

```bash
npm install
```

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버를 4321 포트에 띄웁니다 |
| `npm run build` | `dist/`에 정적 파일을 만듭니다 |
| `npm run preview` | 빌드 결과를 그대로 확인합니다 |
| `npm run check` | 타입과 템플릿을 검사합니다 |

## 기여

`dev`에서 브랜치를 따서 `dev`로 PR을 올립니다. 브랜치 이름, 커밋 형식, 작업 흐름은 [CONTRIBUTING.md](CONTRIBUTING.md)에 있습니다.

## 구조

```
src/
├─ pages/index.astro        페이지 조립. 섹션 순서만 정합니다
├─ layouts/BaseLayout.astro HTML 뼈대, 메타 태그, 전역 스타일
├─ components/              섹션별 컴포넌트. 마크업과 스타일이 한 파일에 있습니다
│  ├─ Section.astro         섹션 공통 껍데기. 번호 배지와 제목을 받습니다
│  ├─ Icon.astro            인라인 SVG 아이콘
│  └─ icons.ts              아이콘 경로 정의
├─ data/
│  ├─ site.ts               외부 링크, 메타 정보, 파일럿 마감일
│  └─ content.ts            섹션별 문구와 수치
├─ scripts/                 기능별 동작 모듈
└─ styles/                  토큰, 리셋, 공용 유틸, 키프레임
```

## 스타일 규칙

컴포넌트의 `<style>`은 Astro가 자동으로 스코프를 씌웁니다. 다른 컴포넌트에는 영향을 주지 않습니다. 네 가지만 기억하면 됩니다.

- 여러 컴포넌트가 함께 쓰는 클래스는 `src/styles/utilities.css`에 둡니다. 버튼, `.reveal`, 섹션 껍데기가 여기 있습니다.
- `@keyframes`는 `src/styles/animations.css`에만 둡니다. 스코프 블록 안에 두면 Astro가 이름을 바꿔 참조가 깨집니다.
- 자식 컴포넌트가 그린 요소를 겨냥할 때는 `:global()`로 감쌉니다. 예를 들어 `.pill :global(svg)`입니다.
- 색은 컴포넌트에 hex로 쓰지 않고 `src/styles/tokens.css`의 변수를 씁니다. 맞는 토큰이 없으면 토큰을 먼저 추가합니다. 예외는 ChatDemo의 맥OS 창 버튼 3색뿐입니다.

## 반응형

브레이크포인트는 네 단뿐입니다. 새 값을 만들지 말고 이 중에서 골라 쓰세요. 전체 목록은 `src/styles/tokens.css` 맨 아래에 주석으로 있습니다.

| 폭 | 하는 일 |
| --- | --- |
| `1000px` | 4칸 카드 그리드가 2칸으로 |
| `900px` | 좌우 2단 레이아웃이 1단으로 |
| `720px` | 섹션 여백 축소, 3칸이 1칸으로 |
| `560px` | 모바일 미세 조정 |

값이 고르지 않은 건 칸 수가 달라서입니다. 4칸을 1000px에서, 3칸을 720px에서 접어야 카드 한 장의 폭이 양쪽 다 210px 안팎으로 비슷하게 남습니다.

2단 레이아웃은 한쪽만 `minmax`로 고정하지 마세요. 고정된 쪽은 끝까지 버티고 반대쪽이 그만큼 줄어들어, 접히기 직전 구간에서 글이 눌립니다. 양쪽 모두 하한을 주면 줄어드는 폭을 나누어 가집니다.

## 배포

브랜치마다 가는 곳이 다릅니다.

| 브랜치 | 환경 | 어디로 | 무엇이 배포하나 |
| --- | --- | --- | --- |
| `dev` | 개발 | Vercel | Vercel Git 연동이 자동으로 |
| `main` | 운영 | S3 + CloudFront | `.github/workflows/deploy.yml` |

`vercel.json`이 `main`의 Vercel 배포를 꺼두었습니다. 운영은 CloudFront 한 곳만 바라보게 하려는 것입니다. Vercel 대시보드에서 Production Branch를 `dev`로 맞춰주세요.

### dev 배포는 색인되지 않습니다

`vercel.json`이 모든 응답에 `X-Robots-Tag: noindex, nofollow`를 붙입니다. Vercel은 Preview 배포에만 `noindex`를 자동으로 붙이는데, 우리는 `dev`를 Production Branch로 지정해서 자동 처리가 안 되기 때문입니다. 그대로 두면 운영 도메인과 같은 내용이 두 주소로 색인되어 중복 콘텐츠가 됩니다.

`public/robots.txt`로 막으면 안 됩니다. 그건 빌드 산출물이라 CloudFront에도 함께 올라가 **운영까지 색인에서 빠집니다.** Vercel만 읽는 `vercel.json`으로 처리해야 하는 이유입니다.

### 랜딩은 전용 버킷과 배포를 씁니다

실서비스(`src/data/site.ts`의 `links.app`)와 **버킷도 배포도 공유하지 않습니다.** 랜딩 전용을 따로 둡니다.

```
baton.co.kr       → 랜딩 배포     → 랜딩 전용 버킷
app.baton.co.kr   → 실서비스 배포 → 실서비스 버킷
```

아래 업로드 단계가 버킷 루트에 `--delete`를 겁니다. 실서비스와 버킷을 공유하면 랜딩을 배포할 때 실서비스 파일이 지워집니다. CloudFront는 배포 개수로 과금하지 않으니 나눠도 비용은 같습니다.

한 배포에 오리진을 둘 붙여 경로로 나누는 구성도 가능하지만, 그때는 `--delete` 범위를 프리픽스로 좁혀야 합니다. 지금 워크플로는 전용 버킷을 전제로 합니다.

### 운영 배포가 하는 일

`main`에 푸시되면 검사와 빌드를 하고, OIDC로 AWS 역할을 맡아 S3에 올린 뒤 CloudFront 캐시를 무효화합니다. 수동으로 다시 돌리려면 Actions 탭에서 Deploy 워크플로를 실행하면 됩니다.

업로드는 세 번에 나눠 합니다. 파일마다 캐시 수명이 달라야 하기 때문입니다.

| 대상 | Cache-Control |
| --- | --- |
| `_astro/` 해시 번들 | `max-age=31536000, immutable` |
| `*.html` | `no-cache` |
| 나머지 정적 파일 | `max-age=86400` |

`aws s3 sync`는 바뀌지 않은 파일을 건너뛰면서 메타데이터도 함께 건너뜁니다. 그래서 한 번에 올리고 덮어쓰는 대신 겹치지 않는 세 집합으로 쪼갰습니다. 순서를 바꾸거나 합치면 캐시 헤더가 엉킵니다.

`public/`의 이미지는 이름이 고정이라 하루 캐시입니다. `og.png`처럼 이름을 그대로 두고 내용만 바꾸면 최대 하루 동안 예전 것이 보일 수 있습니다.

### 리포에 등록해야 하는 값

Secrets (Settings → Secrets and variables → Actions)

| 이름 | 값 |
| --- | --- |
| `AWS_ROLE_ARN` | GitHub OIDC를 신뢰하는 IAM 역할 ARN |
| `AWS_S3_BUCKET` | 운영 버킷 이름 |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | 운영 배포 ID |

Variables

| 이름 | 값 |
| --- | --- |
| `AWS_REGION` | 버킷이 있는 리전 |
| `SITE_URL` | 운영 도메인. 예: `https://baton.co.kr` |
| `CHANNEL_TALK_PLUGIN_KEY` | 채널톡 데스크에서 발급한 웹 플러그인 키. 신청폼 이후 상담 연결에 사용 |

Vercel 쪽에도 같은 이름의 변수를 Production 환경에 넣어두었습니다. 값은 Vercel이 할당한 `https://baton-landing-rho.vercel.app`입니다. 변수가 없으면 `astro.config.mjs`의 폴백이 같은 주소를 쓰므로 이중 안전장치입니다.

`SITE_URL`은 `astro.config.mjs`의 `site`로 들어가 canonical URL과 OG 이미지 주소를 만듭니다. 값이 없으면 Vercel 주소로 빌드되므로, 워크플로가 빌드 직후 canonical이 운영 도메인인지 확인하고 아니면 실패시킵니다.

`src/data/site.ts`의 `links.app`은 서비스 앱 주소라 배포와 별개입니다. 앱 도메인이 바뀌면 여기도 같이 고쳐주세요.

### 채널톡 도입 상담

히어로와 하단 CTA의 `무료로 도입하기`는 요금제 섹션으로 이동합니다. Starter·Business의 `무료로 시작하기`, Enterprise Cloud·Private / On-premise의 `문의하기`는 사이트 신청폼을 먼저 엽니다. 회사명·담당자명·업무용 이메일·예상 사용자 수를 필수로 받고 연락처는 선택으로 둡니다. 제출한 정보는 채널톡 고객 프로필에 저장되고, 완료 화면에서 영업일 기준 24시간 내 연락 안내를 표시합니다. 메신저는 열리지 않습니다.

하단 CTA의 문의 아이콘은 신청폼을 거치지 않고 빈 채널톡 채팅창을 바로 엽니다.

사이트는 상담 페이지를 `baton-pricing`으로 설정하고 `planName`, `requestType`, `listedPrice`를 함께 전달합니다. `requestType`은 무료 도입일 때 `trial`, 맞춤 견적일 때 `inquiry`입니다. 신청폼 제출 시 고객 프로필과 `FreeTrialSubmitted` 또는 `PricingInquirySubmitted` 이벤트가 기록됩니다.

채널톡 데스크에서는 워크플로우 없이도 다음 기본 설정으로 운영할 수 있습니다.

1. `설정 → 상담 → 태그`에서 `무료 도입`, `가격 문의`, `Starter`, `Business`, `Enterprise` 태그를 만듭니다.
2. `설정 → 상담 → 팀`에서 영업/도입 상담 담당팀을 정하고, 새 상담 알림을 해당 팀에 연결합니다.
3. 상담 프로필의 `requestType`, `planName`, `listedPrice`와 첫 메시지의 회사·담당자·사용자 수를 기준으로 태그와 담당자를 지정합니다.
4. 반복 답변은 개인/팀 매크로로 등록해 견적, 계약, 결제 절차를 빠르게 안내합니다. 필요해진 뒤에만 `고객 → 서포트 → 워크플로우`에서 조건 분기나 자동 응답을 추가하면 됩니다.

공식 도움말: [채널톡 웹 SDK](https://developers.channel.io/en/articles/ChannelIO-0b119290), [태그 관리](https://docs.channel.io/help/ko/articles/5a5314d8), [워크플로우 만들기](https://docs.channel.io/help/ko/articles/a497fa44-%EC%9B%8C%ED%81%B4%EB%A1%9C%EC%9A%B0-%EC%83%9D%EC%84%B1%ED%95%98%EA%B8%B0)

로컬에서는 `.env`에 `PUBLIC_CHANNEL_TALK_PLUGIN_KEY=플러그인키`를 넣고 개발 서버를 다시 시작하세요. 운영 배포는 위 GitHub Actions Variable `CHANNEL_TALK_PLUGIN_KEY`를 빌드할 때 읽습니다. Vercel 개발 배포에도 `PUBLIC_CHANNEL_TALK_PLUGIN_KEY`를 환경 변수로 등록해야 동일하게 동작합니다. 플러그인 키가 없으면 채널톡 SDK를 부트하지 않고 버튼에 준비 중 안내가 표시됩니다.

## 남은 과제

`public/assets/batontouch-icon.png`가 167KB입니다. 내비게이션에서 40px로 그려지는데 원본이 640px라 40배쯤 큽니다.

`public/assets/baton-handover-preview.png`는 450KB인데 `src/` 어디에서도 참조되지 않습니다. 쓰는 곳이 없으면 지워도 됩니다.

이미지를 새로 넣을 때는 화면에 그려지는 크기의 2배 정도로 맞춰주세요. OG 이미지는 1200×675, 파비콘은 128×128을 쓰고 있습니다.
