import * as ChannelService from '@channel.io/channel-web-sdk-loader'
import { showToast } from './toast'

type Intent = 'consult' | 'apply'

const pluginKey = import.meta.env.PUBLIC_CHANNEL_TALK_PLUGIN_KEY?.trim()

function messageFor(plan: string, intent: Intent): string {
  if (intent === 'apply') {
    return `안녕하세요. BATON ${plan} 요금제 구매를 신청하고 싶습니다. 도입 절차를 안내해 주세요.`
  }
  return `안녕하세요. BATON ${plan} 요금제 구매 상담을 받고 싶습니다.`
}

/** 요금제 카드에서 선택한 플랜과 목적을 채널톡 새 대화에 연결합니다. */
export function initChannelTalk(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-channel-intent][data-plan]')
  if (!buttons.length) return

  let bootFailed = false
  if (pluginKey) {
    ChannelService.loadScript()
    ChannelService.boot(
      { pluginKey, language: 'ko', hideChannelButtonOnBoot: true },
      (error) => {
        if (error) {
          bootFailed = true
          console.error('채널톡 연결에 실패했습니다.', error)
        }
      },
    )
  }

  for (const button of buttons) {
    button.addEventListener('click', () => {
      if (!pluginKey) {
        showToast('구매 문의 채널을 연결하는 중입니다.')
        return
      }
      if (bootFailed) {
        showToast('상담창을 열지 못했습니다. 잠시 후 다시 시도해 주세요.')
        return
      }

      const plan = button.dataset.plan
      const intent = button.dataset.channelIntent as Intent | undefined
      if (!plan || (intent !== 'consult' && intent !== 'apply')) return

      ChannelService.track(intent === 'apply' ? 'PurchaseApplyClick' : 'PurchaseConsultClick', { plan })
      ChannelService.openChat(undefined, messageFor(plan, intent))
    })
  }
}
