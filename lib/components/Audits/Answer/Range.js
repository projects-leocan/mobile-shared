import React from 'react';
import { Text, Slider } from 'react-native';

import {
  RangeContainer,
  RangeTextContainer
} from './styles';

class Range extends React.Component {
  state = {
    value: this.props.value || this.props.options[0] || 0
  }

  handleChange = (value) => this.setState({value: value})

  render() {
    const { options, value, onChange, readOnly, ...props } = this.props
    let min = options[0]
    let max = options[1]
    try {
      min = Number(options[0])
      max = Number(options[1])
    } catch (e) {
      min = 0
      max = 10
    }

    return (
      <RangeContainer {...props} style={{ justifyContent: 'center'}}>
        { props.card ?
          null :
          <RangeTextContainer {...props} >
            <Text style={{ textAlign: 'center', fontSize: 17, fontWeight: 'bold' }}>
              {this.state.value}
            </Text>
          </RangeTextContainer>
        }
        <Slider
          disabled={readOnly}
          style={{width: '100%'}}
          minimumValue={min}
          maximumValue={max}
          step={1}
          value={value}
          onSlidingComplete={(value) => onChange({ value, label: value })}
          onValueChange={this.handleChange}
          />
        { props.card ?
          <RangeTextContainer {...props} >
            <Text style={{ textAlign: 'center', fontSize: 17, fontWeight: 'bold' }}>
              {this.state.value}
            </Text>
          </RangeTextContainer>
          : null
        }
      </RangeContainer>
    )
  }
}

export default Range;