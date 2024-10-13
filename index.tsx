import React, { useState, useEffect, cloneElement } from 'react'
import { Animated, View, BackHandler, TouchableOpacity } from 'react-native'
import { styles } from './styles'
import startTransition, { initialPosition, connect, isTransitioning, isTransitionValid } from './transition'
import { CustomTransition } from './animations'
import { Transition, Screen, State, TransitionInput, type ScreenProps } from './types'

export { Transition, CustomTransition, type ScreenProps }

// All the registered screens.
const screens: { [key: string]: Screen } = {}
// History of the screens visited.
export const history: Screen[] = []
// Useful for tests when rerendering, but not back on first screen.
export const reset = () => history.splice(0, history.length, history[0])

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
      const index = currentScreenHookListeners.findIndex((listener) => listener === setCurrentScreen)

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
  configuration: { transition?: TransitionInput; background?: string; initial?: boolean } = {
    transition: Transition.regular,
    background: 'white',
    initial: false,
  },
) => {
  const { transition = Transition.regular, background = 'white', initial } = configuration
  const screen: Screen = { Component, transition, background, name }
  if (!name) {
    return console.error('Reactigation: Trying to register a Component without a name as the second argument.')
  }
  if (!isTransitionValid(transition, 'register')) {
    return
  }
  // First registered screen will initially be shown.
  if (!history.length) {
    history.push(screen)
  }
  if (initial) {
    history[0] = screen
  }
  if (name in screens) {
    return console.warn(`Reactigation: Screen "${name}" has already been registered.`)
  }
  screens[name] = screen
}

export const initial = (name: string) => {
  if (!screens[name]) {
    return console.warn(`Reactigation: Trying to set initial screen "${name}" which hasn't been registered yet.`)
  }

  if (history.length === 0) {
    return console.error('Reactigation: Trying to set initial screen before any screens have been registered.')
  }

  history[0] = screens[name]
}

// TODO logs only in development mode.
// Go to certain screen.
export const go = (name: string, transition?: TransitionInput, props?: object) => {
  if (isTransitioning()) {
    return console.warn('Reactigation: Transition already in progress.')
  }
  const currentScreen = screens[name]
  if (!currentScreen) {
    return console.warn(`Reactigation: Screen ${name} wasn't registered.`)
  }
  if (!transition) {
    transition = currentScreen.transition ?? Transition.regular
  }
  if (!isTransitionValid(transition, 'go')) {
    return
  }
  const previousScreen = history[history.length - 1]
  if (previousScreen.name === name) {
    return console.warn(`Reactigation: Already on screen ${name}.`)
  }
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
export const back = (transition?: TransitionInput) => {
  if (isTransitioning()) {
    return console.warn('Reactigation: Transition already in progress.')
  }
  if (history.length === 1) {
    return console.warn('Reactigation: Only one screen left, cannot go back.')
  }

  if (transition && !isTransitionValid(transition, 'back')) {
    return
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

function addHistoryProps(screen: Screen) {
  // TODO are those clones truly necessary?
  const props = { ...screen.props }
  const [bottomScreen, topScreen] = history.slice(-2)

  // topScreen missing for history.length === 1
  if (topScreen && topScreen.name === screen.name) {
    Object.assign(props, topScreen.props ?? {})
  }

  if (bottomScreen.name === screen.name) {
    Object.assign(props, bottomScreen.props ?? {})
  }

  return props
}

const updateScreenView = (screen: Screen, state: State, isNextScreen: boolean) => {
  const newProps = {
    backPossible: history.length > 1,
    title: screen.name,
    ...addHistoryProps(screen),
  }

  if (screen.name in state.renderedScreens) {
    const propsChanged = JSON.stringify(newProps) !== JSON.stringify(state.renderedScreens[screen.name].props)
    if (isNextScreen && propsChanged) {
      // Update rendered screen.
      state.renderedScreens[screen.name] = {
        screen,
        props: newProps,
        view: cloneElement(screen.Component, newProps),
      }
    }
  } else {
    // Initially render screen.
    state.renderedScreens[screen.name] = {
      screen,
      props: newProps,
      view: cloneElement(screen.Component, newProps),
    }
  }
}

function getScreenPosition(name: string, state: State) {
  return {
    isTopOrBottomScreen: name === state.Top.name || name === state.Bottom?.name,
    isTop: name === state.Top.name,
    isBottom: name === state.Bottom?.name,
  }
}

const renderScreen = (screen: Screen, state: State) => {
  const position = getScreenPosition(screen.name, state)
  const isNextScreen = !!((position.isTop && !state.reverse) || (position.isBottom && state.reverse))

  if (!(screen.name in state.renderedScreens) && !position.isTopOrBottomScreen) {
    // Screen doesn't need to be rendered yet.
    return
  }

  if (position.isTopOrBottomScreen) {
    // Only top or bottom screen needs to be added or updated.
    updateScreenView(screen, state, isNextScreen)
  }

  return (
    <Animated.View
      aria-label={screen.name}
      key={screen.name}
      style={[
        styles.screen,
        { backgroundColor: screen.background },
        position.isTop && { left: state.left, top: state.top, opacity: state.opacity },
      ]}
    >
      {state.renderedScreens[screen.name].view}
    </Animated.View>
  )
}

function orderScreens(existingScreens: JSX.Element[], state: State) {
  existingScreens.sort((firstScreen, secondScreen) => {
    const firstName = firstScreen.props['aria-label']
    const secondName = secondScreen.props['aria-label']
    const firstPosition = getScreenPosition(firstName, state)
    const secondPosition = getScreenPosition(secondName, state)

    const getSortPriority = (position: { isTopOrBottomScreen: boolean; isTop: boolean; isBottom: boolean }) => {
      if (position.isTop) {
        return 3
      }
      if (position.isBottom) {
        return 2
      }
      return 1
    }

    return getSortPriority(firstPosition) - getSortPriority(secondPosition)
  })
}

// Disable transitions and render only top screen, useful for programmatic tests.
export default ({ headless = process.env.NODE_ENV === 'test' }) => {
  const [state, setState] = useState<State>(initialPosition(history[0]))
  const afterRender = connect({ setState, state }, headless)

  useEffect(afterRender, [afterRender])

  if (headless) {
    return (
      <View style={styles.stretch}>
        <View style={[styles.screen, { backgroundColor: state.Top.background }]}>
          {cloneElement(state.Top.Component, {
            backPossible: history.length > 1,
            title: state.Top.name,
            ...state.Top.props,
          })}
        </View>
      </View>
    )
  }

  const existingScreens = Object.values(screens)
    .map((screen) => renderScreen(screen, state))
    .filter((screen): screen is NonNullable<typeof screen> => screen !== null && screen !== undefined)

  orderScreens(existingScreens, state)

  // Add to second last position, to be between top and bottom.
  existingScreens.splice(
    existingScreens.length - 1,
    0,
    <View key="backdrop" style={[styles.stretch, state.backdrop ? styles.backdrop : styles.hideBackdrop]}>
      <TouchableOpacity style={styles.stretch} onPress={() => back()} />
    </View>,
  )

  return <View style={styles.stretch}>{existingScreens}</View>
}
