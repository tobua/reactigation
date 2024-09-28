import React, { CSSProperties } from 'react'
import { Animated, Text } from 'react-native'
import { act } from 'react-test-renderer'
import Navigation, { go, back, destroy, Transition, initial, history } from '../index'
import render from './utils/render-to-tree'
import setupScreens from './utils/setup-screens'
import { Screen } from './components/Screen'
import { styles } from '../styles'

const mergeObjects = (input: object[]) => {
  return input.reduce((result, style) => {
    return { ...result, ...style }
  }, {}) as CSSProperties
}

// @ts-ignore Animated won't work in test enviroment, mock it to resolve immediately.
Animated.timing = () => ({
  start: (done: () => void) => done(),
})

// https://github.com/facebook/jest/issues/4359
jest.useFakeTimers()
Date.now = jest.fn(() => 1503187200000)

test('Renders a single registered screen.', () => {
  const names = ['FirstScreen']
  const input = setupScreens(names)

  const { screens } = render(<Navigation headless={false} />)

  expect(screens.length).toEqual(2)

  expect(input[0].mock.calls.length).toEqual(1)
  expect(input[0].mock.calls[0][1]).toEqual(names[0])

  expect(input[0].mock.calls[0][0]).toEqual({
    backPossible: false,
    title: names[0],
  })

  // <Text> with title.
  expect(screens[1].children[0].children[0]).toEqual(names[0])

  destroy()
})

test('Can render several screens.', () => {
  const names = ['FirstScreen', 'SecondScreen', 'ThirdScreen']
  const input = setupScreens(names)

  const { screens } = render(<Navigation headless={false} />)

  expect(screens.length).toEqual(2)

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

  const { currentScreens } = render(<Navigation headless={false} />)

  expect(input[0].mock.calls.length).toEqual(1)
  expect(input[0].effectMock.calls.length).toEqual(1)

  act(() => {
    go(names[1])
  })

  let screens = currentScreens()

  expect(screens[1].props['aria-label']).toBe(names[0])
  expect(screens[2].props['aria-label']).toBe(names[1])
  expect(screens[2].props.style.zIndex).toBe(styles.front.zIndex)

  act(() => {
    go(names[2])
  })

  screens = currentScreens()

  expect(screens[3].props['aria-label']).toBe(names[2])
  expect(screens[3].props.style.zIndex).toBe(styles.front.zIndex)

  destroy()
})

test('Proper render counts for going back.', () => {
  const names = ['FirstScreen', 'SecondScreen', 'ThirdScreen']
  const input = setupScreens(names)

  render(<Navigation headless={false} />)

  act(() => {
    go(names[1])
  })

  expect(input[0].mock.calls.length).toEqual(1)
  expect(input[1].mock.calls.length).toEqual(1)
  expect(input[2].mock.calls.length).toEqual(0)

  expect(input[0].mock.calls[0][0].backPossible).toEqual(false)
  expect(input[1].mock.calls[0][0].backPossible).toEqual(true)

  act(() => {
    back()
  })

  expect(input[0].mock.calls.length).toEqual(1)
  expect(input[1].mock.calls.length).toEqual(1)
  expect(input[2].mock.calls.length).toEqual(0)

  expect(input[0].mock.calls[0][0].backPossible).toEqual(false)
  expect(input[1].mock.calls[0][0].backPossible).toEqual(true)

  destroy()
})

test("Back isn't possible for last screen.", () => {
  const names = ['FirstScreen', 'SecondScreen', 'ThirdScreen']
  const input = setupScreens(names)

  render(<Navigation headless={false} />)

  // Visible screens have been rendered, back initially not possible.
  expect(input[0].mock.calls.length).toEqual(1)
  expect(input[0].effectMock.calls.length).toEqual(1)
  expect(input[0].mock.calls[0][0].backPossible).toEqual(false)
  expect(input[1].mock.calls.length).toEqual(0)
  expect(input[2].mock.calls.length).toEqual(0)

  act(() => {
    go(names[1])
  })

  expect(input[0].mock.calls.length).toEqual(1)
  expect(input[0].effectMock.calls.length).toEqual(1)
  expect(input[1].mock.calls.length).toEqual(1)
  expect(input[2].mock.calls.length).toEqual(0)

  expect(input[0].mock.calls.length).toEqual(1)
  expect(input[1].mock.calls[0][0].backPossible).toEqual(true)

  act(() => {
    go(names[2])
  })

  expect(input[0].mock.calls.length).toEqual(1)
  expect(input[1].mock.calls.length).toEqual(1)
  expect(input[2].mock.calls.length).toEqual(1)

  expect(input[2].mock.calls[0][0].backPossible).toEqual(true)

  act(() => {
    back()
  })

  act(() => {
    back()
  })

  expect(input[0].mock.calls.length).toEqual(1)
  expect(input[1].mock.calls.length).toEqual(1)
  expect(input[2].mock.calls.length).toEqual(1)

  expect(input[0].mock.calls[0][0].backPossible).toEqual(false)
  expect(input[1].mock.calls[0][0].backPossible).toEqual(true)
  expect(input[2].mock.calls[0][0].backPossible).toEqual(true)

  destroy()
})

test('Can navigate to modal.', () => {
  const names = [
    'FirstScreen',
    'SecondScreen',
    'ThirdScreen',
    { name: 'Modal', options: { transition: Transition.modal } },
  ]
  const input = setupScreens(names)

  const { currentScreens } = render(<Navigation headless={false} />)

  // Visible screens have been rendered, back initially not possible.
  expect(input[0].mock.calls.length).toEqual(1)
  expect(input[0].effectMock.calls.length).toEqual(1)
  expect(input[0].mock.calls[0][0].backPossible).toEqual(false)
  expect(input[3].mock.calls.length).toEqual(0)

  act(() => {
    // @ts-ignore
    go(names[3].name)
  })

  let screens = currentScreens()

  expect(screens.length).toBe(3)
  expect(history.length).toBe(2)
  expect(input[0].mock.calls.length).toEqual(1)
  expect(input[0].effectMock.calls.length).toEqual(1)
  expect(input[3].mock.calls.length).toEqual(1)
  expect(input[3].mock.calls[0][0].backPossible).toEqual(true)
  expect(screens[1].props['aria-label']).toBe('FirstScreen')
  expect(screens[1].props.style.zIndex).toBe(styles.back.zIndex)
  expect(screens[2].props['aria-label']).toBe('Modal')
  expect(screens[2].props.style.zIndex).toBe(styles.front.zIndex)

  act(() => {
    back()
  })

  screens = currentScreens()

  expect(screens.length).toBe(3)
  expect(history.length).toBe(1)
  expect(input[0].mock.calls.length).toEqual(1)
  expect(input[3].mock.calls.length).toEqual(1)

  expect(input[0].mock.calls.length).toEqual(1)
  expect(input[3].mock.calls.length).toEqual(1)
  expect(screens[0].props.style.zIndex).toBe(undefined)
  expect(screens[1].props['aria-label']).toBe('FirstScreen')
  expect(screens[1].props.style.zIndex).toBe(styles.back.zIndex)
  expect(screens[2].props['aria-label']).toBe('Modal')
  expect(screens[2].props.style.zIndex).toBe(styles.front.zIndex)

  destroy()
})

test('Props can be passed to screen with go().', () => {
  const names = ['FirstScreen', 'SecondScreen', 'ThirdScreen']
  const input = setupScreens(names)

  const { screens } = render(<Navigation headless={false} />)

  expect(screens.length).toEqual(2)

  expect(input[0].mock.calls.length).toBe(1)
  expect(input[0].mock.calls[0][0].productId).toBe(undefined)

  act(() => {
    go(names[1], 'regular', {
      productId: 123,
    })
  })

  expect(input[0].mock.calls.length).toEqual(1)
  expect(input[1].mock.calls.length).toEqual(1)

  expect(input[0].mock.calls.length).toBe(1)
  expect(input[1].mock.calls[0][0].productId).toBe(123)

  act(() => {
    // Second argument can be left unspecified.
    go(names[2], undefined, {
      productId: 456,
    })
  })

  expect(input[0].mock.calls.length).toEqual(1)
  expect(input[1].mock.calls.length).toEqual(1)
  expect(input[2].mock.calls.length).toEqual(1)

  expect(input[1].mock.calls.length).toBe(1)
  expect(input[2].mock.calls.length).toBe(1)

  act(() => {
    back()
  })
  // Each act will trigger a rerender.
  act(() => {
    go(names[2], undefined)
  })

  expect(input[0].mock.calls.length).toEqual(1)
  expect(input[1].mock.calls.length).toEqual(1)
  expect(input[2].mock.calls.length).toEqual(2)

  expect(input[1].mock.calls.length).toBe(1)
  expect(input[2].mock.calls.length).toBe(2)
  expect(input[2].mock.calls[1][0].productId).toBe(undefined)

  destroy()
})

test('Warning if unknown transition is used.', () => {
  // Mock console.warn.
  const consoleWarn = console.warn
  console.warn = jest.fn()

  const names = ['FirstScreen', 'SecondScreen']
  const input = setupScreens(names)

  const { screens } = render(<Navigation headless={false} />)

  expect(screens.length).toEqual(2)
  expect(input[0].mock.calls.length).toBe(1)

  act(() => {
    // @ts-ignore
    go(names[1], 'unknown')
  })

  act(() => {
    // @ts-ignore
    go(names[0], 'another')
  })

  act(() => {
    go(names[1], 'fast')
  })

  expect(input[0].mock.calls.length).toBe(1)
  expect((console.warn as jest.Mock).mock.calls.length).toBe(2)

  // Restore initial console.
  console.warn = consoleWarn

  destroy()
})

test('Warning if navigating to current screen.', () => {
  // Mock console.warn.
  const consoleWarn = console.warn
  console.warn = jest.fn()

  const names = ['FirstScreen']
  setupScreens(names)

  render(<Navigation headless={false} />)

  act(() => {
    go(names[0])
  })

  expect((console.warn as jest.Mock).mock.calls.length).toBe(1)

  // Restore initial console.
  console.warn = consoleWarn

  destroy()
})

test('Can use enum or string as transition.', () => {
  const names = ['FirstScreen', 'SecondScreen']
  const input = setupScreens(names)

  const { screens } = render(<Navigation headless={false} />)

  expect(screens.length).toEqual(2)
  expect(history.length).toBe(1)

  act(() => {
    go(names[1])
  })

  expect(input[0].mock.calls.length).toBe(1)
  expect(history.length).toBe(2)

  act(() => {
    go(names[0], 'fast')
  })

  act(() => {
    go(names[1], 'peek')
  })

  expect(input[0].mock.calls.length).toBe(2) // backPossible
  expect(history.length).toBe(4)

  act(() => {
    go(names[0], Transition.fast)
  })

  act(() => {
    go(names[1], Transition.peek)
  })

  expect(input[0].mock.calls.length).toBe(2)
  expect(history.length).toBe(6)

  destroy()
})

test('Only one screen visible in headless mode.', () => {
  const names = ['FirstScreen', 'SecondScreen', 'ThirdScreen']
  const input = setupScreens(names)

  const { root } = render(<Navigation headless />)

  let screens = root.findAllByType(Screen)

  expect(screens.length).toBe(1)

  expect(input[0].mock.calls.length).toEqual(1)
  expect(input[0].effectMock.calls.length).toEqual(1)

  act(() => {
    go(names[1])
  })

  expect(history.length).toBe(2)

  screens = root.findAllByType(Screen)
  const texts = root.findAllByType(Text)
  expect(texts.length).toBe(1)
  // @ts-ignore
  const title = texts[0]._fiber
  expect(title.stateNode.props.children).toEqual('SecondScreen')

  expect(screens.length).toBe(1)

  // Back screen not rendered again.
  expect(input[0].mock.calls.length).toEqual(1)
  expect(input[0].effectMock.calls.length).toEqual(1)
  expect(input[1].mock.calls.length).toEqual(1)
  expect(input[1].effectMock.calls.length).toEqual(1)

  act(() => {
    go(names[2])
  })

  screens = root.findAllByType(Screen)

  expect(screens.length).toBe(1)

  expect(input[0].mock.calls.length).toEqual(1)
  // Second screen appears during both transitions.
  expect(input[1].mock.calls.length).toEqual(1)
  expect(input[2].mock.calls.length).toEqual(1)

  destroy()
})

test('Initially shown screen can be configured.', () => {
  const names = ['FirstScreen', 'SecondScreen', 'ThirdScreen']
  const input = setupScreens(names)

  initial('SecondScreen')

  const { screens } = render(<Navigation headless={false} />)

  expect(screens.length).toEqual(2)

  expect(input[0].mock.calls.length).toEqual(0)
  expect(input[1].mock.calls.length).toEqual(1)
  expect(input[1].effectMock.calls.length).toEqual(1)
  expect(input[1].mock.calls.length).toEqual(1)
  expect(input[1].mock.calls[0][1]).toEqual('SecondScreen')
  expect(input[2].mock.calls.length).toEqual(0)

  destroy()
})

test('Initially shown screen can be configured though register.', () => {
  const names = [{ name: 'FirstScreen' }, { name: 'SecondScreen', options: { initial: true } }, { name: 'ThirdScreen' }]
  const input = setupScreens(names)

  const { screens } = render(<Navigation headless={false} />)

  expect(screens.length).toEqual(2)

  expect(input[0].mock.calls.length).toEqual(0)
  expect(input[1].mock.calls.length).toEqual(1)
  expect(input[1].effectMock.calls.length).toEqual(1)
  expect(input[1].mock.calls.length).toEqual(1)
  expect(input[1].mock.calls[0][1]).toEqual('SecondScreen')
  expect(input[2].mock.calls.length).toEqual(0)

  destroy()
})

test('Background of screen can be configured initially and with go().', () => {
  const names = [
    { name: 'FirstScreen' },
    { name: 'SecondScreen', options: { background: 'red' } },
    { name: 'ThirdScreen', options: { background: 'blue', transition: Transition.peek } },
  ]
  setupScreens(names)

  const { root } = render(<Navigation headless={false} />)

  let screens = root.findAllByType(Animated.View)

  expect(mergeObjects(screens[1].props.style).backgroundColor).toBe('white')

  act(() => {
    go(names[1].name)
  })

  screens = root.findAllByType(Animated.View)

  // @ts-ignore
  expect(screens[2]._fiber.key).toEqual('SecondScreen')
  expect(mergeObjects(screens[2].props.style).zIndex).toBe(styles.front.zIndex)
  expect(mergeObjects(screens[2].props.style).backgroundColor).toBe('red')

  act(() => {
    go(names[2].name)
  })

  screens = root.findAllByType(Animated.View)

  // @ts-ignore
  expect(screens[3]._fiber.key).toEqual('ThirdScreen')
  expect(mergeObjects(screens[3].props.style).zIndex).toBe(styles.front.zIndex)
  expect(mergeObjects(screens[3].props.style).backgroundColor).toBe('blue')

  destroy()
})

test('Warning if the same screen is registered multiple times.', () => {
  // Mock console.warn.
  const consoleWarn = console.warn
  console.warn = jest.fn()

  const names = ['FirstScreen', 'FirstScreen']
  setupScreens(names)

  expect((console.warn as jest.Mock).mock.calls[0][0]).toContain('already been registered')

  // Restore initial console.
  console.warn = consoleWarn

  destroy()
})

test("Screens aren't unnecessarly rerendered.", () => {
  const names = ['FirstScreen', 'SecondScreen', 'ThirdScreen']
  const input = setupScreens(names)

  const { screens } = render(<Navigation headless={false} />)

  expect(screens.length).toEqual(2)

  expect(input[0].mock.calls.length).toBe(1)
  expect(input[1].mock.calls.length).toBe(0)

  act(() => {
    go(names[1], 'regular')
  })

  expect(input[0].mock.calls.length).toEqual(1)
  expect(input[1].mock.calls.length).toEqual(1)

  act(() => {
    go(names[2], 'regular')
  })

  expect(input[0].mock.calls.length).toEqual(1)
  expect(input[1].mock.calls.length).toEqual(1)
  expect(input[2].mock.calls.length).toEqual(1)

  act(() => {
    go(names[1], 'regular')
  })

  expect(input[0].mock.calls.length).toEqual(1)
  expect(input[1].mock.calls.length).toEqual(1)
  expect(input[2].mock.calls.length).toEqual(1)

  act(() => {
    go(names[2], 'regular', { productId: 2 })
  })

  expect(input[2].mock.calls.length).toEqual(2) // Rerender required due to props.

  act(() => {
    go(names[1], 'regular')
  })

  expect(input[0].mock.calls.length).toEqual(1)
  expect(input[1].mock.calls.length).toEqual(1)
  expect(input[2].mock.calls.length).toEqual(2)

  act(() => {
    go(names[2], 'regular', { productId: 2 })
  })

  expect(input[2].mock.calls.length).toEqual(2) // No rerender as same props.

  act(() => {
    go(names[1], 'regular')
  })

  expect(input[0].mock.calls.length).toEqual(1)
  expect(input[1].mock.calls.length).toEqual(1)
  expect(input[2].mock.calls.length).toEqual(2)

  act(() => {
    go(names[2], 'regular')
  })

  expect(input[2].mock.calls.length).toEqual(3) // Rerender from switch to no props

  destroy()
})
