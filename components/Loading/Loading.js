import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Loading.scss';
import Message from '../../components/Common/Message';

class Loading extends Component {

  static propTypes = {
    activeLocale: PropTypes.string
  };

  render() {
    const activeLocale= this.props.activeLocale;
    let loadingMessage  = <Message code="loading" locale={activeLocale}/>;
    if(activeLocale === undefined  || activeLocale === null){
      loadingMessage = 'Loading...';
    }

    return (
      <div className="container col-centered">
        <div className="row">
            <div className="col-xs-12">
              <div className={s.loadingWrapper}>
                <h1>{loadingMessage}</h1>
                <div className={s.slider}>
                  <div className={s.line}></div>
                  <div className={s.dot1}></div>
                  <div className={s.dot2}></div>
                  <div className={s.dot3}></div>
                </div>
              </div>
          </div>
        </div>
      </div>
    );
  }

}

export default withStyles(Loading, s);
