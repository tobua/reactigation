import React, { useState, useEffect, cloneElement } from 'react'
import { Animated, View, BackHandler } from 'react-native'
import styles from './styles'
import startTransition, {
  initial,
  connect,
  isTransitioning,
} from './transition'

type History = {
  name: string,
  Component: JSX.Element,
  transition: string,
  background: string,
}

// All the registered screens.
const screens = {}
// History of the screens visited.
const history: History[] = []

// React hook: const screen = useCurrentScreen()
const currentScreenHookListeners = []
const updateCurrentScreenHookListeners = (screen) =>
  currentScreenHookListeners.forEach((listener) => listener(screen))

export const useCurrentScreen = () => {
  const initialScreenName = history[history.length - 1].name
  const [currentScreen, setCurrentScreen] = useState(initialScreenName)

  useEffect(() => {
    currentScreenHookListeners.push(setCurrentScreen)

    // Clear up old listeners.
    return () => {
      const index = currentScreenHookListeners.findIndex(
        (listener) => listener === setCurrentScreen
      )

      if (index !== -1) {
        currentScreenHookListeners.splice(index, 1)
      }
    }
  }, [])

  return currentScreen
}

// Register a screen.
export const register = (
  Component: JSX.Element,
  name: string,
  { transition, background } = {
    transition: 'regular',
    background: 'white',
  }
) => {
  const screen = { Component, transition, background, name }
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
  if (isTransitioning()) {
    return console.warn('Reactigation: Transition already in progress.')
  }
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
export const back = (transition?: string) => {
  if (isTransitioning()) {
    return console.warn('Reactigation: Transition already in progress.')
  }
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

const renderBottom = ({ Bottom }) => {
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
      key={`${Bottom.name}_bottom`}
      style={[styles.back, { backgroundColor: Bottom.background }]}
    >
      {BottomWithProps}
    </Animated.View>
  )
}

const renderTop = ({ Top, reverse, left, top, opacity }) => {
  const TopWithProps = cloneElement(Top.Component, {
    backPossible: history.length > 1 || !!reverse,
    title: Top.name,
    ...Top.props,
  })

  return (
    <Animated.View
      key={`${Top.name}_top`}
      style={[
        styles.front,
        { left, top, opacity, backgroundColor: Top.background },
      ]}
    >
      {TopWithProps}
    </Animated.View>
  )
}

export default () => {
  const [state, setState] = useState(initial(history[0]))
  const afterRender = connect({ setState, state })

  useEffect(afterRender, [afterRender])

  const Top = renderTop(state)
  const Bottom = renderBottom(state)

  return <View style={styles.wrapper}>{[Bottom, Top]}</View>
}
