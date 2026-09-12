import { prefersReducedMotion } from './motion'

const DURATION_MS = 1400

/** 끝으로 갈수록 느려지는 감속 곡선 */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

function readTarget(el: HTMLElement) {
  return {
    value: Number.parseFloat(el.dataset.count ?? '0'),
    decimals: Number.parseInt(el.dataset.decimals ?? '0', 10),
  }
}

function run(el: HTMLElement) {
  const { value, decimals } = readTarget(el)
  const start = performance.now()

  const tick = (now: number) => {
    const progress = Math.min((now - start) / DURATION_MS, 1)
    el.textContent = (value * easeOut(progress)).toFixed(decimals)
    if (progress < 1) requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
}

/** 통계 숫자가 화면에 들어오면 0부터 목표값까지 세어 올립니다. */
export function initCounters(): void {
  const counters = document.querySelectorAll<HTMLElement>('[data-count]')

  if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
    counters.forEach((el) => {
      const { value, decimals } = readTarget(el)
      el.textContent = value.toFixed(decimals)
    })
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        run(entry.target as HTMLElement)
        observer.unobserve(entry.target)
      }
    },
    { threshold: 0.6 },
  )

  counters.forEach((el) => observer.observe(el))
}
