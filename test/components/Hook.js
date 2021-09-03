import React from 'react'
import { View } from 'react-native'
import { useCurrentScreen } from 'reactigation'

export const Hook = ({ currentScreenMock }) => {
  const screen = useCurrentScreen()
  currentScreenMock(screen)
  return <View />
}
