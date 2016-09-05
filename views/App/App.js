import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { withRouter } from 'react-router';
import { debounce, each, map } from 'lodash';
import breakpoints from '../../constants/breakpoints';
import s from './App.scss';

//Site Scaffolding Components
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Loading from '../../components/Loading/Loading';
import ErrorView from '../../views/ErrorView/ErrorView';

// Modal setup
import ModalWrapper from '../../components/ModalWrapper/ModalWrapper';
import modalStyling from '../../constants/modalStyling';
import Modal from 'react-modal';
import LogInWrapper from '../../components/LogIn/LogInWrapper';

// Stores
import connectToStores from 'alt-utils/lib/connectToStores';
import UserStore from '../../stores/UserStore';
import LocalizationStore from '../../stores/LocalizationStore';
import la from '../../actions/LocalizationActions';
import ua from '../../actions/UserActions';

@connectToStores
class App extends Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
    error: PropTypes.object,
    router: PropTypes.object
  };

  static contextTypes = {
    insertCss: PropTypes.func
  };

  static getStores() {
    return [UserStore, LocalizationStore];
  }

  static getPropsFromStores() {
    return {
      UserStore: UserStore.getState(),
      LocalizationStore: LocalizationStore.getState()
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      isMobile: false,
      isTablet: false,
      modalIsOpen: false,
      isDesktop: true,
      modalInner: null,
      users: null,
      activeLocale: null,
      loginMessage: null,
      loggedInID: UserStore.getState().id,
      isLoading: CategoryStore.getState().isLoading,
      likes: LikeStore.getState().likes,
      isEmptyCategory: CategoryStore.getState().isEmpty,
      locales: LocalizationStore.getState().locales,
      isLoggedIn: UserStore.isLoggedIn(),
      isAdmin: UserStore.isAdmin(),
      clickHandler: this.clickHandler.bind(this),
      modalHandler: this.modalHandler.bind(this),
      changeLocale: this.changeLocale.bind(this)
    };

    this.updateDimensions = () => {
      const windowWidth = window.innerWidth || window.documentElement.clientWidth || window.getElementsByTagName('body').clientWidth;
      let isMobile = false;
      let isTablet = false;
      let isDesktop = false;
      if (windowWidth < breakpoints.mobile) {
        isMobile = true;
      } else if (windowWidth >= breakpoints.mobile && windowWidth < breakpoints.tablet) {
        isTablet = true;
      } else if (windowWidth > breakpoints.tablet) {
        isDesktop = true;
      }

      if (this.state.isMobile !== isMobile
        || this.state.isTablet !== isTablet
        || this.state.isDesktop !== isDesktop) {
        this.setState({
          isMobile,
          isTablet,
          isDesktop
        });
      }
    };
    this.updateDimensionsOnResize = debounce(this.updateDimensions, 300);
  }

  componentDidMount() {
    setTimeout(() => {
      this.updateDimensions();
    }, 500);
    window.addEventListener('resize', this.updateDimensionsOnResize);
  }

  componentWillMount() {
    this.fetchAppData();

    this.removeCss = this.context.insertCss(s);
    this.setState({
      modalIsOpen: false
    });
  }

  componentWillUnmount() {
    this.removeCss();
    window.removeEventListener('resize', this.updateDimensionsOnResize);
  }

  clickHandler(state) {
    let toggleState = false;
    if(state === "true" || state === true){
      toggleState = true;
    } else if(state === "false" || state === false) {
      toggleState = false;
    }

    this.setState({
      modalIsOpen: toggleState
    });
  }

  componentWillReceiveProps(nextProps) {
    const showModal = UserStore.getState().showModal;
    const isLoggedIn = nextProps.UserStore.isLoggedIn;
    const loggedInID = nextProps.UserStore.id;
    const likes = nextProps.LikeStore.likes;
    const isAdmin = nextProps.UserStore.isAdmin;
    const loginMessage = nextProps.UserStore.loginMessage;
    const nextUsers = nextProps.UserStore.users;
    const nextLocales = nextProps.LocalizationStore.locales;
    let activeLocale = localStorage.getItem('activeLocale');

    if(nextProps) {
      if(showModal !== undefined && showModal !== null){
        this.clickHandler(showModal);
      }

      if(isLoggedIn !== undefined && isLoggedIn !== null){
        this.setState({
          isLoggedIn: isLoggedIn,
          loggedInID: loggedInID
        });
      }

      if(loginMessage !== undefined && loginMessage !== null){
        this.setState({
          loginMessage: loginMessage
        });
        this.modalHandler('logIn', null, null);
      } else if( loginMessage === null && showModal !== undefined && showModal !== null){
        this.clickHandler(showModal);
      }

      if(activeLocale === undefined || activeLocale === null){
        localStorage.setItem('activeLocale', 'en');
      }

      if(activeLocale !== undefined || activeLocale !== null){
        this.setState({
          activeLocale: activeLocale
        });
      }

      if(nextLocales !== undefined && nextLocales.length > 0){
        this.setState({
          locales: nextLocales
        });
      }
    }
  }

  fetchAppData(){
    const isEmptyCategory = this.state.isEmptyCategory;
    const loading = this.state.isLoading;
    const isAdmin = this.state.isAdmin;
    if(isEmptyCategory === null && loading){
      la.fetchLocales();
      la.fetchMessages();
    }
    if(isAdmin) {
      ua.fetchUsers();
    }
  }

  modalHandler(modalName, parent, children) {
    let ModalToBeRendered = null;
    if(modalName === 'logIn'){
      ModalToBeRendered = <LogInWrapper activeLocale={this.state.activeLocale} loginMessage={this.state.loginMessage}/>;
    }
    this.setState({
      modalInner: ModalToBeRendered,
      modalIsOpen: true
    });
  }

  changeLocale(code){
    this.setState({
      activeLocale: code
    });
    localStorage.setItem('activeLocale', code);
    window.location.replace(window.location.href);
  }

  render() {
    const availableCategories = this.state.categories;
    const isLoading = this.state.isLoading;
    const errorMessage = CategoryStore.getState().errorMessage;
 
    if (isLoading) {
      return (
        <Loading activeLocale={this.state.activeLocale}/>
      )
    } else if(!isLoading){
      const children = React.Children.map(this.props.children, (child) => {
        return React.cloneElement(child, this.state);
      });
      return (
        <ReactCSSTransitionGroup
            component="div"
            transitionName="app"
            transitionAppear={true}
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}
            transitionAppearTimeout={500}>
            <div className="container-fluid">
              <Header
                availableCategories={availableCategories}
                isLoggedIn={this.state.isLoggedIn}
                isMobile={this.state.isMobile}
                isTablet={this.state.isTablet}
                isDesktop={this.state.isDesktop}
                activeLocale={this.state.activeLocale}
                locales={this.state.locales}
                router={this.props.router}
                changeLocale={this.state.changeLocale}
                modalHandler={this.state.modalHandler}/>
              <div className="row">
                <div className="col-xs-12">
                    {children}
                  </div>
                </div>
              </div>
              <Footer availableCategories={availableCategories}
                      activeLocale={this.state.activeLocale}/>
              <Modal
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.closeModal}
                shouldCloseOnOverlayClick={true}
                style={modalStyling} >
                <ModalWrapper clickHandler={this.state.clickHandler}>
                  {this.state.modalInner}
                </ModalWrapper>
              </Modal>
        </ReactCSSTransitionGroup>
      );
    } else if(errorMessage !== undefined && errorMessage !== null){
      return (
        <ErrorView reason="specific"
                   message={errorMessage}
                   activeLocale={this.state.activeLocale}/>
      );
    }
  }
}

export default withRouter(App);
