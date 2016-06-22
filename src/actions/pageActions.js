import alt from '../core/alt';

class pageActions {

  constructor() {
    this.generateActions(
      'fetch',
      'update',
      'failed'
    );
  }
}

export default alt.createActions(pageActions);
