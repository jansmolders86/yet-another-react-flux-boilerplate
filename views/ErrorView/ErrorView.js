import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ErrorView.scss';
import pureRender from 'pure-render-decorator';
import Message from '../../components/Common/Message';

@pureRender
class ErrorView extends Component {
  static propTypes = {
    reason: PropTypes.string,
    message: PropTypes.string,
    isAdmin: PropTypes.bool,
    activeCategory: PropTypes.object,
    activeLocale: PropTypes.string
  };

  constructor(props){
    super(props);
    this.state = {
      showAdminModal: this.showAdminModal.bind(this)
    };
  }

  showAdminModal(){
    this.props.modalHandler("AdminTopic", this.props.activeCategory.urlkey, null);
  }

  render() {
    let messageString =  '';
    if(this.props.reason === "404" || this.props.reason === undefined){
      messageString =  <Message code="404" locale={this.props.activeLocale}/>;
    }else if(this.props.reason === "empty"){
      messageString =  <Message code="empty" locale={this.props.activeLocale}/>;
    } else if (this.props.reason === "500"){
      messageString =  <Message code="500" locale={this.props.activeLocale}/>;
    } else if (this.props.reason === "specific"){
      messageString =  this.props.message;
    }

    let adminButton = '';
    if(this.props.isAdmin && this.props.reason === 'empty'){
      adminButton = (
        <button className={s.adminButton} onClick={this.state.showAdminModal}>
          <div className="pull-left">Add Topic</div>
          <div className="pull-right">+</div>
        </button>
      );
    }

    return (
      <div className={s.notFoundWrapper}>
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <h1>{messageString}</h1>
              {adminButton}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(ErrorView, s);
