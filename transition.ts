import { Animated } from 'react-native'
import animations from './animations'
import { Animation, Screen, State } from './types'

let setState: (state: State) => void, state: State, running: boolean
let afterRender = () => {}

// Connects to Reactigation Component's setState.
export const connect = (current: { setState: (state: State) => void; state: State }) => {
  state = current.state
  setState = current.setState

  return afterRender
}

// Sets initial screen and values.
export const initial: (Top: Screen) => State = (Top) => ({
  Top,
  Bottom: null,
  left: new Animated.Value(0),
  top: new Animated.Value(0),
  opacity: new Animated.Value(1),
})

export const isTransitioning = () => running

export default (Top: Screen, Bottom: Screen, animation: Animation = 'regular', reverse = false) => {
  const transition = animations[animation]
  running = true
  const done = () => {
    running = false
    if (reverse && transition.backdrop) {
      setState({ ...state, backdrop: false })
    }
  }

  // After state is set and new screens rendered, calling this handler starts the animation.
  afterRender = transition.animation(state, done, reverse) || (() => {})

  // TODO check if both Top and Bottom can be null or undefined in the lifecycle.
  setState({
    ...state,
    Top,
    Bottom,
    reverse,
    backdrop: transition.backdrop,
  })
}
