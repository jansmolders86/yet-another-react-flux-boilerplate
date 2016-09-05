import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Input.scss';
import Message from '../../components/Common/Message';

class Input extends Component {
  static propTypes = {
    type: PropTypes.string || 'text',
    placeholder: PropTypes.string || '',
    errorMessage: PropTypes.string || '',
    regex: PropTypes.string || null,
    name: PropTypes.string.isRequired || '',
    styling: PropTypes.string || '',
    activeLocale: PropTypes.string,
    id: PropTypes.string || '',
    label: PropTypes.bool,
    validateField: PropTypes.func,
    valid: PropTypes.bool,
    translate: PropTypes.bool || false,
    defaultValue: PropTypes.string || ''
  };

  constructor(props){
    super(props);
    this.state = {
      validateField: this.validateField.bind(this),
      validated: false,
      showError: false
    };
  }

  testText(value){
    const re = /([^\s]*)/;
    return re.test(value);
  }

  testEmail(value){
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
  }

  testPassword(value){
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/;
    return re.test(value);
  }

  validateField(e){
    const elem = e.currentTarget;
    const value = elem.value;
    const type = elem.type;
    const regex = this.props.regex;

    let validated = false;
    if(type === 'email'){
      validated = this.testEmail(value);
    }

    if(type === 'password'){
      validated = this.testPassword(value);
    }

    if(type === 'text'){
      validated = this.testText(value);
    }

    if(regex !== null){
      const customRegex = new RegExp(regex);
      validated = customRegex.test(value);
    }

    let showError = true;
    if(value === '' || value === null){
      showError: false
    }
    this.setState({
      validated: validated,
      showError: showError
    });

    if(this.props.validateField !== undefined){
      this.props.validateField(validated);
    }

  }

  componentWillMount(){
    this.setState({
      validated: false,
      showError: false
    });
  }

  render() {
    let validation = '';
    let labelElem = '';
    let textLabelElem = '';
    let showLabel = this.props.label;
    let styling = this.props.styling;

    if(!this.props.valid){
      validation = (
        <div className={s.validationMessage}>
          <Message code={this.props.errorMessage} locale={this.props.activeLocale}/>
        </div>
      );
    }

    if(this.props.styling === undefined){
      styling = '';
    }

    if(this.props.type === 'checkbox' || showLabel !== undefined &&  showLabel){
      if(this.props.translate){
        labelElem = <label htmlFor={this.props.id}><Message code={this.props.placeholder} locale={this.props.activeLocale}/></label>;
      } else {
        labelElem = <label htmlFor={this.props.id}>{this.props.placeholder}</label>;
      }
    }

    if(this.props.type === 'textarea'){
      return (
        <div className={s.formGroup}>
          {validation}
          <div>
            <div className={s.inputLabel}>
              {textLabelElem}
            </div>
            <textarea type={this.props.type}
                   className={`form-control ${styling}`}
                   id={this.props.id}
                   defaultValue={this.props.defaultValue}
                   name={this.props.name}
                   valid={this.state.validated}
                   onChange={this.state.validateField}
                   placeholder={this.props.placeholder}/>
          </div>
        </div>
      );
    } else {
      return (
        <div className={s.formGroup}>
          {validation}
          <div>
            <div className={s.inputLabel}>
              {labelElem}
            </div>
            <input type={this.props.type}
                   className={`form-control ${styling}`}
                   id={this.props.id}
                   defaultValue={this.props.defaultValue}
                   name={this.props.name}
                   valid={this.state.validated}
                   onChange={this.state.validateField}
                   placeholder={this.props.placeholder}/>
          </div>
        </div>
      );
    }

  }
}

export default withStyles(Input, s);
