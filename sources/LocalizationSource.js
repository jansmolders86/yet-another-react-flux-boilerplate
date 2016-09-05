import la from '../actions/LocalizationActions';
import messageBundle from '../i18n/messages.json';
import locales from '../constants/locales.json';

const LocalizationSource = {
  fetchMessages: {
    remote(state, locale) {
      return new Promise(function(resolve, reject) {
        resolve(messageBundle);
      });
    },
    success: la.fetchMessagesSuccess,
    error: la.fetchMessagesError
  },
  fetchLocales: {
    remote(state) {
      return new Promise(function(resolve, reject) {
        resolve(locales);
      });
    },
    success: la.fetchLocalesSuccess,
    error: la.fetchLocalesError
  }
};

export default LocalizationSource;

