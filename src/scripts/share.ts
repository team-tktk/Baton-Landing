import { showToast } from './toast'

/**
 * 공유 버튼.
 * 모바일에서는 시스템 공유 시트를, 그 외에는 클립보드 복사를 씁니다.
 */
export function initShare(): void {
  const button = document.querySelector<HTMLButtonElement>('[data-share]')
  if (!button) return

  button.addEventListener('click', async () => {
    const url = window.location.href

    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url })
        return
      }
      await navigator.clipboard.writeText(url)
      showToast('링크를 복사했어요.')
    } catch (error) {
      // 사용자가 공유 시트를 닫은 경우는 실패로 알리지 않습니다.
      if (error instanceof DOMException && error.name === 'AbortError') return
      showToast('링크를 복사하지 못했어요.')
    }
  })
}
