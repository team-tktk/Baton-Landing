const VISIBLE_MS = 2200

let hideTimer: number | undefined

/** 화면 하단에 잠깐 떠오르는 알림을 표시합니다. */
export function showToast(message: string): void {
  const toast = document.querySelector<HTMLElement>('[data-toast]')
  if (!toast) return

  toast.textContent = message
  toast.classList.add('show')

  window.clearTimeout(hideTimer)
  hideTimer = window.setTimeout(() => toast.classList.remove('show'), VISIBLE_MS)
}
