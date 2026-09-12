/**
 * 사이트 전역 설정.
 * 외부 링크와 마감일은 이 파일 한 곳에서만 관리합니다.
 */
export const site = {
  name: 'BATON',
  title: 'BATON | AI 기반 인수인계 자동화 서비스',
  description:
    '흩어진 업무 자료를 올리면 AI가 인수인계 문서를 만들고, 후임자의 질문에 출처와 함께 답합니다. 끊김 없는 업무, BATON.',
  ogTitle: 'BATON | 업무는 남기고, 인수인계는 자동으로.',
  ogDescription: '자료 업로드 한 번으로 인수인계 문서 생성부터 후임자 AI Q&A까지.',
  ogImage: '/assets/og.png',
  favicon: '/assets/baton-favicon.png',
  logo: '/assets/batontouch-icon.png',
  heroImage: '/assets/baton-hero-flow.svg',
  team: 'Team 티키타카',
  event: '2026 UNITHON',
} as const

/** 외부 링크. 도메인을 붙이면 appUrl부터 교체하세요. */
export const links = {
  app: 'https://d1rk2gzucjdf8h.cloudfront.net',
  demo: 'https://youtu.be/kYfPx_gCE-E',
  github: 'https://github.com/team-tktk',
} as const

/** 하단 CTA 바 카운트다운 마감 시각. */
export const pilotDeadline = '2026-10-31T23:59:59+09:00'
