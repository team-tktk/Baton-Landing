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

/** 신청 정보는 채널톡 고객 프로필에 저장하고, 메신저를 열지 않습니다. */
export function initChannelTalk(): void {
  const form = document.querySelector<HTMLFormElement>('[data-application-form]')
  const dialog = document.querySelector<HTMLDialogElement>('[data-application-dialog]')
  const starts = document.querySelectorAll<HTMLButtonElement>('[data-application-start]')
  const planButtons = document.querySelectorAll<HTMLButtonElement>('[data-channel-purchase][data-plan]')
  const directButtons = document.querySelectorAll<HTMLButtonElement>('[data-channel-direct]')
  const ctaBar = document.querySelector<HTMLElement>('[data-cta-bar]')

  if (!form || !dialog || (!starts.length && !planButtons.length && !directButtons.length)) return

  const title = dialog.querySelector<HTMLElement>('[data-application-title]')
  const eyebrow = dialog.querySelector<HTMLElement>('[data-application-eyebrow]')
  const intro = dialog.querySelector<HTMLElement>('[data-application-intro]')
  const selectedPlan = dialog.querySelector<HTMLElement>('[data-application-plan]')
  const submit = dialog.querySelector<HTMLButtonElement>('[data-application-submit]')
  const closeButtons = dialog.querySelectorAll<HTMLButtonElement>('[data-application-close]')
  const formContent = dialog.querySelector<HTMLElement>('[data-application-content]')
  const complete = dialog.querySelector<HTMLElement>('[data-application-complete]')
  const completeEmail = dialog.querySelector<HTMLElement>('[data-application-complete-email]')
  const completePhone = dialog.querySelector<HTMLElement>('[data-application-complete-phone]')
  const completePhoneValue = dialog.querySelector<HTMLElement>('[data-application-complete-phone-value]')
  const completeNotice = dialog.querySelector<HTMLElement>('[data-application-complete-notice]')

  let current = {
    plan: '무료 도입',
    price: '무료 체험',
    requestType: 'trial' as RequestType,
  }
  let bootReady = false
  let bootFailed = false
  let pendingAction: (() => void) | null = null

  function saveApplication(request: PurchaseRequest): void {
    ChannelService.setPage('baton-pricing', {
      planName: request.plan,
      requestType: request.requestType,
      listedPrice: request.price,
    })
    ChannelService.updateUser({
      profile: {
        name: request.name,
        email: request.email,
        mobileNumber: request.phone || null,
        company: request.company,
        expectedUsers: request.teamSize,
        requestedPlan: request.plan,
        requestType: request.requestType,
        requestedPrice: request.price,
      },
    }, (error) => {
      if (error) {
        console.error('채널톡 신청 정보 저장에 실패했습니다.', error)
        showToast('접수하지 못했습니다. 잠시 후 다시 시도해 주세요.')
        return
      }

      ChannelService.addTags(['도입신청'], () => undefined)
      ChannelService.track(request.requestType === 'inquiry' ? 'PricingInquirySubmitted' : 'FreeTrialSubmitted', {
        plan: request.plan,
        price: request.price,
      })
      showComplete(request)
    })
  }

  function openDirectInquiry(): void {
    ChannelService.setPage('baton-pricing', {
      requestType: 'inquiry',
      entryPoint: 'sticky-cta',
    })
    ChannelService.track('PricingInquiryStart', { source: 'sticky-cta' })
    ChannelService.openChat()
  }

  function setCtaBarChatOpen(isOpen: boolean): void {
    ctaBar?.classList.toggle('channel-open', isOpen)
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
    formContent?.removeAttribute('hidden')
    complete?.setAttribute('hidden', '')

    if (title) title.textContent = requestType === 'inquiry' ? 'BATON 도입을 문의해 보세요' : 'BATON을 무료로 시작해 보세요'
    if (eyebrow) eyebrow.textContent = requestType === 'inquiry' ? '도입 문의' : '무료 도입 신청'
    if (intro) intro.textContent = requestType === 'inquiry'
      ? '필요한 정보를 남겨주시면 담당자가 맞춤 견적과 도입 절차를 안내합니다.'
      : '필요한 정보를 남겨주시면 담당자가 확인한 뒤 이메일로 안내드립니다.'
    if (selectedPlan) selectedPlan.textContent = `${plan} · ${price}`
    if (submit) submit.textContent = requestType === 'inquiry' ? '문의하기' : '신청하기'

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

  function showComplete(request: PurchaseRequest): void {
    formContent?.setAttribute('hidden', '')
    complete?.removeAttribute('hidden')
    if (completeEmail) completeEmail.textContent = request.email
    if (completePhoneValue) completePhoneValue.textContent = request.phone
    completePhone?.toggleAttribute('hidden', !request.phone)
    if (completeNotice) {
      completeNotice.textContent = request.phone
        ? '영업일 기준 24시간 이내에 이메일과 전화번호로 안내드릴게요.'
        : '영업일 기준 24시간 이내에 이메일로 안내드릴게요.'
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
        ChannelService.onShowMessenger(() => setCtaBarChatOpen(true))
        ChannelService.onHideMessenger(() => setCtaBarChatOpen(false))
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

    startChat(() => saveApplication(request))
  })
}
