import React from 'react';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import { IndexRoute, Route } from 'react-router';

import App from '../views/App/';
import CategoryView from '../views/CategoryView/CategoryView';
import NotFoundView from '../views/NotFoundView/NotFoundView';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={CategoryView} />
    <Route path="/c/:title" component={CategoryView} />
    <Route path="*" component={NotFoundView} />
  </Route>
);
