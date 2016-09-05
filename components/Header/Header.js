import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Link } from 'react-router';
import { map } from 'lodash';
import s from './Header.scss';
import Navigation from '../Navigation';
import Message from '../../components/Common/Message';
import ua from '../../actions/UserActions';

class Header extends Component {

  static propTypes = {
    isMobile: PropTypes.bool,
    isTablet: PropTypes.bool,
    isDesktop: PropTypes.bool,
    isLoggedIn: PropTypes.bool,
    activeLocale: PropTypes.string,
    locales: PropTypes.array,
    availableCategories: PropTypes.array,
    modalHandler: PropTypes.func,
    router: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      showMenu:false,
      showSubMenu:false,
      showModal: this.showModal.bind(this),
      searchPlaceholder: this.searchPlaceholder.bind(this),
      changeLocale: this.changeLocale.bind(this),
      searchTopic: this.searchTopic.bind(this),
      searchTopicKey: this.searchTopicKey.bind(this),
      signOut: this.signOut.bind(this),
      toggleHamburger: this.toggleHamburger.bind(this),
      toggleSubitem: this.toggleSubitem.bind(this),
      showPlaceholder: true
    }
  }

  showModal(e){
    this.props.modalHandler("logIn");
  }

  changeLocale(e){
    const elem = e.currentTarget;
    const code = elem.dataset.locale;
    this.props.changeLocale(code);
  }

  searchTopic(e){
    let searchInput = this.refs.searchInput.value;
    const url = '/search/'+searchInput;
    if(searchInput !== ''){
      window.location.replace(url);
    }
  }

  searchPlaceholder(e){
      this.setState({
        showPlaceholder: false
      });
      this.refs.searchInput.focus();
  }

  searchTopicKey(e){
    let searchInput = '';
    if (e.key === 'Enter') {
      const elem = e.currentTarget;
      searchInput = elem.value;
    }

    const url = '/search/'+searchInput;
    if(searchInput !== ''){
      window.location.replace(url);
    }
  }

  signOut(e){
    ua.logout();
  }

  toggleHamburger(){
    const currentState = this.state.showMenu;
    const currentStateSubMenu = this.state.showSubMenu;
    if(currentStateSubMenu){
      this.setState({
        showSubMenu : !currentStateSubMenu
      })
    } else {
      this.setState({
        showMenu : !currentState
      })
    }
  }

  toggleSubitem(){
    const currentState = this.state.showSubMenu;
    this.setState({
      showSubMenu : !currentState
    })
  }

  render() {
    const isMobile = this.props.isMobile;
    const self = this;
    const showMobileMenu = this.state.showMenu;
    const showSubMenu = this.state.showSubMenu;
    const showPlaceholder = this.state.showPlaceholder;
    const locales = this.props.locales;
    const activeLocale = this.props.activeLocale;
    let activeLocaleLabel = '';
    let hamburger = '';
    let searchPlaceholder = '';
    let manageLink = '';
    let mobileMenu = '';
    let signedInToggle = (
      <li className={s.signIn} onClick={this.state.showModal}>
        <i className={s.iconUser}></i>
        &nbsp; <Message code="signIn" locale={this.props.activeLocale}/>
      </li>
      );


    if(this.props.isLoggedIn){
      signedInToggle = (
          <li className={s.signIn} onClick={this.state.signOut}>
            <i className={s.iconUser}></i>
            &nbsp; <Message code="signOut" locale={this.props.activeLocale}/>
          </li>
      );

      manageLink = (
        <li className={s.signIn}>
          &nbsp;
          <Link to={{ pathname: '/manage'}} activeClassName="active">
            <Message code="manage" locale={this.props.activeLocale}/>
          </Link>
        </li>);
    }

    const localeList = map(locales, (el) => {
      if(activeLocale === el.code){
        activeLocaleLabel = el.label;
      }
      return (
        <li key={el.code} className={s.localeList}>
          <span data-locale={el.code} onClick={self.state.changeLocale}>{el.label}</span>
        </li>
      );
    });

    if(showPlaceholder){
      searchPlaceholder = (<div className={s.searchPlaceholder} onClick={this.state.searchPlaceholder}>
        <Message code="search" locale={this.props.activeLocale} />
      </div>);
    }

    let showSubItemClass = '';
    if(showSubMenu){
      showSubItemClass = s.subOpen;
    }

    if (isMobile){
      hamburger =(
        <div id={s.hamburger} onClick={this.state.toggleHamburger} className={`${showSubItemClass} ${showMobileMenu ? s.open : ''}`}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      );
    }

    if(isMobile){
      mobileMenu =(
        <div id={s.mobileMenu}>
          <ul>
            <li><Link to="\">Home</Link></li>
            <li onClick={this.state.toggleSubitem} className={` ${s.subitems} ${showSubMenu ? s.open : ''}`}>Categories
              <Navigation router={this.props.router} availableCategories={this.props.availableCategories} showSubNav={false}/>
            </li>
            {manageLink}
          </ul>
        </div>
      );
    }

    return (
      <div>
        <nav id={`${isMobile ? s.mobileNav : s.nav }`} className={`${showMobileMenu ? s.open : ''}`}>
          {hamburger}
          {mobileMenu}
          <ul className={`${isMobile ? s.mobileRight : "pull-right"}`}>
            <li className="hidden-md hidden-lg">
              <Link to="/">
                <img src="/images/logo.png" width="50" style={{marginTop:-5 + 'px'}} />
              </Link>
            </li>
            {manageLink}
            {signedInToggle}
            <li className={s.dropdown}>
              <i className={s.iconLocale}>
                <span className={s.path1}></span>
                <span className={s.path2}></span>
              </i>
              &nbsp; {activeLocaleLabel}
              <ul>
                {localeList}
              </ul>
            </li>
            <li>
              <div className={s.searchWrapper}>
                <i id={s.mobileSearchButton} className={`${isMobile ? s.iconSearch : 'hidden'}`}></i>
                <div className={`${isMobile ? s.mobileSearchBox : ''}`}>
                  {searchPlaceholder}
                  <input type="text" ref="searchInput" onKeyPress={this.state.searchTopicKey}/>
                  <button onClick={this.state.searchTopic}><i className={s.iconSearch}></i></button>
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    );
  }

}

export default withStyles(Header, s);
