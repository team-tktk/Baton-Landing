const pad = (value: number) => String(value).padStart(2, '0')

/** 히어로를 지나면 하단 CTA 바를 올립니다. */
function initVisibility(bar: HTMLElement) {
  const hero = document.querySelector<HTMLElement>('[data-hero]')
  if (!hero) {
    bar.classList.add('show')
    return
  }

  const update = () => {
    const passedHero = hero.getBoundingClientRect().bottom < window.innerHeight * 0.55
    bar.classList.toggle('show', passedHero)
  }

  window.addEventListener('scroll', update, { passive: true })
  update()
}

/** 파일럿 모집 마감까지 남은 시간을 1초마다 갱신합니다. */
function initCountdown(bar: HTMLElement) {
  const output = bar.querySelector<HTMLElement>('[data-countdown]')
  const deadline = new Date(bar.dataset.deadline ?? '')
  if (!output || Number.isNaN(deadline.getTime())) return

  const render = () => {
    const remaining = deadline.getTime() - Date.now()

    if (remaining <= 0) {
      output.textContent = '마감되었어요'
      window.clearInterval(timer)
      return
    }

    const days = Math.floor(remaining / 86_400_000)
    const hours = Math.floor((remaining % 86_400_000) / 3_600_000)
    const minutes = Math.floor((remaining % 3_600_000) / 60_000)
    const seconds = Math.floor((remaining % 60_000) / 1000)
    output.textContent = `${days}일 ${pad(hours)}시간 ${pad(minutes)}분 ${pad(seconds)}초`
  }

  const timer = window.setInterval(render, 1000)
  render()
}

export function initCtaBar(): void {
  const bar = document.querySelector<HTMLElement>('[data-cta-bar]')
  if (!bar) return

  initVisibility(bar)
  initCountdown(bar)
}
