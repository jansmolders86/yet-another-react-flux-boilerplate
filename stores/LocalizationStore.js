import Alt from '../core/alt';
import la from '../actions/LocalizationActions';
import ls from '../sources/LocalizationSource';
import { map } from 'lodash';

class LocalizationStore {
  constructor() {

    this.state = {
      errorMessage: null,
      messages: {},
      locales: []
    };

    this.bindActions(la);
    this.registerAsync(ls);
  }

  onFetchMessages() {
    this.getInstance().fetchMessages();
  }

  onFetchMessagesSuccess(bundle) {
    this.setState({
      messages: bundle
    });
  }

  onFetchMessagesError(errorMessage) {
    this.setState({
      errorMessage: errorMessage
    });
  }

  onFetchLocales() {
    this.getInstance().fetchLocales();
  }

  onFetchLocalesSuccess(locales) {
    this.setState({
      locales: locales.locales,
    });
  }

  onFetchLocalesError(errorMessage) {
    this.setState({
      errorMessage: errorMessage
    });
  }
}

export default Alt.createStore(LocalizationStore, 'LocalizationStore');
