import alt from '../core/alt';
import PageActions from '../actions/PageActions';
import PageSource from '../sources/PageSource';

class PageStore {
  constructor() {
    this.bindListeners({
      onUpdate: PageActions.update,
      onFetch: PageActions.fetch,
      onFailed: PageActions.failed
    });
    this.state = {
      categories: [],
      errorMessage: null,
      isLoading: true
    };
    this.exportAsync(PageSource);
  }

  onUpdate(categories) {
    this.setState({
      categories: this.state.categories.concat(categories),
      isLoading: false,
      errorMessage: null
    });

  }

  onFetch(categories) {
    this.setState({
      categories: this.state.categories.concat(categories),
      isLoading: false,
      errorMessage: null
    });
  }

  onFailed(errorMessage) {
    this.setState({
      isLoading: false,
      errorMessage: errorMessage
    });
  }
}

export default alt.createStore(PageStore, 'PageStore');
