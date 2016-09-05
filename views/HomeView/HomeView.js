import React, { Component, PropTypes } from 'react';
import Homepage from '../../components/Category/Homepage';

class HomeView extends Component {
  render() {
    return (
      <div>
        <Homepage {...this.props}/>
      </div>
    );
  }
}

export default HomeView;
