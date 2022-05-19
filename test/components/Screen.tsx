/* eslint-env jest */
import React, { useEffect } from 'react'
import { View, Text } from 'react-native'

const Screen = ({
  renderMock,
  effectMock,
  ...props
}: {
  title: string
  renderMock: jest.Mock
  effectMock: jest.Mock
}) => {
  useEffect(() => {
    effectMock(props)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  renderMock(props, props.title)

  return (
    <View>
      <Text>{props.title}</Text>
    </View>
  )
}

// Creates a screen with a render mock.
export default (name: string, renderMock = jest.fn(), effectMock = jest.fn()) => {
  return <Screen title={name} renderMock={renderMock} effectMock={effectMock} />
}
