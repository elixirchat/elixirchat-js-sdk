import ru from './ru';
import en from './en';

export class I18nUtils {

  defaultLanguage = 'ru';
  selectedLanguage = 'ru';
  dictionaries = { ru, en };
  customLocalization = {};

  setLanguage = (langCodeStr) => {
    this.selectedLanguage = this.normalizeLanguageCode(langCodeStr) || this.defaultLanguage;
    return this.selectedLanguage;
  };

  addCustomLocalization = (customLocalization) => {
    this.customLocalization = customLocalization || {};
  };

  normalizeLanguageCode = (langCodeStr) => {
    const normalizedCode = (langCodeStr || '').toLowerCase().split(/_|-/)[0];
    return ['ru', 'en'].includes(normalizedCode) ? normalizedCode : null;
  };

  translationGetter = (target, prop) => {
    const dict = this.dictionaries[this.selectedLanguage];
    const customDict = this.customLocalization[this.selectedLanguage] || {};
    return customDict[prop] || dict[prop] || '';
  };

  createI18nObject = () => {
    return new Proxy(ru, {
      get: this.translationGetter
    });
  };

  inflect = (number, endings, hideNumber) => {
    return this.selectedLanguage === 'ru'
      ? this.inflectRu(number, endings, hideNumber)
      : this.inflectEn(number, endings, hideNumber);
  };

  inflectRu = (number, endings, hideNumber) => {
    const cases = [2, 0, 1, 1, 1, 2];
    const endingIndex = (number % 100 > 4 && number % 100 < 20) ? 2 : cases[ Math.min(number % 10, 5) ];
    const ending = endings[endingIndex] || endings[0];
    return hideNumber ? ending : number + ' ' + ending;
  };

  inflectEn = (number, endings, hideNumber) => {
    let ending = endings[1];
    if (number === 1) {
      ending = endings[0];
    }
    return hideNumber ? ending : number + ' ' + ending;
  };
}
