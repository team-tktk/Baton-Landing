import { prefersReducedMotion } from './motion'

/**
 * .reveal 요소가 뷰포트에 들어오면 .in을 붙여 등장 연출을 시작합니다.
 * 한 번 나타난 요소는 관찰을 해제해 스크롤 비용을 줄입니다.
 */
export function initReveal(): void {
  const targets = document.querySelectorAll<HTMLElement>('.reveal')

  if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
    targets.forEach((el) => el.classList.add('in'))
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('in')
        observer.unobserve(entry.target)
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
  )

  targets.forEach((el) => observer.observe(el))
}
