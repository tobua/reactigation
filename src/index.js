import React, { useState, useEffect, cloneElement } from 'react'
import { Animated, View, BackHandler } from 'react-native'
import styles from './styles'
import startTransition, { initial, connect } from './transition'

// All the registered screens.
const screens = {}
// History of the screens visited.
const history = []

// Register a screen.
export const register = (Component, name, transition = 'regular') => {
  const screen = {
    Component,
    transition,
    name,
  }
  if (!name) {
    return console.error(
      'Reactigation: Trying to register a Component without a name as the second argument.'
    )
  }
  // First registered screen will initially be shown.
  if (!history.length) {
    screen.first = true
    history.push(screen)
  }
  screens[name] = screen
}

// Go to certain screen.
export const go = (name, transition) => {
  const currentScreen = screens[name]
  if (!currentScreen) {
    return console.warn(`Reactigation: Screen ${name} wasn't registered.`)
  }
  const lastScreen = history[history.length - 1]
  // Make a copy to reuse transition when going back.
  const currentScreenCopy = Object.assign({}, currentScreen, { first: false })
  currentScreenCopy.transition = transition || currentScreen.transition
  history.push(currentScreenCopy)
  startTransition(currentScreen, lastScreen, currentScreenCopy.transition)
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
    })

    return (
      <Animated.View
        key={Top.name}
        style={[styles.front, { left, top, opacity }]}
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
      backPossible: history.length > 1 && !Bottom.first,
      title: Bottom.name,
    })

    return (
      <Animated.View key={Bottom.name} style={styles.back}>
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

  useEffect(() => {
    setStateEnd.handler()
  }, [state])

  const orderedScreenKeys = unshiftTop(Object.keys(screens), state)
  const renderedScreens = orderedScreenKeys.map((key) => {
    const screen = screens[key]
    return renderScreen(screen, state)
  })

  return <View style={styles.wrapper}>{renderedScreens}</View>
}
