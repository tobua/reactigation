import { Animated } from 'react-native'
import * as animations from './animations'

let setState, state, running
let afterRender = () => {}

const transitionDone = () => (running = false)

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

export default (Top, Bottom, transition = 'regular', reverse = false) => {
  running = true
  // After state is set and new screens rendered, calling this handler starts the animation.
  afterRender =
    animations[transition](state, transitionDone, reverse) || (() => {})

  setState({
    ...state,
    Top: Top,
    Bottom: Bottom,
    reverse,
  })
}
