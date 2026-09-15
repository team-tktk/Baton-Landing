import type { IconName } from '@/components/icons'

/**
 * 랜딩 페이지 문구와 수치.
 * 사업계획서와 피칭 자료 기준입니다. 내용 수정은 이 파일에서만 하면 됩니다.
 */

export interface NavLink {
  href: string
  label: string
}

export const navLinks: NavLink[] = [
  { href: '#problem', label: '문제 인식' },
  { href: '#solution', label: '솔루션' },
  { href: '#features', label: '기능' },
  { href: '#pricing', label: '요금제' },
  { href: '#roadmap', label: '로드맵' },
]

export const tickerItems = [
  '회의록',
  '메일',
  '주간 보고',
  '업무 매뉴얼',
  '정산 시트',
  '계약서',
  '슬랙 스레드',
  '위키',
]

export interface Stat {
  /** 카운트업 대상 숫자 */
  count: number
  /** 소수점 자릿수 */
  decimals?: number
  /** 숫자 앞에 붙는 문구 */
  prefix?: string
  /** 숫자 뒤에 붙는 단위 */
  suffix: string
  label: string
  source: string
  sourceUrl?: string
}

export const stats: Stat[] = [
  {
    count: 13,
    suffix: '일',
    label: '이직 시 인수인계와 업무 정리에 쓰는 평균 기간',
    source: '인크루트 직장인 1,450명 조사',
    sourceUrl: 'https://people.incruit.com/news/popupnewsprint.asp?newsno=1244330',
  },
  {
    count: 70,
    suffix: '%',
    label: '정보 검색·관리 업무에 시간을 쓴다고 답한 국내 직장인',
    source: 'Dropbox·YouGov 한국 직장인 조사, 2025',
    sourceUrl: 'https://stock.mk.co.kr/news/view/811873',
  },
  {
    count: 28.7,
    decimals: 1,
    suffix: '%',
    label: '입사 후 1년 안에 회사를 떠나는 신규 입사자',
    source: '사람인 기업 1,124개사 조사 · 다우오피스HR',
    sourceUrl: 'https://hr.daouoffice.com/blog/new-hire-onboarding-program-guide',
  },
]

export interface Quote {
  role: string
  context: string
  title: string
  text: string
  impact: string
  image: string
  imageAlt: string
}

export const quotes: Quote[] = [
  {
    role: '재무·운영 담당자',
    context: '월말 정산 인계',
    title: '문서는 남았지만, 판단 기준은 남지 않았습니다',
    text: '파일은 받았지만 어떤 거래를 예외 처리했는지 알 수 없어 전임자에게 다시 연락해야 했습니다.',
    impact: '마감 직전 재확인 · 업무 지연',
    image: '/images/problem/finance-handover-v2.jpg',
    imageAlt: '늦은 저녁 노트북 옆 정산 자료를 검토하는 손',
  },
  {
    role: '프로젝트 매니저',
    context: '담당자 교체',
    title: '필요한 자료를 찾는 일부터 다시 시작합니다',
    text: '회의록과 메일이 여러 도구에 흩어져 있어 업무의 전체 맥락을 파악하는 데 며칠이 걸렸습니다.',
    impact: '자료 재탐색 · 중복 정리',
    image: '/images/problem/project-handover-v2.jpg',
    imageAlt: '회의 테이블 위에 흘어진 업무 자료를 정리하는 손',
  },
  {
    role: '고객지원 팀 리드',
    context: '반복 문의 대응',
    title: '사람이 떠나면 질문의 답도 함께 사라집니다',
    text: '매뉴얼에 없는 고객 대응 맥락은 담당자가 나간 뒤 누구도 확실하게 답하지 못했습니다.',
    impact: '답변 품질 저하 · 의사결정 정체',
    image: '/images/problem/support-handover-v2.jpg',
    imageAlt: '노트북으로 고객 문의에 답하며 메모하는 손',
  },
]

export const legacySteps = [
  '흩어진 자료를 다시 모아 문서 작성',
  '빠진 업무 맥락을 구두로 설명',
  '반복 질문에 전임자가 직접 응답',
]

export const batonSteps = [
  '회의록·메일·문서를 그대로 업로드',
  'AI가 업무 맥락을 구조화해 초안 생성',
  '담당자는 빠진 내용만 검수·보완',
  '후임자는 출처 기반 AI Q&A',
]

export interface Feature {
  icon: IconName
  step: string
  title: string
  description: string
}

export const features: Feature[] = [
  {
    icon: 'upload',
    step: 'STEP 1',
    title: '자료 업로드',
    description: '회의록, 메일, 보고서를 그대로 올리면 돼요. 새로 정리할 필요가 없어요.',
  },
  {
    icon: 'spark',
    step: 'STEP 2',
    title: 'AI 초안 자동 생성',
    description: 'AI가 자료를 분석해 업무 범위와 프로세스를 구조화한 인수인계 초안을 만들어요.',
  },
  {
    icon: 'shield',
    step: 'STEP 3',
    title: '검수 · 보완 후 공유',
    description: '빠진 정보는 AI가 먼저 물어보고, 팀장은 체크리스트로 검토·승인해요.',
  },
  {
    icon: 'chat',
    step: 'STEP 4',
    title: '후임자 AI Q&A',
    description: '후임자가 질문하면 전달받은 자료에서 출처와 함께 답해요. 다시 물어볼 필요가 없어요.',
  },
]

/** 채팅 데모에서 재생되는 대화. */
export const chatDemo = {
  room: '운영팀 · 정산 업무 인수인계',
  question: '월말 정산 보고서는 누구에게, 언제까지 보내야 하나요?',
  sources: ['2026-07 정산 보고 메일.eml', '운영팀 업무 매뉴얼.docx'],
  guarantees: [
    '인수인계별 검색 범위 제한',
    '유사도 임계값 미만이면 답변 보류',
    '답변마다 문서 출처 표시',
  ],
}

export interface ComparisonRow {
  label: string
  others: string
  baton: string
}

export const comparison: ComparisonRow[] = [
  { label: '주요 시장', others: '해외 기업', baton: '국내 B2B' },
  { label: '도입 방식', others: '기존 업무 시스템 연동', baton: '파일 업로드 중심' },
  { label: '자료 생성', others: 'AI 인터뷰 + 업무 도구', baton: '업로드 후 자동 생성' },
  { label: '전임자 역할', others: 'AI 인터뷰 응답', baton: '생성 내용 검수 · 보완' },
]

export interface Plan {
  name: string
  price: string
  unit?: string
  featured?: boolean
  badge?: string
  items: string[]
  extra: string
}

export const plans: Plan[] = [
  {
    name: 'Starter',
    price: '149,000원',
    unit: '/ 월',
    featured: true,
    badge: '파일럿 추천',
    items: [
      '사용자 10명 · 월 인수인계 5건',
      'AI 문서 분석 · 보완 질문 · 초안 생성',
      '출처 기반 후임자 Q&A',
    ],
    extra: '초과 시 인수인계 1건당 15,000원',
  },
  {
    name: 'Business',
    price: '490,000원',
    unit: '/ 월',
    items: [
      '사용자 30명 · 월 인수인계 20건',
      '검토 체크리스트 · 댓글 · 수정 요청 · 승인',
      '우선 지원',
    ],
    extra: '초과 시 1건당 12,000원 또는 협의',
  },
  {
    name: 'Enterprise Cloud',
    price: '별도 견적',
    items: ['사용자 · 처리량 확대', '전용 지원 · 보안 검토', 'SLA 보장 · 연간 계약'],
    extra: '연간 계약 기준',
  },
  {
    name: 'Private / On-premise',
    price: '구축비 + 유지보수비',
    items: ['사내망 설치', '전용 DB · 스토리지 · LLM 연결', '운영 지원'],
    extra: '별도 협의',
  },
]

export interface RoadmapPhase {
  period: string
  title: string
  items: string[]
  current?: boolean
}

export const roadmap: RoadmapPhase[] = [
  {
    period: '2026 Q3',
    title: 'MVP 개발 · PoC 준비',
    items: ['페인포인트 검증', '서비스 구조 설계'],
    current: true,
  },
  {
    period: '2026 Q4',
    title: '파일럿 운영 · 고도화',
    items: ['초기 기업 PoC 확보', '피드백 반영 및 개선'],
  },
  {
    period: '2027 Q1',
    title: 'PoC 확대 · 사업화 준비',
    items: ['기업 PoC 확대', '창업지원사업 연계'],
  },
  {
    period: '2027 Q2',
    title: '정식 출시 · 고객 확장',
    items: ['유료 고객 확보', 'B2B 영업 확대'],
  },
]
