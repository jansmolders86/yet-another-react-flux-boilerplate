import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.scss';
import { map } from 'lodash';
import { Link } from 'react-router';

class SubNavigation extends Component {
  static propTypes = {
    linkParent: PropTypes.string.isRequired,
    showSubNav: PropTypes.bool,
    title: PropTypes.string,
    topics: PropTypes.array,
    router: PropTypes.object
  };


  render() {
    const showSubNav = this.props.showSubNav;
    const topics = this.props.topics;
    let topicLinks = map(topics, (el) => {
      return (
        <li key={'topic-' + el.title}>
          <Link to={{ pathname: '/c/'+this.props.linkParent}} activeClassName="active">{el.title}</Link>
        </li>
      );
    });

    if(showSubNav){
      return (<ul className={s.sideBar}>{topicLinks}</ul>);
    } else{
      return ('');
    }

  }

}

export default withStyles(SubNavigation, s);
