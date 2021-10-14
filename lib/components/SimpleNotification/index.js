import React, { Component } from 'react';
import { connect } from 'react-redux';

import {

} from './styles';

export default class SimpleNotification extends Component {

}

const mapStateToProps = (state) => {
    return {

    }
  }
  
  const mapDispatchToProps = (dispatch) => {
    return {
      dispatch
    }
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(SimpleNotification);