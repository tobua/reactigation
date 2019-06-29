import { Animated } from 'react-native'
import * as animations from './animations'

let instance

// Connects to Reactigation Component's setState.
export const connect = newInstance => (instance = newInstance)

// Sets initial screen and values.
export const initial = Top => ({
  Top,
  Bottom: null,
  left: new Animated.Value(0),
  top: new Animated.Value(0),
  opacity: new Animated.Value(1)
})

export default (Top, Bottom, transition = 'regular', reverse = false) => {
  const handler = animations[transition](instance.state, reverse)

  instance.setState({
      Top: Top,
      Bottom: Bottom,
      reverse
    },
    // After the state was set, this handler is called, starting the animation.
    handler
  )
}
