import React from 'react'
import { Animated } from 'react-native'
import { act } from 'react-test-renderer'
import Navigation, { go, back, destroy } from '../index'
import render from './utils/render-to-tree'
import setupScreens from './utils/setup-screens'
import { Hook } from './components/Hook'

// @ts-ignore Animated won't work in test enviroment, mock it to resolve immediately.
Animated.timing = () => ({
  start: (done: () => void) => done(),
})

// https://github.com/facebook/jest/issues/4359
jest.useFakeTimers()

test('Hook is called with initial screen.', () => {
  const names = ['FirstScreen', 'SecondScreen', 'ThirdScreen']
  setupScreens(names)
  const hookMock = jest.fn()

  const { tree, wrappers } = render(
    <>
      <Navigation headless={false} />
      <Hook currentScreenMock={hookMock} />
    </>,
  )

  expect(wrappers.length).toEqual(1)
  expect(tree[1].type).toEqual('View')
  expect(tree[1].children).toEqual(null)

  expect(hookMock.mock.calls.length).toEqual(1)
  expect(hookMock.mock.calls[0][0]).toEqual('FirstScreen')

  destroy()
})

test('Hook is called with first registered screen.', () => {
  const names = ['SecondScreen', 'FirstScreen', 'ThirdScreen']
  setupScreens(names)
  const hookMock = jest.fn()

  render(
    <>
      <Navigation headless={false} />
      <Hook currentScreenMock={hookMock} />
    </>,
  )

  expect(hookMock.mock.calls[0][0]).toEqual('SecondScreen')

  destroy()
})

test('Hook is updated when screen changes.', () => {
  const names = ['FirstScreen', 'SecondScreen', 'ThirdScreen']
  setupScreens(names)
  const hookMock = jest.fn()

  render(
    <>
      <Navigation headless={false} />
      <Hook currentScreenMock={hookMock} />
    </>,
  )

  expect(hookMock.mock.calls[0][0]).toEqual(names[0])

  act(() => {
    go(names[1])
  })

  expect(hookMock.mock.calls.length).toEqual(2)
  expect(hookMock.mock.calls[1][0]).toEqual(names[1])

  act(() => {
    go(names[2])
  })

  expect(hookMock.mock.calls.length).toEqual(3)
  expect(hookMock.mock.calls[2][0]).toEqual(names[2])

  act(() => {
    back()
  })

  expect(hookMock.mock.calls.length).toEqual(4)
  expect(hookMock.mock.calls[3][0]).toEqual(names[1])

  destroy()
})

test('Hook updates all listeners.', () => {
  const names = ['FirstScreen', 'SecondScreen', 'ThirdScreen']
  setupScreens(names)
  const hookMock = jest.fn()
  const secondHookMock = jest.fn()

  render(
    <>
      <Navigation headless={false} />
      <Hook currentScreenMock={hookMock} />
      <Hook currentScreenMock={secondHookMock} />
    </>,
  )

  expect(hookMock.mock.calls[0][0]).toEqual(names[0])
  expect(secondHookMock.mock.calls[0][0]).toEqual(names[0])

  act(() => {
    go(names[1])
  })

  expect(hookMock.mock.calls.length).toEqual(2)
  expect(secondHookMock.mock.calls.length).toEqual(2)
  expect(hookMock.mock.calls[1][0]).toEqual(names[1])
  expect(secondHookMock.mock.calls[1][0]).toEqual(names[1])

  act(() => {
    back()
  })

  expect(hookMock.mock.calls.length).toEqual(3)
  expect(secondHookMock.mock.calls.length).toEqual(3)
  expect(hookMock.mock.calls[2][0]).toEqual(names[0])
  expect(secondHookMock.mock.calls[2][0]).toEqual(names[0])

  destroy()
})
