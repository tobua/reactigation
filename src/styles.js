import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  front: {
    backgroundColor: 'white',
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
  },
  back: {
    backgroundColor: 'white',
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
  },
  other: {
    // Rendered, but somewhere outside the screen.
    flex: 1,
    position: 'absolute',
    top: -999,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
})
