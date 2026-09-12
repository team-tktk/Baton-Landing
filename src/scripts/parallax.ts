import { hasFinePointer, prefersReducedMotion } from './motion'

/** 히어로 위에서 마우스를 움직이면 일러스트가 따라 기울어집니다. */
export function initParallax(): void {
  const stage = document.querySelector<HTMLElement>('[data-parallax-stage]')
  const target = document.querySelector<HTMLElement>('[data-parallax-target]')
  if (!stage || !target || prefersReducedMotion() || !hasFinePointer()) return

  let frame = 0

  stage.addEventListener('mousemove', (event) => {
    const rect = stage.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5

    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      target.style.transform = `perspective(1200px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg) translate3d(${x * 10}px, ${y * 10}px, 0)`
    })
  })

  stage.addEventListener('mouseleave', () => {
    cancelAnimationFrame(frame)
    target.style.transition = 'transform .6s cubic-bezier(.22, 1, .36, 1)'
    target.style.transform = ''
    window.setTimeout(() => {
      target.style.transition = ''
    }, 600)
  })
}
