import en from '../locales/en';
import vi from '../locales/vi';
import { createI18n } from 'vue-i18n';

const messages = {
  en,
  vi,
};

const i18n = createI18n({
  legacy: false,
  locale: 'vi',
  messages,
  globalInjection: true,
});

export default i18n;