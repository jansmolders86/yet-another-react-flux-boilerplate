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
import s from './CategoryView.scss';
import PageActions from '../../actions/PageActions';
import PageStore from '../../stores/PageStore';

import NotFoundView from '../NotFoundView/NotFoundView';
import { map, each, delay } from 'lodash';

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

class CategoryView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeCategory: {},
      notFound: true
    };
  }

  componentWillMount() {

    /*
    const title = this.props.params.title;
    const availableCategories = PageStore.getState().categories;

    if (isInArray(title, availableCategories)) {
      const categoryDetails = PageActions.getCategory(title);
      this.setState({
        activeCategory: categoryDetails,
        notFound: false
      });
    }

    */
  }


  render() {
    const topics = this.state.activeCategory;
    if(this.state.notFound){
      return (
        <NotFoundView />
      );
    } else {
      return (
        <div>
          Category
        </div>
      );
    }
  }

}

export default withStyles(CategoryView, s);
