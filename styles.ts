import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  stretch: {
    flex: 1,
  },
  screen: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
  },
  hidden: {
    zIndex: 1,
  },
  front: { zIndex: 99 },
  back: { zIndex: 97 },
  backdrop: {
    zIndex: 98,
    flex: 1,
    backgroundColor: 'black',
    opacity: 0.5,
  },
})
