// 访问计数接口：页面加载时 POST /api/count，原子递增后返回最新值。
// 数据存于 Cloudflare D1（绑定名 DB），键为 site_pv（全站）与 page:<路径>（单页）。
// 中英文页面共用同一计数：前端会把 /en 前缀去掉后再上报路径。

const BOT_RE =
  /(bot|crawler|spider|slurp|googlebot|baiduspider|bingbot|yandexbot|duckduckbot|ia_archiver|pingdom|curl|wget|python-requests|scrapy|headless)/i;

export async function onRequestPost({ request, env }) {
  const json = (body, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    });

  // 忽略常见爬虫与命令行工具，避免计数被搜索引擎抓取刷高
  const ua = request.headers.get('user-agent') || '';
  if (BOT_RE.test(ua)) return json({ site_pv: null, page_pv: null });

  let page = null;
  try {
    const body = await request.json();
    page = typeof body.page === 'string' ? body.page.slice(0, 100) : null;
  } catch {
    /* 无 body 时仅累计全站访问量 */
  }

  const increment = async (key) => {
    const row = await env.DB.prepare(
      'INSERT INTO stats (key, value) VALUES (?1, 1) ON CONFLICT(key) DO UPDATE SET value = value + 1 RETURNING value'
    )
      .bind(key)
      .first();
    return row ? row.value : 1;
  };

  const site_pv = await increment('site_pv');
  const page_pv = page ? await increment(`page:${page}`) : null;
  return json({ site_pv, page_pv });
}
