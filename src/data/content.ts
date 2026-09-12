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
  { href: '#problem', label: '문제' },
  { href: '#solution', label: '솔루션' },
  { href: '#features', label: '기능' },
  { href: '#pricing', label: '요금제' },
  { href: '#roadmap', label: '로드맵' },
]

export interface Proof {
  value: string
  label: string
}

export const heroProof: Proof[] = [
  { value: '4단계', label: '업로드부터 Q&A까지' },
  { value: '0회', label: '다시 정리하는 문서' },
  { value: '출처 표시', label: '모든 AI 답변에' },
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
}

export const stats: Stat[] = [
  {
    count: 34.2,
    decimals: 1,
    suffix: '만 명',
    label: '육아휴직·출산휴가 등 상시 발생하는 업무 공백',
    source: '고용노동부, 2026',
  },
  {
    count: 18.3,
    decimals: 1,
    suffix: '%',
    label: '업무의 AI 전환을 시작한 국내 사업체',
    source: '한국고용정보원, 2024',
  },
  {
    count: 3,
    prefix: '5명 중 ',
    suffix: '명',
    label: '기존 자료를 다시 찾거나 정리했다고 답한 현직자',
    source: '현직자 인터뷰, 2026.08',
  },
]

export interface Quote {
  initial: string
  text: string
}

export const quotes: Quote[] = [
  { initial: 'A', text: '회의록, 메일, 성과 정리를 매번 다시 합니다.' },
  { initial: 'B', text: '자료가 여러 곳에 흩어져 있어 찾는 데 시간이 많이 들어요.' },
  { initial: 'C', text: '업무 맥락을 설명하고, 빠진 내용을 계속 다시 알려줘요.' },
]

export const legacySteps = ['전임자 직접 설명', '자료 재탐색 · 재정리', '후임자 질문 반복 대응']

export const batonSteps = [
  '기존 자료 업로드',
  'AI 인수인계 자동 생성',
  '검수 · 보완 후 공유',
  '후임자 AI Q&A',
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
  cta: '무료로 시작하기' | '도입 문의'
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
    cta: '무료로 시작하기',
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
    cta: '무료로 시작하기',
  },
  {
    name: 'Enterprise Cloud',
    price: '별도 견적',
    items: ['사용자 · 처리량 확대', '전용 지원 · 보안 검토', 'SLA 보장 · 연간 계약'],
    extra: '연간 계약 기준',
    cta: '도입 문의',
  },
  {
    name: 'Private / On-premise',
    price: '구축비 + 유지보수비',
    items: ['사내망 설치', '전용 DB · 스토리지 · LLM 연결', '운영 지원'],
    extra: '별도 협의',
    cta: '도입 문의',
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
