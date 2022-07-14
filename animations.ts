import { Animated, Dimensions, Easing } from 'react-native'
import { Transition, State, Animation } from './types'

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

// Transition finish handler.
const handlerLeft =
  (
    value: Animated.Value,
    done: () => void,
    { duration }: { duration: number },
    reverse?: boolean
  ) =>
  () => {
    Animated.timing(value, {
      toValue: reverse ? windowWidth : 0,
      easing: Easing.ease,
      useNativeDriver: false,
      duration,
    }).start(done)
  }

const regular = (duration = 500) => ({
  animation: (state: State, done: () => void, reverse = false) => {
    state.left.setValue(reverse ? 0 : windowWidth)
    state.top.setValue(0)
    state.opacity.setValue(1)

    return handlerLeft(state.left, done, { duration }, reverse)
  },
})

const none = () => ({
  animation: (state: State, done: () => void, reverse = false) => {
    state.left.setValue(reverse ? windowWidth : 0)
    state.top.setValue(0)
    state.opacity.setValue(1)

    done()

    return null
  },
})

const handlerOpacity =
  (
    value: Animated.Value,
    done: () => void,
    { duration }: { duration: number },
    reverse?: boolean
  ) =>
  () => {
    Animated.timing(value, {
      toValue: reverse ? 0 : 1,
      easing: Easing.ease,
      useNativeDriver: false,
      duration,
    }).start(done)
  }

const opacity = (duration = 500) => ({
  animation: (state: State, done: () => void, reverse = false) => {
    state.left.setValue(0)
    state.top.setValue(0)
    state.opacity.setValue(reverse ? 1 : 0)

    return handlerOpacity(
      state.opacity,
      () => {
        // Hide screen after opacity animation done.
        state.left.setValue(reverse ? windowWidth : 0)
        done()
      },
      { duration },
      reverse
    )
  },
})

const handlerTop =
  (
    value: Animated.Value,
    done: () => void,
    { duration }: { duration: number },
    reverse?: boolean
  ) =>
  () => {
    Animated.timing(value, {
      toValue: reverse ? windowHeight : 0,
      easing: Easing.ease,
      useNativeDriver: false,
      duration,
    }).start(done)
  }

const modal = (duration = 500) => ({
  animation: (state: State, done: () => void, reverse = false) => {
    state.left.setValue(0)
    state.top.setValue(reverse ? 0 : windowHeight)
    state.opacity.setValue(1)

    return handlerTop(state.top, done, { duration }, reverse)
  },
})

const handlerTopHalf =
  (
    value: Animated.Value,
    done: () => void,
    { height, duration }: { height: number; duration: number },
    reverse?: boolean
  ) =>
  () => {
    Animated.timing(value, {
      toValue: reverse ? windowHeight : windowHeight / (100 / height),
      easing: Easing.ease,
      useNativeDriver: false,
      duration,
    }).start(done)
  }

const peek = (height = 50, duration = 500) => ({
  backdrop: true,
  animation: (state: State, done: () => void, reverse = false) => {
    state.left.setValue(0)
    state.top.setValue(reverse ? windowHeight / (100 / height) : windowHeight)
    state.opacity.setValue(1)

    return handlerTopHalf(state.top, done, { height, duration }, reverse)
  },
})

export default {
  regular: regular(),
  slow: regular(1000),
  fast: regular(250),
  none: none(),
  opacity: opacity(),
  modal: modal(),
  peek: peek(),
} as Record<Transition, Animation>

export const CustomTransition = {
  regular,
  opacity,
  modal,
  peek,
}
