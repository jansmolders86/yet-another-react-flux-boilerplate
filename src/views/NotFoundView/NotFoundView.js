/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './NotFoundView.scss';


class NotFoundView extends Component {

  render() {
    return (
      <div>
        <h1>An error occurred on this page.</h1>
      </div>
    );
  }

}

export default withStyles(NotFoundView, s);