import PageActions from '../actions/PageActions';
import urls from '../constants/url';
import axios from 'axios';

export default {
  fetch() {
    console.log('Init Sources');
    return {
      remote() {
        return axios.get(urls.dbUrl).then(res => res.data);
      },
      success: PageActions.update,
      error: PageActions.failed,
      loading: PageActions.fetch
    };
  }
}
