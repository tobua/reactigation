import React from 'react'
import { View } from 'react-native'
import { useCurrentScreen } from 'reactigation'

export const Hook = ({ currentScreenMock }: { currentScreenMock: jest.Mock }) => {
  const screen = useCurrentScreen()
  currentScreenMock(screen)
  return <View />
}
