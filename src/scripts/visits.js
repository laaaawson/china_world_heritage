// 访问计数：页面加载后 POST /api/count，把返回的访问量写入 data-visit 元素。
// 全站元素 data-visit="site"（页脚），单页元素 data-visit="page"（遗产页头部）。
const isZh = document.documentElement.lang === 'zh-CN';
const fmt = (n) => {
  if (n >= 100000000) return (n / 100000000).toFixed(1) + (isZh ? '亿' : 'm');
  if (n >= 10000) return (n / 10000).toFixed(1) + (isZh ? '万' : 'k');
  return n.toLocaleString();
};

const siteEl = document.querySelector('[data-visit="site"]');
const pageEl = document.querySelector('[data-visit="page"]');

if (siteEl || pageEl) {
  // 中英文页面共用同一计数：去掉 /en 前缀后按遗产路径累计
  const page = pageEl ? location.pathname.replace(/^\/en(?=\/)/, '') : null;

  fetch('/api/count', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ page }),
    cache: 'no-store',
  })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      if (!d) return;
      if (siteEl && d.site_pv) siteEl.textContent = fmt(d.site_pv);
      if (pageEl && d.page_pv) pageEl.textContent = fmt(d.page_pv);
    })
    .catch(() => {
      /* 计数失败不影响页面 */
    });
}
