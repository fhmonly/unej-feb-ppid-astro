export type I18nDict = Record<Locale, Record<string, any>>
export const LOCALES = ["en", "id"] as const
export type Locale = typeof LOCALES[number];
export const DEFAULT_LOCALE: Locale = "en"
export const languages = [
    { code: "en", name: "English(USA)" },
    { code: "id", name: "Indonesia" },
]

type Prev = [never, 0, 1, 2, 3, 4, 5];

export type NestedKey<
    T,
    D extends number = 5
> = [D] extends [never]
    ? never
    : T extends Record<string, any>
    ? {
        [K in keyof T & string]:
        | K
        | `${K}.${NestedKey<T[K], Prev[D]>}`;
    }[keyof T & string]
    : never;

export function useI18n<
    D,
    L extends keyof D & string
>(dict: D, locale: L) {
    return (key: NestedKey<D[L]>): string =>
        key
            .split(".")
            .reduce<any>((acc, k) => acc?.[k], dict[locale]) ?? key;
}

export function getLocaleLink(locale: string, link: string): string {
    if (link.startsWith('http')) return link
    if (link.startsWith('/')) return `/${locale}${link}`
    return '/' + link
}

export function generateMultiLocaleStaticPaths<
    T extends Record<string, string>
>(items: T[] = []) {
    return items.length
        ? items.flatMap(item =>
            LOCALES.map(lang => ({
                params: { lang, ...item }
            }))
        )
        : LOCALES.map(lang => ({
            params: { lang }
        }))
}


export function switchLocalePath(
    currentPath: string,
    targetLocale: Locale
): string {
    // external link → return as-is
    if (currentPath.startsWith('http')) return currentPath

    const segments = currentPath.split('/').filter(Boolean)

    // remove existing locale segment if present
    if (LOCALES.includes(segments[0] as Locale)) {
        segments.shift()
    }

    // default locale without prefix (optional behavior)
    if (targetLocale === DEFAULT_LOCALE) {
        return '/' + segments.join('/')
    }

    return '/' + [targetLocale, ...segments].join('/')
}
