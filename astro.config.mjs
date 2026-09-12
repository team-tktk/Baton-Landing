// @ts-check
import { defineConfig } from 'astro/config'

// canonical URL과 OG 이미지 주소를 만드는 데 쓰입니다.
// 운영 배포(main → S3 + CloudFront)에서는 워크플로가 SITE_URL을 넘깁니다.
// 값이 없으면 Vercel에 올라가는 dev 주소를 씁니다.
const site = process.env.SITE_URL ?? 'https://baton-landing.vercel.app'

export default defineConfig({
  site,
  build: {
    inlineStylesheets: 'auto',
  },
})
