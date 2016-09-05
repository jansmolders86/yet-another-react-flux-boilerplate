import React, { Component, PropTypes } from 'react';
import Message from '../../components/Common/Message';

class Button extends Component {
  static propTypes = {
    type: PropTypes.string || 'button',
    styling: PropTypes.string || '',
    caption: PropTypes.string || '',
    translate: PropTypes.bool || true,
    onClick: PropTypes.func,
    activeLocale: PropTypes.string
  };

  render() {
    const shouldTranslate = this.props.translate;
    let caption = this.props.caption;
    if(shouldTranslate !== undefined && shouldTranslate){
      caption = <Message code={this.props.caption} locale={this.props.activeLocale}/>;
    }
    return (
      <div className="form-group">
        <button type={this.props.type}
               className={`btn ${this.props.styling} btn-lg btn-block`}
               id={this.props.id}>
          {caption}
        </button>
      </div>
    );
  }
}

export default Button;
