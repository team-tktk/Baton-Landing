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

빌드 결과인 `dist/`를 그대로 올리면 됩니다. Vercel에 연결하면 프레임워크가 Astro로 자동 인식되고 별도 설정이 필요 없습니다.

도메인을 붙인 뒤에는 두 곳을 바꿔야 합니다.

- `astro.config.mjs`의 `site`: canonical URL과 OG 이미지 주소에 쓰입니다
- `src/data/site.ts`의 `links.app`: 현재 CloudFront 주소로 되어 있습니다

## 남은 과제

`public/assets/baton-favicon.png`가 596KB, `og.png`가 1.2MB입니다. 파비콘은 32px 정도면 충분하니 줄이는 편이 좋습니다.
