-- 访问计数表：key 为计数标识（site_pv 或 page:<路径>），value 为累计值
CREATE TABLE IF NOT EXISTS stats (
  key   TEXT PRIMARY KEY,
  value INTEGER NOT NULL DEFAULT 0
);
