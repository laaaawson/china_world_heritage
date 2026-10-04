// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// 部署后替换为真实站点地址（Cloudflare Pages 会分配 *.pages.dev 子域名）
export default defineConfig({
  site: 'https://china-world-heritage.pages.dev',
  output: 'static',
  integrations: [sitemap()],
  i18n: {
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
    routing: {
      prefixDefaultLocale: false, // 中文无前缀，英文使用 /en/ 前缀
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
