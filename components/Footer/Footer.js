import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Footer.scss';
import { Link } from 'react-router';
import Navigation from '../Navigation';
import Message from '../../components/Common/Message';

class Footer extends Component {

  static propTypes = {
    activeLocale: PropTypes.string,
    availableCategories: PropTypes.array
  };

  render() {

    const showSubmenu = false;
    return (
      <footer id={s.footer}>
        <div className="container-fluid">
          <div className="row">
            <div className=" hidden-xs hidden-sm col-md-1">
              <div className={s.footerLogo}>
                <img src="/images/logo.png" alt="top 10"/>
              </div>
            </div>
            <div className="col-xs-12 col-md-3">
              {/*
              <h4><Message code="newsletter" locale={this.props.activeLocale}/></h4>
              <p><Message code="newsletterContent" locale={this.props.activeLocale}/></p>
              <div className="form-group">
                <input type="text" placeholder="Email"/>
                <button>><Message code="signUp" locale={this.props.activeLocale}/></button>
              </div>
              */}
              <div className="scroll-up-button hidden-md hidden-lg">
                <span>&nbsp;</span>
              </div>
            </div>
            <div className="col-xs-12 col-md-4">
              <div className="row">
                <div className="col-xs-6 col-md-6">
                  <h4><Message code="categories" locale={this.props.activeLocale}/></h4>
                  <div className={s.categoryList}>
                    <Navigation availableCategories={this.props.availableCategories} showSubNav={showSubmenu}/>
                  </div>
                </div>
                <div className="col-xs-6 col-md-6">
                  <h4><Message code="sitemap" locale={this.props.activeLocale}/></h4>
                  <ul>
                    <li><Link to="about">About</Link></li>
                    <li><Link to="legal">Legal</Link></li>
                    <li><Link to="contact">Contact</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xs-12 col-md-2">
              <div className={s.socialWrapper}>
                <h4><Message code="social" locale={this.props.activeLocale}/></h4>
                <ul className={s.social}>
                  <li>
                    <Link to="">
                      <i className={s.iconFacebookSquare}>
                        <span className={s.path1}></span>
                        <span className={s.path2}></span>
                      </i>
                    </Link>
                  </li>
                  <li>
                    <Link to="">
                      <i className={s.iconTwitterSquare}>
                        <span className={s.path1}></span>
                        <span className={s.path2}></span>
                      </i>
                    </Link>
                  </li>
                  <li>
                    <Link to="">
                      <i className={s.iconGooglePlusSquare}>
                        <span className={s.path1}></span>
                        <span className={s.path2}></span>
                      </i>
                    </Link>
                  </li>
                  <li>
                    <Link to="">
                      <i className={s.iconPinterestSquare}>
                        <span className={s.path1}></span>
                        <span className={s.path2}></span>
                      </i>
                    </Link>
                  </li>
                </ul>
                <div id={s.scrollUpButton} className="hidden-xs hidden-sm">
                  <span>&nbsp;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default withStyles(Footer, s);
