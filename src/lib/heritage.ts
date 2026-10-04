import { getCollection } from 'astro:content';

/** 遗产列表（排除 .en 翻译条目，避免重复展示；按入选年份排序） */
export async function getHeritageList() {
  const all = await getCollection('heritage');
  return all
    .filter((entry) => !entry.id.endsWith('.en'))
    .sort((a, b) => a.data.year_inscribed - b.data.year_inscribed);
}
