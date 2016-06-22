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
import { map } from 'lodash';
import { Link } from 'react-router';
import s from './Header.scss';

class Header extends Component {
  render() {
    const categories = this.props.availableCategories;
    const isMobile = this.props.isMobile;
    let links = map(categories, (category, i) => {
      const url = '/c/' + category;
      return (
        <li key={category}>
          <Link to={url}>{category}</Link>
        </li>
      )
    });

    let hamburger = '';
    if (isMobile){
      hamburger =
        <div id={s.hamburger}>
          <span>&nbsp;</span>
          <span>&nbsp;</span>
          <span>&nbsp;</span>
          <span>&nbsp;</span>
        </div>;
    }

    let mobileMenu = '';
    if(isMobile){
      mobileMenu =
        <div id={s.mobileMenu}>
          <ul>
            <li><Link to="\">Home</Link></li>
            <li><Link to="">About Us</Link></li>
            <li class={s.subitems}>Categories
              <ul>
                {links}
              </ul>
            </li>
            <li><Link to="">Contact</Link></li>
          </ul>
        </div>
    }

    return (
        <nav id={`${isMobile ? s.mobileNav : s.nav }`}>
          {hamburger}
          {mobileMenu}
          <div className={s.searchWrapper}>
            <i id={s.mobileSearchButton} className={`${isMobile ? s.iconSearch : 'hidden'}`}>&nbsp;</i>
            <div className={`${isMobile ? s.mobileSearchBox : ''}`}>
              <input type="text" placeholder="Search" />
              <button><i class={s.iconSearch}>&nbsp;</i></button>
            </div>
          </div>
        </nav>
    );
  }

}

export default withStyles(Header, s);
