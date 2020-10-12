import { Animated, Dimensions, Easing } from 'react-native'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

// Animation finish handler.
const handlerLeft = (value, reverse, duration = 500) => () => {
  Animated.timing(value, {
    toValue: reverse ? width : 0,
    easing: Easing.ease,
    useNativeDriver: false,
    duration
  }).start()
}

export const regular = (state, reverse = false) => {
  state.left.setValue(reverse ? 0 : width)
  state.top.setValue(0)
  state.opacity.setValue(1)

  return handlerLeft(state.left, reverse)
}

export const slow = (state, reverse = false) => {
  state.left.setValue(reverse ? 0 : width)
  state.top.setValue(0)
  state.opacity.setValue(1)

  return handlerLeft(state.left, reverse, 1000)
}

export const fast = (state, reverse = false) => {
  state.left.setValue(reverse ? 0 : width)
  state.top.setValue(0)
  state.opacity.setValue(1)

  return handlerLeft(state.left, reverse, 250)
}

export const none = (state, reverse = false) => {
  state.left.setValue(reverse ? width : 0)
  state.top.setValue(0)
  state.opacity.setValue(1)

  return null
}

const handlerOpacity = (value, reverse, done, duration = 500) => () => {
  Animated.timing(value, {
    toValue: reverse ? 0 : 1,
    easing: Easing.ease,
    useNativeDriver: false,
    duration
  }).start(done)
}

export const opacity = (state, reverse = false) => {
  state.left.setValue(0)
  state.top.setValue(0)
  state.opacity.setValue(reverse ? 1 : 0)

  return handlerOpacity(state.opacity, reverse, () => {
      // Hide screen after opacity animation done.
      state.left.setValue(reverse ? width : 0)
  })
}

const handlerTop = (value, reverse, duration = 500) => () => {
  Animated.timing(value, {
    toValue: reverse ? height : 0,
    easing: Easing.ease,
    useNativeDriver: false,
    duration
  }).start()
}

export const modal = (state, reverse = false) => {
  state.left.setValue(0)
  state.top.setValue(reverse ? 0 : height)
  state.opacity.setValue(1)

  return handlerTop(state.top, reverse)
}
