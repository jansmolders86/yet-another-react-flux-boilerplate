import React, { Component, PropTypes } from 'react';
import LocalizationStore from '../../stores/LocalizationStore';
import connectToStores from 'alt-utils/lib/connectToStores';

@connectToStores
class Message extends Component {

  static propTypes = {
    code: PropTypes.string,
    locale: PropTypes.string,
    args: PropTypes.array
  };

  static getStores() {
    return [LocalizationStore];
  }

  static getPropsFromStores() {
    return {
      LocalizationStore: LocalizationStore.getState(),
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      messages: LocalizationStore.getState().messages,
      activeLocale: ''
    }
  }

  componentDidMount(){
    let activeLocale = localStorage.getItem('activeLocale');
    if(activeLocale === undefined){
      activeLocale = 'en'
    }
    this.setState({
      activeLocale: activeLocale
    });
  }

  componentWillReceiveProps(){
    let activeLocale = this.props.locale;
    if(activeLocale !== undefined){
      this.setState({
        activeLocale: activeLocale
      });
    }
  }

  render() {
    const props = this.props;
    const messages = this.state.messages;
    const locale = this.state.activeLocale;

    if(locale !== undefined){
      let messageBundle = messages[locale];
      let message = [];
      if(messageBundle !== undefined){
        message = messageBundle[0][props.code];
      }

      if (!message) {
        console.warn('message code not found:', props.code);
      }
      return (<span>{message}</span>);
    } else {
      return null;
    }
  }
}

export default Message;
