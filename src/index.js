import React, { Component, cloneElement } from 'react'
import { Animated, View, BackHandler } from 'react-native'
import styles from './styles'
import startTransition, { initial, connect } from './transition'

// All the registered screens.
const screens = {}
// History of the screens visited.
const history = []

// Register a screen.
export const register = (Component, transition = 'regular') => {
  const screen = {
    Component,
    transition,
    name: Component.key
  }
  if (!Component.key) {
    return console.warn('Reactigation: Trying to register a Component without a key.')
  }
  // First registered screen will initially be shown.
  if (!history.length) {
    history.push(screen)
  }
  screens[Component.key] = screen
}

// Go to certain screen.
export const go = (name, transition) => {
  const currentScreen = screens[name]
  if (!currentScreen) {
    return console.warn(`Reactigation: Screen ${name} wasn't registered.`)
  }
  const lastScreen = history[history.length - 1]
  history.push(currentScreen)
  startTransition(
    currentScreen.Component,
    lastScreen.Component,
    transition || currentScreen.transition
  )
}

// Go back to previous screen.
export const back = transition => {
  if (history.length === 1) {
    return console.warn('Reactigation: Only one screen left, cannot go back.')
  }
  const lastScreen = history.pop()
  const currentScreen = history[history.length - 1]

  startTransition(
    lastScreen.Component,
    currentScreen.Component,
    transition || lastScreen.transition,
    true
  )
}

export const currentScreen = () => history[history.length - 1].name

// Go back when the android back button gets pressed.
BackHandler.addEventListener('hardwareBackPress', () => {
  back()
  // Ignore other registered back handlers.
  return true
})

export default class Reactigation extends Component {
  // Allow outside control of setState and set initial screen.
  constructor(props) {
    super(props)
    connect(this.setState.bind(this))
    // Render only screens that have been shown at least once.
    history[0].rendered = true
    this.state = initial(history[0].Component)
  }

  // Renders the Bottom screen if available.
  renderBottom() {
    const { Bottom } = this.state

    if (!Bottom) {
      return
    }

    const BottomWithProps = cloneElement(Bottom, {
      backPossible: history.length > 2
    })

    return (
      <View key={Bottom.key} style={styles.back}>
        {BottomWithProps}
      </View>
    )
  }

  // Renders the Top screen, which should always be available.
  // Movements are animated on the Top Component.
  renderTop() {
    const { Top, left, top, reverse } = this.state

    const TopWithProps = cloneElement(Top, {
      backPossible: history.length > 1 || reverse
    })

    return (
      <Animated.View key={Top.key} style={[styles.front, { left, top }]}>
        {TopWithProps}
      </Animated.View>
    )
  }

  renderScreen(screen) {
    const { Top, Bottom, left, top, reverse } = this.state

    if (screen.name === Top.key) {
      return this.renderTop()
    }

    if (Bottom && screen.name === Bottom.key) {
      return this.renderBottom()
    }

    return (
      <Animated.View key={screen.name} style={[styles.other]}>
        {screen.Component}
      </Animated.View>
    )
  }

  renderScreens() {
    const renderedScreens = Object.keys(screens).map(key => {
      const screen = screens[key]
      return this.renderScreen(screen)
    })

    console.log(`Rendering ${renderedScreens.length} screens.`)

    return renderedScreens
  }

  // Renders the Top and Bottom screen inside a wrapper.
  // The screen last in the array will be on top.
  render() {
    return (
      <View style={styles.wrapper}>
        {this.renderScreens()}
      </View>
    )
  }
}
