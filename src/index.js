import React, { useState, useEffect, cloneElement } from 'react'
import { Animated, View, BackHandler } from 'react-native'
import styles from './styles'
import startTransition, { initial, connect } from './transition'

// All the registered screens.
const screens = {}
// History of the screens visited.
const history = []

// React hook: const screen = useCurrentScreen()
const currentScreenHookListeners = []
const updateCurrentScreenHookListeners = (screen) =>
  currentScreenHookListeners.forEach((listener) => listener(screen))

export const useCurrentScreen = () => {
  const [currentScreen, setCurrentScreen] = useState(history[0].name)

  useEffect(() => {
    currentScreenHookListeners.push(setCurrentScreen)
  }, [])

  return currentScreen
}

// Register a screen.
export const register = (
  Component,
  name,
  { transition, background } = {
    transition: 'regular',
    background: 'white',
  }
) => {
  const screen = {
    Component,
    transition,
    background,
    name,
  }
  if (!name) {
    return console.error(
      'Reactigation: Trying to register a Component without a name as the second argument.'
    )
  }
  // First registered screen will initially be shown.
  if (!history.length) {
    history.push(screen)
  }
  screens[name] = screen
}

// Go to certain screen.
export const go = (name: string, transition?: string, props?: object) => {
  const currentScreen = screens[name]
  if (!currentScreen) {
    return console.warn(`Reactigation: Screen ${name} wasn't registered.`)
  }
  const previousScreen = history[history.length - 1]
  // Make a copy to reuse transition when going back.
  const nextScreen = Object.assign({}, currentScreen, {
    transition: transition || currentScreen.transition,
    props,
  })
  history.push(nextScreen)
  startTransition(nextScreen, previousScreen, nextScreen.transition)
  updateCurrentScreenHookListeners(name)
}

// Go back to previous screen.
export const back = (transition) => {
  if (history.length === 1) {
    return console.warn('Reactigation: Only one screen left, cannot go back.')
  }
  const lastScreen = history.pop()
  const currentScreen = history[history.length - 1]

  startTransition(
    lastScreen,
    currentScreen,
    transition || lastScreen.transition,
    true
  )
  updateCurrentScreenHookListeners(currentScreen.name)
}

export const currentScreen = () => history[history.length - 1].name

// Clear navigation state.
export const destroy = () => {
  history.length = 0
  for (const key in screens) {
    delete screens[key]
  }
}

// Go back when the android back button gets pressed.
BackHandler.addEventListener('hardwareBackPress', () => {
  back()
  // Ignore other registered back handlers.
  return true
})

// Move Top screen to first position, so that it's always visible.
const unshiftTop = (screenKeys, state) => {
  const { Top } = state
  screenKeys.sort((x, y) => (x === Top.name ? 1 : y === Top.name ? -1 : 0))
  return screenKeys
}

const renderScreen = (screen, state) => {
  const { Top, Bottom, left, top, opacity, reverse } = state

  // Renders the Top screen, which should always be available.
  // Movements are animated on the Top Component.
  if (screen.name === Top.name) {
    const TopWithProps = cloneElement(Top.Component, {
      backPossible: history.length > 1 || !!reverse,
      title: Top.name,
      ...Top.props,
    })

    return (
      <Animated.View
        key={Top.name}
        style={[
          styles.front,
          { left, top, opacity, backgroundColor: Top.background },
        ]}
      >
        {TopWithProps}
      </Animated.View>
    )
  }

  // Renders the Bottom screen if available.
  if (Bottom && screen.name === Bottom.name) {
    if (!Bottom) {
      return
    }

    const BottomWithProps = cloneElement(Bottom.Component, {
      backPossible: history.length > 1 && Bottom !== history[0],
      title: Bottom.name,
      ...Bottom.props,
    })

    return (
      <Animated.View
        key={Bottom.name}
        style={[styles.back, { backgroundColor: Bottom.background }]}
      >
        {BottomWithProps}
      </Animated.View>
    )
  }

  const ScreenWithProps = cloneElement(screen.Component, {
    backPossible: history.length > 2,
    title: screen.name,
  })

  return (
    <Animated.View key={screen.name} style={[styles.other]}>
      {ScreenWithProps}
    </Animated.View>
  )
}

const setStateEnd = {
  handler: () => {},
}

export default ({}) => {
  const [state, setState] = useState(initial(history[0]))
  connect({ setState, state, setStateEnd })

  useEffect(() => setStateEnd.handler(), [state])

  const orderedScreenKeys = unshiftTop(Object.keys(screens), state)
  const renderedScreens = orderedScreenKeys.map((key) => {
    const screen = screens[key]
    return renderScreen(screen, state)
  })

  return <View style={styles.wrapper}>{renderedScreens}</View>
}
