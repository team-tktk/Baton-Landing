import * as ChannelService from '@channel.io/channel-web-sdk-loader'
import { showToast } from './toast'

const pluginKey = import.meta.env.PUBLIC_CHANNEL_TALK_PLUGIN_KEY?.trim()

interface Purchase {
  plan: string
  price: string
}

function messageFor({ plan, price }: Purchase): string {
  if (price.includes('원') && !price.includes('구축비')) {
    return `안녕하세요. BATON ${plan} (${price}/월) 구매를 검토 중입니다. 사용 규모에 맞는 견적과 계약·결제 절차를 안내해 주세요.`
  }
  return `안녕하세요. BATON ${plan} 도입을 검토 중입니다. 요구사항 확인부터 맞춤 견적과 계약 절차까지 안내해 주세요.`
}

/** 요금제 카드의 구매 버튼을 플랜별 채널톡 구매 대화에 연결합니다. */
export function initChannelTalk(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-channel-purchase][data-plan]')
  if (!buttons.length) return

  let bootReady = false
  let bootFailed = false
  let pendingPurchase: Purchase | null = null

  function openPurchase(purchase: Purchase): void {
    ChannelService.track('PurchaseStart', { plan: purchase.plan, price: purchase.price })
    ChannelService.openChat(undefined, messageFor(purchase))
  }

  if (pluginKey) {
    ChannelService.loadScript()
    ChannelService.boot(
      { pluginKey, language: 'ko', hideChannelButtonOnBoot: true },
      (error) => {
        if (error) {
          bootFailed = true
          pendingPurchase = null
          console.error('채널톡 연결에 실패했습니다.', error)
          showToast('상담창을 열지 못했습니다. 잠시 후 다시 시도해 주세요.')
          return
        }

        bootReady = true
        if (pendingPurchase) {
          openPurchase(pendingPurchase)
          pendingPurchase = null
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
      const price = button.dataset.planPrice
      if (!plan || !price) return
      const purchase = { plan, price }

      if (!bootReady) {
        pendingPurchase = purchase
        showToast('구매 안내 채널을 연결하고 있습니다.')
        return
      }
      openPurchase(purchase)
    })
  }
}
