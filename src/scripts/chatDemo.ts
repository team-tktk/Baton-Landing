import { prefersReducedMotion } from './motion'

const TYPING_SPEED_MS = 38
const THINKING_MS = 1400
const SOURCE_GAP_MS = 380

/**
 * 후임자 Q&A 데모.
 * 질문 타이핑, 생각 중 표시, 답변, 출처 칩을 순서대로 재생합니다.
 */
export function initChatDemo(): void {
  const root = document.querySelector<HTMLElement>('[data-chat-demo]')
  if (!root) return

  const question = root.querySelector<HTMLElement>('[data-chat-question]')
  const typed = root.querySelector<HTMLElement>('[data-chat-typed]')
  const thinking = root.querySelector<HTMLElement>('[data-chat-thinking]')
  const answer = root.querySelector<HTMLElement>('[data-chat-answer]')
  const sources = [...root.querySelectorAll<HTMLElement>('[data-chat-source]')]
  if (!question || !typed || !thinking || !answer) return

  const text = typed.dataset.text ?? ''

  let timers: number[] = []
  const wait = (ms: number) =>
    new Promise<void>((resolve) => {
      timers.push(window.setTimeout(resolve, ms))
    })
  const clearTimers = () => {
    timers.forEach(window.clearTimeout)
    timers = []
  }

  const reset = () => {
    clearTimers()
    for (const el of [question, thinking, answer, ...sources]) el.classList.remove('show')
    question.classList.remove('done')
    thinking.classList.remove('hide')
    typed.textContent = ''
  }

  const showAll = () => {
    typed.textContent = text
    question.classList.add('show', 'done')
    thinking.classList.add('hide')
    answer.classList.add('show')
    sources.forEach((el) => el.classList.add('show'))
  }

  const play = async () => {
    reset()

    if (prefersReducedMotion()) {
      showAll()
      return
    }

    await wait(300)
    question.classList.add('show')

    for (let i = 1; i <= text.length; i += 1) {
      typed.textContent = text.slice(0, i)
      await wait(TYPING_SPEED_MS)
    }
    question.classList.add('done')

    await wait(350)
    thinking.classList.add('show')
    await wait(THINKING_MS)
    thinking.classList.remove('show')
    await wait(200)
    thinking.classList.add('hide')

    answer.classList.add('show')
    for (const source of sources) {
      await wait(SOURCE_GAP_MS)
      source.classList.add('show')
    }
  }

  root.querySelector<HTMLButtonElement>('[data-chat-replay]')?.addEventListener('click', play)

  if (!('IntersectionObserver' in window)) {
    void play()
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        void play()
        observer.unobserve(entry.target)
      }
    },
    { threshold: 0.4 },
  )
  observer.observe(root)
}
