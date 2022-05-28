import { Animated } from 'react-native'

export type Screen = {
  name: string
  Component: JSX.Element
  transition: Transition | TransitionString
  background: string
  props?: Object
}

export type State = {
  top: Animated.Value
  left: Animated.Value
  opacity: Animated.Value
  backdrop?: boolean
  Top: Screen
  Bottom: Screen | null
  reverse?: boolean
}

export enum Transition {
  regular = 'regular',
  slow = 'slow',
  fast = 'fast',
  none = 'none',
  opacity = 'opacity',
  modal = 'modal',
  peek = 'peek',
}

export type TransitionString = 'regular' | 'slow' | 'fast' | 'none' | 'opacity' | 'modal' | 'peek'
