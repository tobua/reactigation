import React from 'react'
import { act } from 'react-test-renderer'
import Navigation, { go, destroy } from 'reactigation'
import render from './utils/render-to-tree'
import setupScreens from './utils/setup-screens'

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

  expect(screens.length).toEqual(3)

  names.forEach((name, index) => {
    expect(input[0].effectMock.calls.length).toEqual(1)
    expect(input[index].mock.calls.length).toEqual(1)
    expect(input[index].mock.calls[0][1]).toEqual(name)
  })

  destroy()
})

test('Can navigate between screens.', () => {
  const names = ['FirstScreen', 'SecondScreen', 'ThirdScreen']
  const input = setupScreens(names)

  names.forEach((name, index) => {
    expect(input[index].mock.calls.length).toEqual(0)
    expect(input[index].effectMock.calls.length).toEqual(0)
  })

  act(() => {
    go(names[1])
  })

  names.forEach((name, index) => {
    expect(input[index].mock.calls.length).toEqual(1)
    expect(input[index].effectMock.calls.length).toEqual(1)
  })

  act(() => {
    go(names[2])
  })

  names.forEach((name, index) => {
    expect(input[index].mock.calls.length).toEqual(2)
    expect(input[index].effectMock.calls.length).toEqual(1)
  })

  destroy()
})
