import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.scss';
import { map } from 'lodash';
import SubNavigation from './SubNavigation';
import { Link } from 'react-router';

class Navigation extends Component {
  static propTypes = {
    availableCategories: PropTypes.array,
    showSubNav: PropTypes.bool,
    isMobile: PropTypes.bool,
    isTablet: PropTypes.bool,
    isDesktop: PropTypes.bool,
    router: PropTypes.object
  };

  render() {
    const showSubNav = this.props.showSubNav;
    const availableCategories = this.props.availableCategories;
    const self = this;
    const isMobile = this.props.isMobile;
    const isTablet = this.props.isTablet;
    let subNav = '';
    let sideBarClass = '';
    let navLinks = map(availableCategories, (el, index) => {
        const topics = el.topics;
        const urlkey = el.urlkey;
        if(showSubNav && !isTablet && !isMobile && topics.length > 0){
          subNav = <SubNavigation linkParent={el.urlkey}
                                  title={el.title}
                                  router={self.props.router}
                                  topics={el.topics}
                                  showSubNav={showSubNav}/>
        }
        let showSubNavClass = '';
        if(showSubNav && topics.length && !isTablet && !isMobile){
          showSubNavClass = s.subitems
        }


        return (
          <li key={'nav-list-' + el.title + '-' +index}>
            <Link to={{ pathname: '/c/'+el.urlkey}}
                  activeClassName={s.active}
                  className={`${showSubNavClass}`}
                  data-item={urlkey}>{el.title}</Link>
            {subNav}
          </li>
        );
    });


    if(showSubNav){
      sideBarClass = s.hasSideBar
    }

    return (
      <ul className={`${s.navElem} ${sideBarClass}`}>
        {navLinks}
      </ul>
    );
  }

}

export default withStyles(Navigation, s);
