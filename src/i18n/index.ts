import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import zh from './locales/zh.json'

export async function initI18n(): Promise<void> {
  await i18next
    .use(LanguageDetector)
    .init({
      resources: {
        en: { translation: en },
        zh: { translation: zh },
      },
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['querystring', 'localStorage', 'navigator'],
        caches: ['localStorage'],
      },
    })
}

/**
 * Update all elements with data-i18n attribute
 */
export function translatePage(): void {
  const elements = document.querySelectorAll('[data-i18n]')
  elements.forEach((el) => {
    const key = el.getAttribute('data-i18n')
    if (key) {
      const translation = i18next.t(key)
      
      // If it's an input or textarea with placeholder, translate placeholder too
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        if (el.hasAttribute('placeholder')) {
          const placeholderKey = el.getAttribute('data-i18n-placeholder') || `${key}_placeholder`
          if (i18next.exists(placeholderKey)) {
            el.placeholder = i18next.t(placeholderKey)
          }
        }
      }

      // Handle title attribute if present
      if (el.hasAttribute('data-i18n-title')) {
        const titleKey = el.getAttribute('data-i18n-title')
        if (titleKey) el.setAttribute('title', i18next.t(titleKey))
      }

      // Only set textContent if the element itself contains the text (not just children)
      // Some elements might have data-i18n but also nested elements we don't want to blow away
      // For simplicity in this project, we'll mostly use it on leaf nodes or nodes with simple text
      if (el.getAttribute('data-i18n-only-title') !== 'true') {
         el.textContent = translation
      }
    }
  })
}

export default i18next
