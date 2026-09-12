/** 사용자가 모션 최소화를 켰는지 확인합니다. */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** 마우스처럼 정밀한 포인터를 쓰는 환경인지 확인합니다. */
export function hasFinePointer(): boolean {
  return window.matchMedia('(pointer: fine)').matches
}
