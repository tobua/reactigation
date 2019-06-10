import * as animations from './animations'

let setState

// Connects to Reactigation Component's setState.
export const connect = newSetState => (setState = newSetState)

// Sets initial screen and values.
export const initial = Top => ({
  Top,
  Bottom: null,
  left: 0,
  top: 0
})

export default (Top, Bottom, transition = 'regular', reverse = false) => {
  const animation = animations[transition](reverse)

  setState({
      Top: Top,
      Bottom: Bottom,
      reverse,
      ...animation.values
    },
    // After the state was set, this handler is called, starting the animation.
    animation.handler
  )
}
