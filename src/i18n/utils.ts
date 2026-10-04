import { defaultLang, ui, languages } from './ui';

export type Lang = keyof typeof languages;

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[Lang]) {
    const dict = ui[lang] ?? ui[defaultLang];
    return (dict as Record<string, string>)[key] ?? (ui[defaultLang] as Record<string, string>)[key] ?? key;
  };
}

/** 将当前页面路径切换到目标语言（中文无前缀，英文加 /en/） */
export function switchLangPath(pathname: string, from: Lang, to: Lang): string {
  const hasPrefix = pathname.startsWith('/en');
  const rest = hasPrefix ? pathname.slice(3) : pathname;
  if (to === 'en') return `/en${rest}`;
  return rest || '/';
}

export function getLanguageSelector(lang: Lang) {
  const other = lang === 'en' ? 'zh' : 'en';
  return { other, label: languages[other] };
}
