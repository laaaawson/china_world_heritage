# 中国世界文化遗产数字百科 (China World Cultural Heritage Digital Encyclopedia)

> 零商业利益、完全开源的「中国世界文化遗产数字百科」。
> 全景覆盖 · 严谨溯源 · 开源共建 · 零预算运行

![License: MIT](https://img.shields.io/badge/code-MIT-blue.svg)
![Content: CC BY-SA 4.0](https://img.shields.io/badge/content-CC%20BY--SA%204.0-orange.svg)
![Framework: Astro](https://img.shields.io/badge/Astro-7.3-black.svg)
![Heritage: 60](https://img.shields.io/badge/遗产-60%20处-brightgreen.svg)

详细设计与执行方案见 [PROJECT_DESIGN.md](./PROJECT_DESIGN.md)。

## 功能特性

- 🗺️ **交互地图**：按省份 / 经纬度在中国地图上打点，点击查看遗产卡片
- 📜 **多维筛选名录**：按类别 / 省份 / 年代 / 关键词筛选全部遗产
- 🔍 **全局搜索**：Ctrl+K 唤起搜索遮罩，站内全文检索
- 📖 **深度内容**：每处遗产含导语、历史时间轴、前世今生正文、OUV 价值解读、数据快照
- 🌐 **中英双语**：英文路由 `/en/` 全覆盖 60 处遗产，一键切换且保持当前页面
- 📚 **严谨溯源**：UNESCO 官方链接、遗产管理单位官网、图片 CC 版权标注
- ♿ **零预算运行**：Astro 静态输出 + Cloudflare Pages 无限带宽，部署零成本

## 项目状态

| 阶段 | 状态 | 说明 |
|------|------|------|
| Phase 0-2 | ✅ 完成 | 骨架搭建、59+ 处遗产数据、地图 / 筛选 / 搜索交互 |
| Phase 3 | ✅ 完成 | 内容深化：时间轴 + OUV + 官方链接 + 英文补译全覆盖 |
| Phase 4 | 🚧 进行中 | 社区运营：开源发布、宣传推广、贡献者激励 |

## 技术栈

| 层级 | 选型 |
|------|------|
| 框架 | [Astro](https://astro.build/)（内容驱动，默认零 JS） |
| 样式 | Tailwind CSS v4（Vite 插件） |
| 内容 | Markdown Frontmatter + Astro Content Collections |
| 部署 | Cloudflare Pages（静态输出 `dist/`） |

## 快速开始

```bash
npm install
npm run dev        # 本地开发 http://localhost:4321
npm run build      # 构建静态站点到 dist/
npm run preview    # 本地预览构建产物
```

> **本机环境注意**：若 npm 安装时报 `UNABLE_TO_GET_ISSUER_CERT_LOCALLY`，
> 需先注入本机缺失的 CA 根证书（见 `.certs/` 目录说明），命令前追加：
> `NODE_EXTRA_CA_CERTS=$PWD/.certs/combined-ca.pem npm install`

## 目录结构

```text
├── src/
│   ├── components/      # 全局 UI 组件（Header, Footer, HeritageCard）
│   ├── content/         # 【核心】遗产 Markdown 数据
│   │   ├── heritage/    # 每处遗产一个 .md 文件（great-wall.md）
│   │   └── topics/      # 科普专题
│   ├── content.config.ts # 数据模型规范（Frontmatter Schema）
│   ├── layouts/         # 页面布局模板
│   ├── pages/           # 路由（首页 / 名录 / 详情 / 专题 / 贡献）
│   └── styles/          # 全局样式与主题
├── public/              # 静态资源
├── astro.config.mjs
└── package.json
```

## 内容数据规范

每处遗产在 `src/content/heritage/` 下新建 Markdown 文件，Frontmatter 字段详见 `src/content.config.ts`，完整规范见 PROJECT_DESIGN.md §2.2。字段包括：`title`、`title_en`、`unesco_id`、`year_inscribed`、`category`、`criteria`、`province`、`coordinates`、`core_area_km2`、`buffer_area_km2`、`cover_image`、`cover_source`、`cover_license`、`unesco_link`、`official_site`。

## 中英双语（i18n）

站点支持中英双语：中文无 URL 前缀，英文使用 `/en/` 前缀，Header 右侧提供语言切换按钮（保持当前页面不变切换语言）。

- **界面文案**：统一维护在 `src/i18n/ui.ts` 双语字典，新增文案需同步补充 zh/en 两栏。
- **页面路由**：中文页与 `src/pages/[lang]/` 英文页一一对应，英文页通过 `getStaticPaths` 返回 `lang: 'en'`。
- **内容翻译**：每处遗产的英文翻译放在 `src/content/heritage/{slug}.en.md`（文件名以 `.en.md` 结尾，Frontmatter 的 `title` 填英文名、`title_en` 填中文名）。英文路由自动优先加载 `.en.md`；尚未翻译的遗产回退显示中文正文并展示"英文翻译筹备中"提示条，欢迎社区通过 PR 贡献翻译。

## 部署到 Cloudflare Pages

1. 将仓库推送到 GitHub。
2. Cloudflare 控制台 → Pages → Create a project → 连接 GitHub 仓库。
3. 构建设置：Build command = `npm run build`，Build output directory = `dist`（Node 版本由仓库根目录 `.node-version` 锁定为 22，Astro 7 需要 Node ≥ 22.12）。
4. 保存后自动部署，分配 `.pages.dev` 子域名；绑定自定义域名可选。

### 访问计数（可选）

全站访问量与单页浏览量由 `functions/api/count.js` 提供，数据存于 Cloudflare D1。

1. 创建数据库并建表（需要先 `npx wrangler login`）：

   ```bash
   npx wrangler d1 create heritage-visits   # 输出 database_id
   npx wrangler d1 execute heritage-visits --remote --file=./schema.sql
   ```

2. 把上一步的 `database_id` 填入 `wrangler.toml`（本地开发用）。
3. Cloudflare 控制台 → Pages 项目 → Settings → Bindings → Add → D1 database：变量名 `DB`，选择 `heritage-visits`，重新部署。

本地联调：`npx wrangler pages dev dist --d1 DB=heritage-visits`。

## 参与贡献

我们欢迎任何形式的贡献——数据纠错、内容补充、英文翻译、代码开发、宣传推广。

- 贡献方式与规范见 [CONTRIBUTING.md](./CONTRIBUTING.md)
- 发现数据错误请提交 [Issue](https://github.com/) 或在贡献页反馈
- 内容采用 CC BY-SA 4.0，代码采用 MIT License，见 [LICENSE](./LICENSE) 与 [LICENSE-CONTENT](./LICENSE-CONTENT)

## 开源协议

- 代码：MIT License
- 内容（文字/图片）：CC BY-SA 4.0（署名-相同方式共享）
