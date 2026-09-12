// @ts-check
import { defineConfig } from 'astro/config'

// 도메인을 붙인 뒤 site 값을 실제 주소로 바꾸세요.
// sitemap과 canonical URL 생성에 쓰입니다.
export default defineConfig({
  site: 'https://baton-landing.vercel.app',
  build: {
    inlineStylesheets: 'auto',
  },
})
