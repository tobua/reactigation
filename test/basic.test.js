import React from 'react'
import { Animated } from 'react-native'
import { act } from 'react-test-renderer'
import Navigation, { go, back, destroy } from 'reactigation'
import render from './utils/render-to-tree'
import setupScreens from './utils/setup-screens'

// Animated won't work in test enviroment, mock it to resolve immediately.
Animated.timing = () => ({
  start: (done) => done(),
})

// https://github.com/facebook/jest/issues/4359
jest.useFakeTimers()
Date.now = jest.fn(() => 1503187200000)

test('Renders a single registered screen.', () => {
  const names = ['FirstScreen']
  const input = setupScreens(names)

  const { screens } = render(<Navigation />)

  expect(screens.length).toEqual(1)

  expect(input[0].mock.calls.length).toEqual(1)
  expect(input[0].mock.calls[0][1]).toEqual(names[0])

  expect(input[0].mock.calls[0][0]).toEqual({
    backPossible: false,
    title: names[0],
  })

  // <Text> with title.
  expect(screens[0].children[0].children[0]).toEqual(names[0])

  destroy()
})

test('Can render several screens.', () => {
  const names = ['FirstScreen', 'SecondScreen', 'ThirdScreen']
  const input = setupScreens(names)

  const { screens } = render(<Navigation />)

  expect(screens.length).toEqual(1)

  expect(input[0].effectMock.calls.length).toEqual(1)
  expect(input[0].mock.calls.length).toEqual(1)
  expect(input[0].mock.calls[0][1]).toEqual('FirstScreen')

  expect(input[1].mock.calls.length).toEqual(0)
  expect(input[2].mock.calls.length).toEqual(0)

  destroy()
})

test('Can navigate between screens.', () => {
  const names = ['FirstScreen', 'SecondScreen', 'ThirdScreen']
  const input = setupScreens(names)

  render(<Navigation />)

  expect(input[0].mock.calls.length).toEqual(1)
  expect(input[0].effectMock.calls.length).toEqual(1)

  act(() => {
    go(names[1])
  })

  expect(input[0].mock.calls.length).toEqual(2)
  expect(input[0].effectMock.calls.length).toEqual(1)
  expect(input[1].mock.calls.length).toEqual(1)
  expect(input[1].effectMock.calls.length).toEqual(1)

  act(() => {
    go(names[2])
  })

  expect(input[0].mock.calls.length).toEqual(2)
  // Second screen appears during both transitions.
  expect(input[1].mock.calls.length).toEqual(2)
  expect(input[2].mock.calls.length).toEqual(1)

  destroy()
})

test("Back isn't possible for last screen.", () => {
  const names = ['FirstScreen', 'SecondScreen', 'ThirdScreen']
  const input = setupScreens(names)

  render(<Navigation />)

  // Visible screens have been rendered, back initially not possible.
  expect(input[0].mock.calls.length).toEqual(1)
  expect(input[0].effectMock.calls.length).toEqual(1)
  expect(input[0].mock.calls[0][0].backPossible).toEqual(false)
  expect(input[1].mock.calls.length).toEqual(0)
  expect(input[2].mock.calls.length).toEqual(0)

  act(() => {
    go(names[1])
  })

  expect(input[0].mock.calls.length).toEqual(2)
  expect(input[0].effectMock.calls.length).toEqual(1)
  expect(input[1].mock.calls.length).toEqual(1)
  expect(input[2].mock.calls.length).toEqual(0)

  expect(input[0].mock.calls[1][0].backPossible).toEqual(false)
  expect(input[1].mock.calls[0][0].backPossible).toEqual(true)

  act(() => {
    go(names[2])
  })

  expect(input[0].mock.calls.length).toEqual(2)
  expect(input[1].mock.calls.length).toEqual(2)
  expect(input[2].mock.calls.length).toEqual(1)

  expect(input[1].mock.calls[1][0].backPossible).toEqual(true)
  expect(input[2].mock.calls[0][0].backPossible).toEqual(true)

  act(() => {
    back()
  })

  act(() => {
    back()
  })

  expect(input[0].mock.calls.length).toEqual(3)
  expect(input[1].mock.calls.length).toEqual(4)
  expect(input[2].mock.calls.length).toEqual(2)

  expect(input[0].mock.calls[2][0].backPossible).toEqual(false)
  expect(input[1].mock.calls[2][0].backPossible).toEqual(true)
  expect(input[1].mock.calls[3][0].backPossible).toEqual(true)
  expect(input[2].mock.calls[1][0].backPossible).toEqual(true)

  destroy()
})

test('Props can be passed to screen with go().', () => {
  const names = ['FirstScreen', 'SecondScreen', 'ThirdScreen']
  const input = setupScreens(names)

  const { screens } = render(<Navigation />)

  expect(screens.length).toEqual(1)

  expect(input[0].mock.calls.length).toBe(1)
  expect(input[0].mock.calls[0][0].productId).toBe(undefined)

  act(() => {
    go(names[1], 'regular', {
      productId: 123,
    })
  })

  expect(input[0].mock.calls.length).toEqual(2)
  expect(input[1].mock.calls.length).toEqual(1)

  expect(input[0].mock.calls[1][0].productId).toBe(undefined)
  expect(input[1].mock.calls[0][0].productId).toBe(123)

  act(() => {
    // Second argument can be left unspecified.
    go(names[2], null, {
      productId: 456,
    })
  })

  expect(input[0].mock.calls.length).toEqual(2)
  expect(input[1].mock.calls.length).toEqual(2)
  expect(input[2].mock.calls.length).toEqual(1)

  expect(input[1].mock.calls[1][0].productId).toBe(123)
  expect(input[2].mock.calls[0][0].productId).toBe(456)

  act(() => {
    back()
  })
  // Each act will trigger a rerender.
  act(() => {
    go(names[2], undefined)
  })

  expect(input[0].mock.calls.length).toEqual(2)
  expect(input[1].mock.calls.length).toEqual(4)
  expect(input[2].mock.calls.length).toEqual(3)

  expect(input[1].mock.calls[2][0].productId).toBe(123)
  expect(input[1].mock.calls[3][0].productId).toBe(123)
  expect(input[2].mock.calls[1][0].productId).toBe(456)
  expect(input[2].mock.calls[2][0].productId).toBe(undefined)

  destroy()
})
