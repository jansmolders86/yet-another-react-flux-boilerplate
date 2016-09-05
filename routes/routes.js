import React from 'react';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import { IndexRoute, Route, Redirect } from 'react-router';

import App from '../views/App/';
import HomeView from '../views/HomeView/HomeView';

const path = '/';

export default (
  <Route path={path} component={App}>
    <IndexRoute component={HomeView} />
    <Route path="/" component={HomeView} />
    <Route path="*" component={ErrorView} type="404"/>
  </Route>

);
