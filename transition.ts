import { Animated } from 'react-native'
import animations from './animations'
import { Transition, Screen, State, TransitionInput } from './types'

let setState: (state: State) => void, state: State, running: boolean
let afterRender = () => {}
let options = { headless: false }

// Connects to Reactigation Component's setState.
export const connect = (
  current: { setState: (state: State) => void; state: State },
  headless: boolean,
) => {
  state = current.state
  setState = current.setState
  options.headless = headless

  return afterRender
}

// Sets initial screen and values.
export const initialPosition: (Top: Screen) => State = (Top) => ({
  Top,
  Bottom: null,
  left: new Animated.Value(0),
  top: new Animated.Value(0),
  opacity: new Animated.Value(1),
})

export const isTransitioning = () => running

export const isTransitionValid = (transition: TransitionInput, method: string) => {
  if (typeof transition === 'string') {
    if (!(transition in animations)) {
      console.warn(`Reactigation: Unknown transition ${transition} used when calling ${method}().`)
      return false
    }
  } else {
    if (typeof transition !== 'object' || typeof transition.animation !== 'function') {
      console.warn(`Reactigation: Invalid transition used when calling ${method}().`)
      return false
    }
  }

  return true
}

export default (
  Top: Screen,
  Bottom: Screen,
  animation: TransitionInput = Transition.regular,
  reverse = false,
) => {
  const transition = typeof animation === 'string' ? animations[animation] : animation
  running = true
  const done = () => {
    running = false
    if (reverse && transition.backdrop) {
      setState({ ...state, backdrop: false })
    }
  }

  // After state is set and new screens rendered, calling this handler starts the animation.
  afterRender = options.headless
    ? () => {}
    : transition.animation(state, done, reverse) || (() => {})

  // Skip animation.
  if (options.headless) {
    state.left.setValue(0)
    state.top.setValue(0)
    running = false

    if (reverse) {
      Top = Bottom
    }
  }

  // TODO check if both Top and Bottom can be null or undefined in the lifecycle.
  setState({
    ...state,
    Top,
    Bottom,
    reverse,
    backdrop: transition.backdrop,
  })
}
