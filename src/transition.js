import { Animated } from 'react-native'
import * as animations from './animations'

let setState, state, setStateEnd

// Connects to Reactigation Component's setState.
export const connect = (current) => {
  state = current.state
  setState = current.setState
  setStateEnd = current.setStateEnd
}

// Sets initial screen and values.
export const initial = (Top) => ({
  Top,
  Bottom: null,
  left: new Animated.Value(0),
  top: new Animated.Value(0),
  opacity: new Animated.Value(1),
})

export default (Top, Bottom, transition = 'regular', reverse = false) => {
  // After the state was set, this handler is called, starting the animation.
  setStateEnd.handler = animations[transition](state, reverse) || (() => {})

  setState({
    ...state,
    Top: Top,
    Bottom: Bottom,
    reverse,
  })
}
