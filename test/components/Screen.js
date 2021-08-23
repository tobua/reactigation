/* eslint-env jest */
import React, { useEffect } from 'react'
import { View, Text } from 'react-native'

// Creates a screen with a render mock.
export default (name, renderMock = jest.fn(), effectMock = jest.fn()) => {
  const Screen = (props) => {
    useEffect(() => {
      effectMock(props)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    renderMock(props, name)

    return (
      <View>
        <Text>{props.title}</Text>
      </View>
    )
  }

  return <Screen />
}
