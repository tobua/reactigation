import { Animated } from 'react-native'

export type Screen = {
  name: string
  Component: JSX.Element
  transition: Animation
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

export type Animation = 'regular' | 'slow' | 'fast' | 'none' | 'opacity' | 'modal' | 'peek'
