/** 900px 이하에서 .nav-links를 대신하는 패널을 엽니다. */
function initMenu(): void {
  const header = document.querySelector<HTMLElement>('[data-nav]')
  const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]')
  const menu = document.querySelector<HTMLElement>('[data-nav-menu]')
  const scrim = document.querySelector<HTMLElement>('[data-nav-scrim]')
  if (!toggle || !menu || !scrim) return

  const items = [...menu.querySelectorAll<HTMLAnchorElement>('[data-nav-menu-link]')]
  // 패널 안의 모든 링크. 섹션 링크와 맨 아래 회원가입 버튼이 함께 들어옵니다.
  const panelLinks = [...menu.querySelectorAll<HTMLAnchorElement>('a[href]')]
  const compact = window.matchMedia('(max-width: 900px)')
  let open = false

  const setOpen = (next: boolean, restoreFocus = true) => {
    if (next === open) return
    open = next

    toggle.setAttribute('aria-expanded', String(open))
    toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기')
    menu.classList.toggle('open', open)
    scrim.classList.toggle('open', open)
    header?.classList.toggle('menu-open', open)
    document.documentElement.classList.toggle('menu-open', open)

    // inert는 닫힌 패널이 탭 순서와 스크린 리더에 잡히지 않게 합니다.
    menu.toggleAttribute('inert', !open)

    if (open) items[0]?.focus()
    else if (restoreFocus) toggle.focus()
  }

  toggle.addEventListener('click', () => setOpen(!open))
  scrim.addEventListener('click', () => setOpen(false))
  for (const link of panelLinks) link.addEventListener('click', () => setOpen(false))

  document.addEventListener('keydown', (event) => {
    if (!open) return

    if (event.key === 'Escape') {
      setOpen(false)
      return
    }

    if (event.key !== 'Tab') return

    // 열려 있는 동안 초점을 버튼과 패널 링크 사이에 가둡니다.
    const focusables = [toggle, ...panelLinks]
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const active = document.activeElement

    if (event.shiftKey && active === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first?.focus()
    }
  })

  // 데스크톱 폭으로 넓어지면 .nav-links가 돌아오므로 패널을 닫습니다.
  compact.addEventListener('change', (event) => {
    if (!event.matches) setOpen(false, false)
  })
}

/**
 * 상단 내비게이션.
 * 스크롤하면 배경을 씌우고, 현재 섹션 링크로 인디케이터를 옮깁니다.
 * 900px 이하에서는 햄버거 버튼으로 섹션 링크 패널을 엽니다.
 */
export function initNav(): void {
  const nav = document.querySelector<HTMLElement>('[data-nav]')
  if (!nav) return

  initMenu()

  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]')]
  const menuLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-nav-menu-link]')]
  const indicator = document.querySelector<HTMLElement>('[data-nav-indicator]')
  const sections = links
    .map((link) => document.querySelector<HTMLElement>(link.hash))
    .filter((el): el is HTMLElement => el !== null)

  const moveIndicator = (link: HTMLAnchorElement) => {
    if (!indicator) return
    indicator.style.width = `${link.offsetWidth}px`
    indicator.style.transform = `translateX(${link.offsetLeft}px)`
    indicator.classList.add('on')
  }

  const clearIndicator = () => indicator?.classList.remove('on')

  const setActive = (id: string | null) => {
    if (id === null) {
      links.forEach((link) => link.classList.remove('active'))
      menuLinks.forEach((link) => link.classList.remove('active'))
      clearIndicator()
      return
    }
    for (const link of links) {
      const active = link.hash === `#${id}`
      link.classList.toggle('active', active)
      if (active) moveIndicator(link)
    }
    for (const link of menuLinks) link.classList.toggle('active', link.hash === `#${id}`)
  }

  const activeLink = () => links.find((link) => link.classList.contains('active'))

  for (const link of links) {
    link.addEventListener('mouseenter', () => moveIndicator(link))
    link.addEventListener('mouseleave', () => {
      const current = activeLink()
      if (current) moveIndicator(current)
      else clearIndicator()
    })
  }

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 24)

    let current: string | null = null
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= window.innerHeight * 0.4) current = section.id
    }
    setActive(current)
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', () => {
    const current = activeLink()
    if (current) moveIndicator(current)
  })
  onScroll()
}
