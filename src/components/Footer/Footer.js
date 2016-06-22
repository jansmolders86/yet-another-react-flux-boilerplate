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
import s from './Footer.scss';
import { Link } from 'react-router';
import { map } from 'lodash';

class Footer extends Component {

  render() {
    const categories = this.props.availableCategories;
    let links = map(categories, (category, i) => {
      const url = '/c/' + category;
      return (
        <li key={category}>
          <Link to={url}>{category}</Link>
        </li>
      )
    });
    return (
      <footer id={s.footer}>
        <div className="col-xs-12 col-md-4">
          <div className="row">
            <div className="col-xs-6 col-md-6">
              <h4>Categories</h4>
              <ul>
                {links}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }

}

export default withStyles(Footer, s);
