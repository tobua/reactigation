import React, { useState, useEffect, cloneElement } from 'react'
import { Animated, View, BackHandler, TouchableOpacity } from 'react-native'
import { styles } from './styles'
import startTransition, { initial, connect, isTransitioning } from './transition'
import animations from './animations'
import { Animation, Screen, State } from './types'

// All the registered screens.
const screens: { [key: string]: Screen } = {}
// History of the screens visited.
const history: Screen[] = []

// React hook: const screen = useCurrentScreen()
const currentScreenHookListeners: ((screen: string) => void)[] = []
const updateCurrentScreenHookListeners = (screen: string) =>
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
  configuration: { transition: Animation; background: string } = {
    transition: 'regular',
    background: 'white',
  }
) => {
  const { transition = 'regular', background = 'white' } = configuration
  const screen: Screen = { Component, transition, background, name }
  if (!name) {
    return console.error(
      'Reactigation: Trying to register a Component without a name as the second argument.'
    )
  }
  if (!(transition in animations)) {
    return console.warn(
      `Reactigation: Unknown transition ${transition} used when calling register().`
    )
  }
  // First registered screen will initially be shown.
  if (!history.length) {
    history.push(screen)
  }
  screens[name] = screen
}

// Go to certain screen.
export const go = (name: string, transition: Animation = 'regular', props?: object) => {
  if (isTransitioning()) {
    return console.warn('Reactigation: Transition already in progress.')
  }
  const currentScreen = screens[name]
  if (!currentScreen) {
    return console.warn(`Reactigation: Screen ${name} wasn't registered.`)
  }
  if (!(transition in animations)) {
    return console.warn(`Reactigation: Unknown transition ${transition} used when calling go().`)
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
export const back = (transition?: Animation) => {
  if (isTransitioning()) {
    return console.warn('Reactigation: Transition already in progress.')
  }
  if (history.length === 1) {
    return console.warn('Reactigation: Only one screen left, cannot go back.')
  }
  if (transition && !(transition in animations)) {
    return console.warn(`Reactigation: Unknown transition ${transition} used when calling back().`)
  }

  const lastScreen = history.pop() as Screen
  const backTransition = transition || lastScreen.transition // Use reverse of go transition if none specified.
  const currentScreen = history[history.length - 1]

  startTransition(lastScreen, currentScreen, backTransition, true)
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

const renderBottom = ({ Bottom }: { Bottom: Screen | null }) => {
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

const renderTop = ({ Top, reverse, left, top, opacity, backdrop }: State) => {
  const TopWithProps = cloneElement(Top.Component, {
    backPossible: history.length > 1 || !!reverse,
    title: Top.name,
    ...Top.props,
  })

  const screen = (
    <Animated.View
      key={`${Top.name}_top`}
      style={[styles.front, { left, top, opacity, backgroundColor: Top.background }]}
    >
      {TopWithProps}
    </Animated.View>
  )

  if (backdrop) {
    return (
      <View key={`${Top.name}_top`} style={styles.stretch}>
        <View style={styles.backdrop}>
          <TouchableOpacity style={styles.stretch} onPress={() => back()} />
        </View>
        {screen}
      </View>
    )
  }

  return screen
}

export default () => {
  const [state, setState] = useState<State>(initial(history[0]))
  const afterRender = connect({ setState, state })

  useEffect(afterRender, [afterRender])

  const Top = renderTop(state)
  const Bottom = renderBottom(state)

  return <View style={styles.stretch}>{[Bottom, Top]}</View>
}
