import type { Animated } from 'react-native'

export type AnimationHandler = (state: State, done: () => void, reverse?: boolean) => (() => void) | null

export type Animation = {
  backdrop?: boolean
  animation: AnimationHandler
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

export type TransitionInput = Transition | TransitionString | Animation

export type Screen = {
  name: string
  Component: JSX.Element
  transition: TransitionInput
  background: string
  props?: Object
}

export type ScreenProps = { backPossible: boolean; title: string }

export type Props = ScreenProps & { [key: string]: any }

export type State = {
  top: Animated.Value
  left: Animated.Value
  opacity: Animated.Value
  backdrop?: boolean
  Top: Screen
  Bottom?: Screen
  reverse?: boolean
  renderedScreens: { [key: string]: { screen: Screen; props: Props; view?: JSX.Element } }
}
