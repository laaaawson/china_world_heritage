// 访问计数接口：页面加载时 POST /api/count，原子递增后返回最新值。
// 数据存于 Cloudflare D1（绑定名 DB）：
//   site_pv        全站访问量（每次加载 +1）
//   site_uv        独立访客数（首次访问 +1，用 uv_id Cookie 去重，同浏览器一年内不重复计）
//   page:<路径>    单页浏览量（中英文页面共用同一计数，前端会去掉 /en 前缀）
// 不存储任何个人身份信息，Cookie 仅含随机 ID，专用于访客去重。

const BOT_RE =
  /(bot|crawler|spider|slurp|googlebot|baiduspider|bingbot|yandexbot|duckduckbot|ia_archiver|pingdom|curl|wget|python-requests|scrapy|headless)/i;

const UV_COOKIE = 'uv_id';
const UV_TTL_SECONDS = 365 * 24 * 60 * 60;

export async function onRequestPost({ request, env }) {
  const json = (body, extraHeaders = {}) =>
    new Response(JSON.stringify(body), {
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...extraHeaders },
    });

  // 忽略常见爬虫与命令行工具，避免计数被搜索引擎抓取刷高
  const ua = request.headers.get('user-agent') || '';
  if (BOT_RE.test(ua)) return json({ site_pv: null, page_pv: null, site_uv: null });

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
  const read = async (key) => {
    const row = await env.DB.prepare('SELECT value FROM stats WHERE key = ?1').bind(key).first();
    return row ? row.value : 0;
  };

  const site_pv = await increment('site_pv');
  const page_pv = page ? await increment(`page:${page}`) : null;

  // 独立访客去重：无 uv_id Cookie 视为新访客，计数并下发随机 ID
  const cookies = request.headers.get('cookie') || '';
  const isNewVisitor = !cookies.split(';').some((c) => c.trim().startsWith(`${UV_COOKIE}=`));

  if (isNewVisitor) {
    const site_uv = await increment('site_uv');
    return json(
      { site_pv, page_pv, site_uv },
      {
        'set-cookie': `${UV_COOKIE}=${crypto.randomUUID()}; Path=/; Max-Age=${UV_TTL_SECONDS}; HttpOnly; SameSite=Lax`,
      }
    );
  }

  const site_uv = await read('site_uv');
  return json({ site_pv, page_pv, site_uv });
}
