import { prefersReducedMotion } from './motion'

const PARTICLE_COUNT = 55_000

const vertexShaderSource = `
  precision highp float;

  attribute vec4 aSeed;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uAspect;
  uniform float uScroll;

  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float theta = aSeed.x * 6.2831853;
    float cosPhi = aSeed.y * 2.0 - 1.0;
    float sinPhi = sqrt(max(0.0, 1.0 - cosPhi * cosPhi));
    vec3 direction = vec3(sinPhi * cos(theta), sinPhi * sin(theta), cosPhi);

    float outerLayer = step(0.72, aSeed.w);
    float windLayer = step(0.91, aSeed.w);
    float coronaLayer = outerLayer - windLayer;

    float convection =
      sin(theta * 9.0 + uTime * 0.44) +
      sin(cosPhi * 19.0 - uTime * 0.36 + aSeed.z * 6.2831853) +
      sin((theta + cosPhi) * 13.0 + uTime * 0.3);
    float coreRadius = 0.15 + pow(aSeed.z, 0.34) * 0.52 + convection * 0.011;

    float flare = 0.5 + 0.5 * sin(uTime * 0.62 + theta * 4.0 + aSeed.z * 14.0);
    float coronaRadius = 0.64 + aSeed.z * 0.22 + flare * 0.075;

    float travel = fract(aSeed.z + uTime * (0.014 + aSeed.x * 0.018));
    float windRadius = 0.76 + travel * 0.74;
    float radius = mix(coreRadius, coronaRadius, coronaLayer);
    radius = mix(radius, windRadius, windLayer);

    vec3 point = direction * radius;
    point += direction * sin(uTime * 0.9 + aSeed.x * 35.0) * coronaLayer * 0.04;

    float rotation = uTime * 0.075;
    float cosRotation = cos(rotation);
    float sinRotation = sin(rotation);
    vec3 rotated = vec3(
      point.x * cosRotation - point.z * sinRotation,
      point.y,
      point.x * sinRotation + point.z * cosRotation
    );

    float merge = smoothstep(aSeed.x * 0.16, 0.76 + aSeed.y * 0.12, uScroll);
    float contraction = smoothstep(0.0, 1.0, merge);
    rotated *= 1.0 - contraction;

    float perspective = 1.0 / max(0.68, 1.16 - rotated.z * 0.56);
    vec2 position = vec2(rotated.x / max(uAspect, 0.62), rotated.y) * perspective;
    position.y -= 0.02;
    gl_Position = vec4(position, 0.0, 1.0);

    float pulse = 0.8 + 0.2 * sin(uTime * 0.76 + aSeed.x * 24.0 + aSeed.y * 16.0);
    float layerSize = coronaLayer * 1.8 + windLayer * 0.7;
    gl_PointSize = (2.8 + aSeed.z * 4.8 + layerSize * 1.3) * uPixelRatio * pulse * (1.0 + merge * 3.2);

    vec3 paleBlue = vec3(0.5, 0.82, 1.0);
    vec3 skyBlue = vec3(0.16, 0.55, 1.0);
    vec3 deepBlue = vec3(0.035, 0.29, 0.78);
    vColor = mix(paleBlue, skyBlue, aSeed.z);
    vColor = mix(vColor, deepBlue, coronaLayer * 0.62 + windLayer * 0.38);
    vColor = mix(vColor, deepBlue, smoothstep(0.62, 1.0, merge) * 0.88);

    float windFade = 1.0 - travel;
    vAlpha = mix(0.4 + aSeed.z * 0.42, 0.58 + flare * 0.3, coronaLayer);
    vAlpha = mix(vAlpha, windFade * 0.48, windLayer);
    vAlpha *= pulse * (1.0 - smoothstep(0.76, 0.94, uScroll));
  }
`

const fragmentShaderSource = `
  precision mediump float;

  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float distanceToCenter = length(gl_PointCoord - vec2(0.5));
    float circle = 1.0 - smoothstep(0.2, 0.5, distanceToCenter);
    gl_FragColor = vec4(vColor, vAlpha * circle);
  }
`

function createShader(
  context: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = context.createShader(type)
  if (!shader) return null

  context.shaderSource(shader, source)
  context.compileShader(shader)

  if (context.getShaderParameter(shader, context.COMPILE_STATUS)) return shader
  context.deleteShader(shader)
  return null
}

function createProgram(context: WebGLRenderingContext): WebGLProgram | null {
  const vertexShader = createShader(context, context.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = createShader(context, context.FRAGMENT_SHADER, fragmentShaderSource)
  if (!vertexShader || !fragmentShader) return null

  const program = context.createProgram()
  if (!program) return null

  context.attachShader(program, vertexShader)
  context.attachShader(program, fragmentShader)
  context.linkProgram(program)
  context.deleteShader(vertexShader)
  context.deleteShader(fragmentShader)

  if (context.getProgramParameter(program, context.LINK_STATUS)) return program
  context.deleteProgram(program)
  return null
}

export function initHeroParticles(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-hero-particles]')
  const hero = canvas?.closest<HTMLElement>('[data-hero]')
  const viewport = hero?.querySelector<HTMLElement>('[data-hero-viewport]')
  const content = hero?.querySelector<HTMLElement>('[data-hero-content]')
  const brand = hero?.querySelector<HTMLElement>('[data-hero-brand]')
  const nextButton = hero?.querySelector<HTMLAnchorElement>('[data-hero-next]')
  const nav = document.querySelector<HTMLElement>('[data-nav]')
  if (!canvas || !hero || !viewport || !content || canvas.dataset.particlesReady) return

  canvas.dataset.particlesReady = 'true'
  const context = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'high-performance',
  })
  const program = context ? createProgram(context) : null

  if (!context || !program) {
    canvas.hidden = true
    nav?.classList.remove('hero-hidden')
    nav?.removeAttribute('inert')
    return
  }

  const seedBuffer = context.createBuffer()
  const seedLocation = context.getAttribLocation(program, 'aSeed')
  const timeLocation = context.getUniformLocation(program, 'uTime')
  const pixelRatioLocation = context.getUniformLocation(program, 'uPixelRatio')
  const aspectLocation = context.getUniformLocation(program, 'uAspect')
  const scrollLocation = context.getUniformLocation(program, 'uScroll')
  if (
    !seedBuffer ||
    seedLocation < 0 ||
    !timeLocation ||
    !pixelRatioLocation ||
    !aspectLocation ||
    !scrollLocation
  ) {
    canvas.hidden = true
    nav?.classList.remove('hero-hidden')
    nav?.removeAttribute('inert')
    return
  }

  const seeds = new Float32Array(PARTICLE_COUNT * 4)
  for (let index = 0; index < seeds.length; index += 1) seeds[index] = Math.random()

  context.useProgram(program)
  context.bindBuffer(context.ARRAY_BUFFER, seedBuffer)
  context.bufferData(context.ARRAY_BUFFER, seeds, context.STATIC_DRAW)
  context.enableVertexAttribArray(seedLocation)
  context.vertexAttribPointer(seedLocation, 4, context.FLOAT, false, 0, 0)
  context.enable(context.BLEND)
  context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA)
  context.disable(context.DEPTH_TEST)
  context.clearColor(0, 0, 0, 0)

  const reduceMotion = prefersReducedMotion()
  const startedAt = performance.now()
  let frame = 0
  let isVisible = true
  let targetScrollProgress = 0
  let displayedScrollProgress = 0
  let lastFrameAt = startedAt
  let autoScrollFrame = 0
  let isAutoTransitioning = false

  const blockUserScroll = (event: Event) => {
    if (isAutoTransitioning) event.preventDefault()
  }

  const blockScrollKey = (event: KeyboardEvent) => {
    if (
      isAutoTransitioning &&
      ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)
    ) {
      event.preventDefault()
    }
  }

  const startAutoTransition = () => {
    if (reduceMotion || autoScrollFrame) return
    isAutoTransitioning = true

    const startY = window.scrollY
    const heroY = hero.getBoundingClientRect().top + window.scrollY
    const animationTravel = Math.min(
      Math.max(hero.offsetHeight - viewport.clientHeight, 1),
      viewport.clientHeight * 1.2,
    )
    const endY = heroY + animationTravel
    const distance = endY - startY
    const duration = 1_550
    const transitionStartedAt = performance.now()

    const advance = (now: number) => {
      const progress = Math.min(1, (now - transitionStartedAt) / duration)
      const eased = progress * progress * (3 - 2 * progress)
      const nextY = startY + distance * eased
      window.scrollTo({ top: nextY, behavior: 'instant' })

      if (progress < 1) autoScrollFrame = window.requestAnimationFrame(advance)
      else {
        window.scrollTo(0, endY)
        autoScrollFrame = 0
        isAutoTransitioning = false
      }
    }

    autoScrollFrame = window.requestAnimationFrame(advance)
  }

  const resize = () => {
    const width = viewport.clientWidth
    const height = viewport.clientHeight
    const pixelRatio = Math.min(window.devicePixelRatio, 1.5)
    const renderWidth = Math.round(width * pixelRatio)
    const renderHeight = Math.round(height * pixelRatio)

    if (canvas.width !== renderWidth || canvas.height !== renderHeight) {
      canvas.width = renderWidth
      canvas.height = renderHeight
      context.viewport(0, 0, renderWidth, renderHeight)
    }

    context.uniform1f(pixelRatioLocation, pixelRatio)
    context.uniform1f(aspectLocation, width / Math.max(height, 1))
  }

  const updateScrollProgress = () => {
    const animationTravel = Math.min(
      Math.max(hero.offsetHeight - viewport.clientHeight, 1),
      viewport.clientHeight * 1.2,
    )
    const rawProgress = Math.max(0, -hero.getBoundingClientRect().top / animationTravel)
    targetScrollProgress = Math.min(2.1, rawProgress)

    const hideNav = targetScrollProgress < 1.18
    nav?.classList.toggle('hero-hidden', hideNav)
    nav?.toggleAttribute('inert', hideNav)

    if (reduceMotion) {
      displayedScrollProgress = targetScrollProgress
      render(performance.now())
    }
  }

  const updateContent = (progress: number) => {
    const contentFade = Math.min(1, Math.max(0, (progress - 0.08) / 0.58))
    content.style.opacity = String(1 - contentFade)
    content.style.transform =
      `translate(-50%, calc(-47% - ${contentFade * 34}px)) scale(${1 - contentFade * 0.045})`
    content.style.pointerEvents = contentFade > 0.9 ? 'none' : ''

    if (brand) {
      const brandFade = Math.min(1, Math.max(0, (progress - 0.72) / 0.28))
      const brandEased = brandFade * brandFade * (3 - 2 * brandFade)
      const brandOpacity = brandEased
      const brandIsVisible = brandOpacity > 0.02
      brand.style.opacity = String(brandOpacity)
      brand.style.visibility = brandIsVisible ? 'visible' : 'hidden'
      brand.style.pointerEvents = brandIsVisible ? 'auto' : 'none'
      brand.toggleAttribute('inert', !brandIsVisible)
      brand.style.transform =
        `translate(-50%, -50%) scale(${0.76 + brandEased * 0.24})`
    }

    if (nextButton) {
      const buttonFade = Math.min(1, progress / 0.22)
      nextButton.style.opacity = String(1 - buttonFade)
      nextButton.style.pointerEvents = buttonFade > 0.8 ? 'none' : ''
    }
  }

  const render = (now: number) => {
    frame = 0
    if (!isVisible || document.hidden) return

    const elapsed = Math.min(0.05, Math.max(0, (now - lastFrameAt) / 1000))
    lastFrameAt = now
    if (!reduceMotion) {
      const smoothing = 1 - Math.exp(-elapsed * (isAutoTransitioning ? 6.5 : 4.0))
      displayedScrollProgress += (targetScrollProgress - displayedScrollProgress) * smoothing
    }

    updateContent(displayedScrollProgress)

    context.clear(context.COLOR_BUFFER_BIT)
    context.uniform1f(timeLocation, reduceMotion ? 0 : (now - startedAt) / 1000)
    context.uniform1f(scrollLocation, displayedScrollProgress)
    context.drawArrays(context.POINTS, 0, PARTICLE_COUNT)

    if (!reduceMotion) frame = window.requestAnimationFrame(render)
  }

  const start = () => {
    if (frame || reduceMotion || document.hidden || !isVisible) return
    frame = window.requestAnimationFrame(render)
  }

  const stop = () => {
    if (frame) window.cancelAnimationFrame(frame)
    frame = 0
  }

  const observer = new IntersectionObserver(([entry]) => {
    isVisible = entry?.isIntersecting ?? false
    if (isVisible) start()
    else stop()
  })
  const resizeObserver = new ResizeObserver(() => {
    resize()
    updateScrollProgress()
  })
  const onVisibilityChange = () => {
    if (document.hidden) stop()
    else start()
  }

  resizeObserver.observe(viewport)
  observer.observe(hero)
  nextButton?.addEventListener('click', (event) => {
    if (reduceMotion) return
    event.preventDefault()
    startAutoTransition()
  })
  window.addEventListener('scroll', updateScrollProgress, { passive: true })
  window.addEventListener('wheel', blockUserScroll, { passive: false })
  window.addEventListener('touchmove', blockUserScroll, { passive: false })
  window.addEventListener('keydown', blockScrollKey)
  document.addEventListener('visibilitychange', onVisibilityChange)
  resize()
  updateScrollProgress()

  if (reduceMotion) render(startedAt)
  else start()
}
