import React, { Component } from 'react'
import { Animated, Dimensions, View } from 'react-native'

const width = Dimensions.get('window').width

const screens = {}
const history = []
let setState

// Register a screen.
export const register = (Screen, name) => {
  if (!history.length) {
    history.push(Screen)
  }
  screens[name] = Screen
}

// Go to certain screen.
export const go = name => {
  const Screen = screens[name]
  history.push(Screen)
  if (setState && history.length > 1) {
    setState({
      Top: Screen,
      Bottom: history[history.length - 2],
      leftAnimation: new Animated.Value(width)
    }, function() {
      // Trigger Switch Screen Animation.
      Animated.timing(
        this.state.leftAnimation,
        {
          toValue: 0,
          duration: 1000
        }
      ).start()
    })
  }
}

// Go back to previous screen.
export const back = () => {
  if (history.length === 1) {
    return console.warn('Navigator: Only one screen left, cannot go back.')
  }
  history.pop()
  setState({
    Top: history[history.length - 1]
  })
}

export default class Reactigation extends Component {
  constructor(props) {
    super(props)

    setState = this.setState.bind(this)

    this.state = {
      Top: history[0],
      leftAnimation: new Animated.Value(0)
    }
  }

  renderBottom() {
    const { Bottom } = this.state

    if (!Bottom) {
      return
    }

    return (
      <View style={{ flex: 1, position: 'absolute', top: 0 }}>
        <this.state.Bottom />
      </View>
    )
  }

  // Renders the current screen.
  render() {
    const { Top, leftAnimation } = this.state

    return (
      <View style={{ flex: 1 }}>
        <Animated.View style={{ backgroundColor: 'white', flex: 1, position: 'absolute', top: 0, left: leftAnimation }}>
          <Top />
        </Animated.View>
        {this.renderBottom()}
      </View>
    )
  }
}
