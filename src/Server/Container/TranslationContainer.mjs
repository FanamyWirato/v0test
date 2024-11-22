import i18next from "i18next";
import Factory from "../Database/Factory.mjs";
export default class TranslationContainer {
    static i18next = null;

    static async init () {
        // https://www.i18next.com/overview/getting-started
        // https://www.i18next.com/how-to/add-or-load-translations

        const enO = await Factory.config.translation.getByLang('en');
        const deO = await Factory.config.translation.getByLang('de');
        await i18next
            .init({
                lng: 'en',
                debug: true,
                resources: {
                    en: {
                        translation:  enO.texts 
                    },
                    de: {
                        translation:  deO.texts 
                    }
                }
            });
        // console.log(i18next.t('horse.key' ));
    }
}