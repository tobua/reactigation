import { Animated, Dimensions, Easing } from 'react-native'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

// Animations on left position.
const leftValue = reverse => new Animated.Value(reverse ? 0 : width)
const leftHandler = (reverse, duration = 500) => function() {
  Animated.timing(
    this.state.left,
    {
      toValue: reverse ? width : 0,
      easing: Easing.ease,
      duration: 500
    }
  ).start()
}

export const regular = (reverse = false) => ({
  values: {
    left: leftValue(reverse),
    top: 0
  },
  handler: leftHandler(reverse)
})

export const slow = (reverse = false) => ({
  values: {
    left: leftValue(reverse),
    top: 0
  },
  handler: leftHandler(reverse, 1000)
})

export const fast = (reverse = false) => ({
  values: {
    left: leftValue(reverse),
    top: 0
  },
  handler: leftHandler(reverse, 250)
})

// Animations on top position.
const topValue = reverse => new Animated.Value(reverse ? 0 : height)
const topHandler = reverse => function() {
  Animated.timing(
    this.state.top,
    {
      toValue: reverse ? height : 0,
      easing: Easing.ease,
      duration: 500
    }
  ).start()
}

export const modal = (reverse = false) => ({
  values: {
    left: 0,
    top: topValue(reverse)
  },
  handler: topHandler(reverse)
})
