import { Animated } from 'react-native'
import * as animations from './animations'

let setState, state, running
let afterRender = () => {}

// Connects to Reactigation Component's setState.
export const connect = (current) => {
  state = current.state
  setState = current.setState

  return afterRender
}

// Sets initial screen and values.
export const initial = (Top) => ({
  Top,
  Bottom: null,
  left: new Animated.Value(0),
  top: new Animated.Value(0),
  opacity: new Animated.Value(1),
})

export const isTransitioning = () => running

export default (Top, Bottom, transitionName = 'regular', reverse = false) => {
  const transition = animations[transitionName]
  const configuration =
    typeof transition === 'function' ? { animation: transition } : transition
  running = true
  const done = () => {
    running = false
    if (reverse && configuration.backdrop) {
      setState({ ...state, backdrop: false })
    }
  }
  // After state is set and new screens rendered, calling this handler starts the animation.
  afterRender = configuration.animation(state, done, reverse) || (() => {})

  setState({
    ...state,
    Top: Top,
    Bottom: Bottom,
    reverse,
    backdrop: configuration.backdrop,
  })
}
