import * as ChannelService from '@channel.io/channel-web-sdk-loader'
import { showToast } from './toast'

const pluginKey = import.meta.env.PUBLIC_CHANNEL_TALK_PLUGIN_KEY?.trim()

type RequestType = 'trial' | 'inquiry'

interface PurchaseRequest {
  plan: string
  price: string
  requestType: RequestType
  company: string
  name: string
  email: string
  phone: string
  teamSize: string
}

function messageFor(request: PurchaseRequest): string {
  const intro = request.requestType === 'inquiry'
    ? `안녕하세요. BATON ${request.plan} 도입을 문의드립니다.`
    : `안녕하세요. BATON ${request.plan} 무료 도입을 신청합니다.`

  return [
    intro,
    '',
    `회사명: ${request.company}`,
    `담당자: ${request.name}`,
    `업무용 이메일: ${request.email}`,
    `연락처: ${request.phone || '미입력'}`,
    `예상 사용자 수: ${request.teamSize}`,
    `표시 요금: ${request.price}`,
  ].join('\n')
}

/** 신청폼에서 확인한 정보를 채널톡 새 상담의 입력란에 미리 채웁니다. */
export function initChannelTalk(): void {
  const form = document.querySelector<HTMLFormElement>('[data-application-form]')
  const dialog = document.querySelector<HTMLDialogElement>('[data-application-dialog]')
  const starts = document.querySelectorAll<HTMLButtonElement>('[data-application-start]')
  const planButtons = document.querySelectorAll<HTMLButtonElement>('[data-channel-purchase][data-plan]')
  const directButtons = document.querySelectorAll<HTMLButtonElement>('[data-channel-direct]')

  if (!form || !dialog || (!starts.length && !planButtons.length && !directButtons.length)) return

  const title = dialog.querySelector<HTMLElement>('[data-application-title]')
  const eyebrow = dialog.querySelector<HTMLElement>('[data-application-eyebrow]')
  const intro = dialog.querySelector<HTMLElement>('[data-application-intro]')
  const selectedPlan = dialog.querySelector<HTMLElement>('[data-application-plan]')
  const submit = dialog.querySelector<HTMLButtonElement>('[data-application-submit]')
  const closeButtons = dialog.querySelectorAll<HTMLButtonElement>('[data-application-close]')

  let current = {
    plan: '무료 도입',
    price: '무료 체험',
    requestType: 'trial' as RequestType,
  }
  let bootReady = false
  let bootFailed = false
  let pendingAction: (() => void) | null = null

  function openChat(request: PurchaseRequest): void {
    ChannelService.setPage('baton-pricing', {
      planName: request.plan,
      requestType: request.requestType,
      listedPrice: request.price,
    })
    ChannelService.track(request.requestType === 'inquiry' ? 'PricingInquiryStart' : 'FreeTrialStart', {
      plan: request.plan,
      price: request.price,
    })
    ChannelService.openChat(undefined, messageFor(request))
  }

  function openDirectInquiry(): void {
    ChannelService.setPage('baton-pricing', {
      requestType: 'inquiry',
      entryPoint: 'sticky-cta',
    })
    ChannelService.track('PricingInquiryStart', { source: 'sticky-cta' })
    ChannelService.openChat(undefined, '안녕하세요. BATON 도입을 문의드립니다. 요금제와 도입 절차를 안내해 주세요.')
  }

  function startChat(action: () => void): void {
    if (!pluginKey) {
      showToast('상담 채널이 아직 연결되지 않았습니다. 잠시 후 다시 시도해 주세요.')
      return
    }
    if (bootFailed) {
      showToast('상담창을 열지 못했습니다. 잠시 후 다시 시도해 주세요.')
      return
    }
    if (!bootReady) {
      pendingAction = action
      showToast('상담 채널을 연결하고 있습니다.')
      return
    }

    action()
  }

  function openForm(plan: string, price: string, requestType: RequestType): void {
    current = { plan, price, requestType }
    form!.reset()

    if (title) title.textContent = requestType === 'inquiry' ? 'BATON 도입을 문의해 보세요' : 'BATON을 무료로 시작해 보세요'
    if (eyebrow) eyebrow.textContent = requestType === 'inquiry' ? '도입 문의' : '무료 도입 신청'
    if (intro) intro.textContent = requestType === 'inquiry'
      ? '필요한 정보를 남겨주시면 담당자가 맞춤 견적과 도입 절차를 안내합니다.'
      : '필요한 정보를 먼저 확인한 뒤, 채널톡에서 도입 상담을 이어갑니다.'
    if (selectedPlan) selectedPlan.textContent = `${plan} · ${price}`
    if (submit) submit.textContent = requestType === 'inquiry' ? '채널톡에서 문의하기' : '채널톡에서 계속하기'

    if (typeof dialog!.showModal === 'function') {
      dialog!.showModal()
    } else {
      dialog!.setAttribute('open', '')
    }
  }

  function closeForm(): void {
    if (typeof dialog!.close === 'function') {
      dialog!.close()
    } else {
      dialog!.removeAttribute('open')
    }
  }

  if (pluginKey) {
    ChannelService.loadScript()
    ChannelService.boot(
      { pluginKey, language: 'ko', hideChannelButtonOnBoot: true },
      (error) => {
        if (error) {
          bootFailed = true
          pendingAction = null
          console.error('채널톡 연결에 실패했습니다.', error)
          showToast('상담창을 열지 못했습니다. 잠시 후 다시 시도해 주세요.')
          return
        }

        bootReady = true
        if (pendingAction) {
          pendingAction()
          pendingAction = null
        }
      },
    )
  }

  for (const button of starts) {
    button.addEventListener('click', () => {
      const requestType = button.dataset.applicationIntent === 'inquiry' ? 'inquiry' : 'trial'
      openForm('무료 도입', '무료 체험', requestType)
    })
  }

  for (const button of planButtons) {
    button.addEventListener('click', () => {
      const plan = button.dataset.plan
      const price = button.dataset.planPrice
      const requestType = button.dataset.channelIntent
      if (!plan || !price || (requestType !== 'trial' && requestType !== 'inquiry')) return
      openForm(plan, price, requestType)
    })
  }

  for (const button of directButtons) {
    button.addEventListener('click', () => startChat(openDirectInquiry))
  }

  for (const button of closeButtons) {
    button.addEventListener('click', closeForm)
  }

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeForm()
  })

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    if (!form.reportValidity()) return

    const values = new FormData(form)
    const request: PurchaseRequest = {
      ...current,
      company: String(values.get('company') ?? '').trim(),
      name: String(values.get('name') ?? '').trim(),
      email: String(values.get('email') ?? '').trim(),
      phone: String(values.get('phone') ?? '').trim(),
      teamSize: String(values.get('teamSize') ?? '').trim(),
    }

    closeForm()
    startChat(() => openChat(request))
  })
}
