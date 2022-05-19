import { Animated, Dimensions, Easing } from 'react-native'
import { Animation, State } from './types'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

// Animation finish handler.
const handlerLeft =
  (value: Animated.Value, done: () => void, reverse?: boolean, duration = 500) =>
  () => {
    Animated.timing(value, {
      toValue: reverse ? width : 0,
      easing: Easing.ease,
      useNativeDriver: false,
      duration,
    }).start(done)
  }

const regular = {
  animation: (state: State, done: () => void, reverse = false) => {
    state.left.setValue(reverse ? 0 : width)
    state.top.setValue(0)
    state.opacity.setValue(1)

    return handlerLeft(state.left, done, reverse)
  },
}

const slow = {
  animation: (state: State, done: () => void, reverse = false) => {
    state.left.setValue(reverse ? 0 : width)
    state.top.setValue(0)
    state.opacity.setValue(1)

    return handlerLeft(state.left, done, reverse, 1000)
  },
}

const fast = {
  animation: (state: State, done: () => void, reverse = false) => {
    state.left.setValue(reverse ? 0 : width)
    state.top.setValue(0)
    state.opacity.setValue(1)

    return handlerLeft(state.left, done, reverse, 250)
  },
}

const none = {
  animation: (state: State, done: () => void, reverse = false) => {
    state.left.setValue(reverse ? width : 0)
    state.top.setValue(0)
    state.opacity.setValue(1)

    done()

    return null
  },
}

const handlerOpacity =
  (value: Animated.Value, done: () => void, reverse?: boolean, duration = 500) =>
  () => {
    Animated.timing(value, {
      toValue: reverse ? 0 : 1,
      easing: Easing.ease,
      useNativeDriver: false,
      duration,
    }).start(done)
  }

const opacity = {
  animation: (state: State, done: () => void, reverse = false) => {
    state.left.setValue(0)
    state.top.setValue(0)
    state.opacity.setValue(reverse ? 1 : 0)

    return handlerOpacity(
      state.opacity,
      () => {
        // Hide screen after opacity animation done.
        state.left.setValue(reverse ? width : 0)
        done()
      },
      reverse
    )
  },
}

const handlerTop =
  (value: Animated.Value, done: () => void, reverse?: boolean, duration = 500) =>
  () => {
    Animated.timing(value, {
      toValue: reverse ? height : 0,
      easing: Easing.ease,
      useNativeDriver: false,
      duration,
    }).start(done)
  }

const modal = {
  animation: (state: State, done: () => void, reverse = false) => {
    state.left.setValue(0)
    state.top.setValue(reverse ? 0 : height)
    state.opacity.setValue(1)

    return handlerTop(state.top, done, reverse)
  },
}

const handlerTopHalf =
  (value: Animated.Value, done: () => void, reverse?: boolean, duration = 500) =>
  () => {
    Animated.timing(value, {
      toValue: reverse ? height : height / 2,
      easing: Easing.ease,
      useNativeDriver: false,
      duration,
    }).start(done)
  }

const peek = {
  backdrop: true,
  animation: (state: State, done: () => void, reverse = false) => {
    state.left.setValue(0)
    state.top.setValue(reverse ? height / 2 : height)
    state.opacity.setValue(1)

    return handlerTopHalf(state.top, done, reverse)
  },
}

type AnimationHandler = (state: State, done: () => void, reverse?: boolean) => (() => void) | null

export default {
  regular,
  slow,
  fast,
  none,
  opacity,
  modal,
  peek,
} as Record<
  Animation,
  {
    backdrop?: boolean
    animation: AnimationHandler
  }
>
