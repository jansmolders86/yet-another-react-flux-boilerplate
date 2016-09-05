import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Input.scss';
import { map } from 'lodash';

class Select extends Component {
  static propTypes = {
    options: PropTypes.array,
    name: PropTypes.string,
    label: PropTypes.string || '',
    defaultValue: PropTypes.string || ''
  };

  render() {
    const optionsArray = this.props.options;
    const defaultValue = this.props.defaultValue;
    const options = map(optionsArray, (el) => {
      return (
        <option key={`option-val-${el}`} value={el}>{el}</option>
      )
    });

    return(
      <div className={s.formGroup}>
        <div>
          <div className={s.inputLabel}>
            {this.props.label}
          </div>
          <select name={this.props.name} defaultValue={defaultValue}>
            {options}
          </select>
        </div>
      </div>
    );

  }
}

export default withStyles(Select, s);
