import React, { Component, PropTypes } from 'react';
import PageStore from '../../stores/PageStore';
import PageActions from '../../actions/PageActions';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { debounce, each, map } from 'lodash';
import breakpoints from '../../constants/breakpoints';
import s from './App.scss';
import connectToStores from 'alt-utils/lib/connectToStores';

@connectToStores
class App extends Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
    error: PropTypes.object
  };

  static contextTypes = {
    insertCss: PropTypes.func
  };

  static getStores() {
    return [PageStore];
  }

  static getPropsFromStores() {
    return PageStore.getState();
  }

  constructor(props) {
    super(props);
    this.state = {
      isMobile: false,
      isTablet: false,
      isLogged: false,
      isDesktop: true
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
    PageActions.fetch();

    setTimeout(() => {
      this.updateDimensions();
    }, 500);
    window.addEventListener('resize', this.updateDimensionsOnResize);
  }

  componentWillMount() {
    this.removeCss = this.context.insertCss(s);

  }
  componentWillUnmount() {
    PageStore.unlisten(this._onChange);
    this.removeCss();
  }

  render() {
    const availableCategories = PageStore.getState().categories;
    if (PageStore.getState().isLoading) {
      return (
        <div>
          LOADING
        </div>
      )
    } else {

      return (
        <div>
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <Header
                  availableCategories={this.state.categories}
                  isMobile={this.state.isMobile}
                  isLogged={this.state.isLogged}
                  isTablet={this.state.isTablet}
                  isDesktop={this.state.isDesktop}/>

                <div>
                  {this.props.children}
                </div>

              </div>
            </div>
          </div>
          <Footer availableCategories={this.state.categories}/>
        </div>
      );
    }
  }
}

export default App;
