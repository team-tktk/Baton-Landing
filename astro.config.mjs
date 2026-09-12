// @ts-check
import { defineConfig } from 'astro/config'

// canonical URL과 OG 이미지 주소를 만드는 데 쓰입니다.
// 운영 배포(main → S3 + CloudFront)에서는 워크플로가 SITE_URL을 넘깁니다.
// 값이 없으면 Vercel dev 배포 주소를 씁니다. Vercel이 실제로 할당한 이름이라
// baton-landing이 아니라 baton-landing-rho입니다. 지어내지 말고 대시보드의
// Domains에 찍힌 값을 그대로 쓰세요.
const site = process.env.SITE_URL ?? 'https://baton-landing-rho.vercel.app'

export default defineConfig({
  site,
  build: {
    inlineStylesheets: 'auto',
  },
})
