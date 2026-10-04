import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 数据模型规范（docs/PROJECT_DESIGN.md §2.2）
 * 每处遗产一个 Markdown 文件，Frontmatter 使用统一 YAML 结构。
 */
const heritage = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/heritage',
    // 保留原始文件名作为 id（如 great-wall.en），否则点号会被 slugger 移除导致翻译文件无法识别
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    // 基础信息
    title: z.string(),
    title_en: z.string(),
    unesco_id: z.number(),
    year_inscribed: z.number(),
    category: z.enum(['文化遗产', '自然遗产', '双重遗产']),
    criteria: z.array(z.string()),

    // 地理与空间
    province: z.array(z.string()),
    coordinates: z.array(z.number()).length(2), // [纬度, 经度]
    core_area_km2: z.number().optional(),
    buffer_area_km2: z.number().optional(),

    // 媒体与版权
    cover_image: z.string().url().optional(),
    cover_source: z.string().optional(),
    cover_license: z.string().optional(),

    // 图集（每处遗产的多张配图）
    gallery: z
      .array(
        z.object({
          image: z.string().url(),
          caption: z.string().optional(),
          source: z.string().optional(),
          license: z.string().optional(),
        })
      )
      .optional()
      .default([]),

    // 历史沿革时间线
    timeline: z
      .array(
        z.object({
          period: z.string(),
          title: z.string(),
          desc: z.string().optional(),
        })
      )
      .optional()
      .default([]),

    // 导语（详情页正文开头的引子，双语文件各自提供对应语言文本）
    lead: z.string().optional().default(''),

    // 溯源与链接
    unesco_link: z.string().url().optional(),
    official_site: z.string().url().optional(),

    // 精选推荐（首页展示）
    featured: z.boolean().optional().default(false),
  }),
});

const topics = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/topics' }),
  schema: z.object({
    title: z.string(),
    order: z.number().optional().default(0),
  }),
});

export const collections = { heritage, topics };
