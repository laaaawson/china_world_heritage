// 图片代理：/img/<host>/<rest> → https://<host>/<rest>（host 仅限 Wikimedia）
// 解决国内网络无法直接访问 upload.wikimedia.org 导致图片不显示的问题。
// Cloudflare 边缘回源并缓存，图片一次回源后全站 CDN 分发。

const ALLOWED_HOSTS = new Set(['upload.wikimedia.org', 'thumb.wikimedia.org']);
const CACHE_TTL = 60 * 60 * 24 * 30; // 30 天

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  const rest = url.pathname.slice('/img/'.length);
  const host = rest.split('/')[0];
  if (!ALLOWED_HOSTS.has(host) || !rest.includes('/')) {
    return new Response('Forbidden', { status: 403 });
  }

  const target = `https://${rest}${url.search}`;
  const upstream = await fetch(target, {
    headers: {
      'User-Agent': 'CulturalHeritageDigitalPlatform/1.0 (open-source education project)',
      Accept: request.headers.get('Accept') || 'image/avif,image/webp,image/*,*/*;q=0.8',
    },
    cf: { cacheEverything: true, cacheTtl: CACHE_TTL },
  });

  if (!upstream.ok) {
    return new Response(`Upstream error: ${upstream.status}`, { status: upstream.status });
  }

  const res = new Response(upstream.body, upstream);
  res.headers.set('Cache-Control', `public, max-age=${CACHE_TTL}`);
  return res;
}
