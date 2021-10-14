import { lowerCase } from 'lodash/string';
import I18n from 'react-native-i18n'

import translations from '../translations';

export const t = (key) => I18n.t(lowerCase(key))

export const setup = () => {
  I18n.fallbacks = true
  I18n.translations = translations
}
