import React from 'react'
import { View, Text, TouchableHighlight, Animated } from 'react-native'
import { act } from 'react-test-renderer'
import Navigation, { register, go, back, destroy } from 'reactigation'
import render from './utils/render-to-tree'

// @ts-ignore Animated won't work in test enviroment, mock it to resolve immediately.
Animated.timing = () => ({
  start: (done: () => void) => done(),
})

// https://github.com/facebook/jest/issues/4359
jest.useFakeTimers()
Date.now = jest.fn(() => 1503187200000)

test('Two Screen Example with Interaction.', () => {
  const firstScreenMock = jest.fn()
  const FirstScreen = (props: { title?: string }) => {
    firstScreenMock(props)
    return (
      <View>
        <Text>{props.title}</Text>
        <TouchableHighlight onPress={() => go('Second')}>
          <Text>go to SecondScreen</Text>
        </TouchableHighlight>
      </View>
    )
  }

  const secondScreenMock = jest.fn()
  const SecondScreen = (props: { title?: string }) => {
    secondScreenMock(props)
    return (
      <View>
        <Text>{props.title}</Text>
        <TouchableHighlight onPress={() => back()}>
          <Text>go back</Text>
        </TouchableHighlight>
      </View>
    )
  }

  register(<FirstScreen />, 'First')
  register(<SecondScreen />, 'Second')

  const { screens } = render(<Navigation headless={false} />)

  expect(screens.length).toEqual(1)

  // Initially only the first screen is visible and rendered.
  expect(screens[0].children[0].children[0]).toEqual('First')

  expect(firstScreenMock.mock.calls.length).toEqual(1)
  expect(secondScreenMock.mock.calls.length).toEqual(0)

  expect(firstScreenMock.mock.calls[0][0].backPossible).toEqual(false)

  act(() => {
    go('Second')
  })

  expect(firstScreenMock.mock.calls.length).toEqual(2)
  expect(secondScreenMock.mock.calls.length).toEqual(1)

  expect(firstScreenMock.mock.calls[1][0].backPossible).toEqual(false)
  expect(secondScreenMock.mock.calls[0][0].backPossible).toEqual(true)

  destroy()
})
