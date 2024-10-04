import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  stretch: {
    flex: 1,
  },
  screen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'black',
    opacity: 0.5,
  },
  hideBackdrop: {
    display: 'none',
    pointerEvents: 'none',
  },
})
