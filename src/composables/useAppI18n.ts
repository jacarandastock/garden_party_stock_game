export function useAppI18n() {
    const { locale, availableLocales } = useI18n()
    const userLocale = useStorage('userLocale', 'en')
    function onToggleLocale(lang: string) {
        locale.value = lang
        userLocale.value = locale.value
    }
    function initLocale() {
        locale.value = userLocale.value
    }


    return { onToggleLocale, initLocale, availableLocales }
}
