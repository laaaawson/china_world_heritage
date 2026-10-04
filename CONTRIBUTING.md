# 贡献指南（Contributing）

感谢你对「中国世界文化遗产数字百科」的关注！这是一个零商业利益、完全开源的文化遗产学习与研究平台。任何人都可以通过以下方式参与共建。

## 目录

1. [贡献方式](#贡献方式)
2. [环境准备](#环境准备)
3. [内容贡献：新增/修改遗产条目](#内容贡献新增修改遗产条目)
4. [内容贡献：补充英文翻译](#内容贡献补充英文翻译)
5. [代码贡献](#代码贡献)
6. [数据纠错流程](#数据纠错流程)
7. [提交规范与 PR 流程](#提交规范与-pr-流程)
8. [协议说明](#协议说明)

---

## 贡献方式

| 类型 | 说明 | 适合人群 |
|------|------|---------|
| **数据纠错** | 发现年份、标准、坐标、面积等事实错误，提交 Issue 或 PR 修正 | 所有人 |
| **内容补充** | 新增遗产条目、深化某处遗产的历史沿革 / OUV 解读 | 历史文化爱好者 |
| **英文翻译** | 为尚未翻译的遗产条目补充 `.en.md` 翻译 | 中英双语者 |
| **代码开发** | 交互组件（地图、筛选、搜索）、SEO、性能优化 | 前端开发者 |
| **宣传推广** | 撰写文章、高校社团合作、社区推荐 | 所有人 |

## 环境准备

```bash
# 1. Fork 本仓库并克隆到本地
git clone https://github.com/<your-id>/china-world-heritage.git
cd china-world-heritage

# 2. 安装依赖并启动
npm install
npm run dev        # 本地开发 http://localhost:4321
npm run build      # 构建静态站点
```

> **本机环境注意**：若 `npm install` 报 `UNABLE_TO_GET_ISSUER_CERT_LOCALLY`，
> 需注入本机 CA 根证书：`NODE_EXTRA_CA_CERTS=$PWD/.certs/combined-ca.pem npm install`

## 内容贡献：新增/修改遗产条目

1. 在 `src/content/heritage/` 下创建 `{slug}.md`（slug 为英文短横线命名，如 `great-wall.md`）。
2. Frontmatter 字段必须遵循 `src/content.config.ts` 的 Schema，必填字段：

   | 字段 | 说明 | 示例 |
   |------|------|------|
   | `title` | 中文名 | `"长城"` |
   | `title_en` | 英文名 | `"The Great Wall"` |
   | `unesco_id` | UNESCO 官网编号 | `438` |
   | `year_inscribed` | 列入年份 | `1987` |
   | `category` | 文化遗产 / 自然遗产 / 双重遗产 | `"文化遗产"` |
   | `criteria` | 入选标准 (i)-(x) | `[i, ii, iii, iv, vi]` |
   | `province` | 所在省（直辖市） | `["北京", "河北"]` |
   | `coordinates` | [纬度, 经度] | `[40.4319, 116.5704]` |
   | `cover_image` | 封面图 URL（优先 Wikimedia Commons CC 协议图） | `https://...` |
   | `cover_source` / `cover_license` | 图片来源与版权协议（必须标注！） | `Wikimedia Commons / User:XXX` |

3. 正文结构建议（与既有条目保持一致）：

   ```markdown
   ## 前世（一）· 标题
   ## 前世（二）· 标题（可选）
   ## 今生 · 标题
   ## 价值解读（OUV）     # 逐条列出入选标准及其含义
   ## 数据快照            # 3-5 条关键数据
   ```

4. 历史时间轴（Frontmatter 中 `timeline` 字段）：3-6 个关键节点，每个节点包含
   `period`（年代）、`title`（事件标题）、`desc`（一句话描述，可空）。
5. **图片版权红线**：所有图片必须标注 `source` 与 `license`；优先使用
   Wikimedia Commons 的 CC 协议图片；不确定版权的一律不放。
6. 本地运行 `npm run build` 确认构建通过（内容校验会拦截 Schema 错误）。

## 内容贡献：补充英文翻译

1. 在 `src/content/heritage/` 下创建 `{slug}.en.md`，文件名为**英文翻译**约定后缀。
2. Frontmatter 结构：`title` 填官方英文名、`title_en` 填中文名，其余字段（坐标、
   图集、链接等）沿用中文条目；`lead`、`timeline`、正文需完整翻译。
3. 英文正文标题翻译约定：

   | 中文 | 英文 |
   |------|------|
   | `## 前世（一）· xxx` | `## The Past (I): xxx` |
   | `## 今生 · xxx` | `## The Present: xxx` |
   | `## 价值解读（OUV）` | `## Outstanding Universal Value (OUV)` |
   | `## 数据快照` | `## Facts at a Glance` |

4. 尚未翻译的遗产会在英文页面自动回退显示中文正文，并展示「英文翻译筹备中」提示条。

## 代码贡献

- 项目使用 **Astro**（内容驱动、默认零 JS）+ **Tailwind CSS v4**（Vite 插件）。
- 交互组件（地图、筛选、搜索）放在 `src/components/`，复杂交互用普通
  `<script>` 模块（勿在 Astro 内联脚本中写 TS 语法，详见项目记忆）。
- 双语文案统一维护在 `src/i18n/ui.ts`（zh/en 两栏），新增文案需同步补充。
- 提交前运行 `npm run build` 确保无构建错误。

## 数据纠错流程

1. **发现错误**：打开对应遗产详情页，页面底部「数据纠错」入口，或直接在
   GitHub 仓库提交 Issue。
2. **提交 Issue**：标题写明遗产名与问题（如「莫高窟：criteria 字段缺少标准 (iv)」），
   正文附上可靠来源（UNESCO 官网链接、官方文件等）。
3. **修复 PR**：附来源的修正可直接提 PR，维护者将优先合并。

## 提交规范与 PR 流程

- 分支命名：`feature/add-{slug}`、`fix/{slug}-{issue}`、`docs/xxx`。
- 提交信息建议用中文或英文简明描述，如 `feat: 新增西夏陵条目`、`fix: 修正莫高窟入选标准`。
- PR 步骤：Fork → 新建分支 → 修改 → 提交 → Push → 发起 PR → 维护者 Review 合并。
- 每个 PR 建议聚焦单一改动，便于快速 Review。

## 协议说明

- **代码**：MIT License（见 `LICENSE`）。
- **内容**（文字/图片）：CC BY-SA 4.0（见 `LICENSE-CONTENT`）。
- 提交内容即表示同意以上协议；引用第三方图片时必须保留原作者的版权标注。
