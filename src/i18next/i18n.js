import React from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation_en_US.json';
import translationKR from './locales/kr/translation_ko_KR.json';

const resources = {
    en: {
        translation: translationEN
    },
    kr: {
        translation: translationKR
    }
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: {
            ko: ['kr'],
            default: ['en']
        },
        debug: true,
        keySeparator: true,
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
