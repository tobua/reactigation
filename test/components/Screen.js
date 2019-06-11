import React, { Component } from 'react'
import { View, Text } from 'react-native'

// Creates a screen with a render mock.
export default (name, renderMock = jest.fn(), constructorMock = jest.fn()) => {
  class Screen extends Component {
    constructor(props) {
      super(props)
      constructorMock(props)
    }

    render() {
      const { title } = this.props;

      renderMock(this.props, name)

      return (
        <View>
          <Text>{title}</Text>
        </View>
      )
    }
  }

  return <Screen />
}
