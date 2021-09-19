import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native'
import { go, back } from 'reactigation'

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
    paddingRight: 20,
    paddingLeft: 20,
  },
  closeTouchable: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    backgroundColor: 'black',
    padding: 5,
    borderRadius: 5,
    zIndex: 2,
  },
  close: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
  },
  description: {
    fontSize: 25,
    color: 'black',
  },
})

export const Modal = ({ title }) => (
  <View style={styles.modal}>
    <StatusBar backgroundColor="white" barStyle="dark-content" />
    <TouchableOpacity
      underlayColor="white"
      style={styles.closeTouchable}
      onPress={() => back()}
    >
      <Text style={styles.close}>Close</Text>
    </TouchableOpacity>
    <Text style={styles.title}>{title}</Text>
    <TouchableOpacity onPress={() => go('AnotherModal')}>
      <Text style={styles.description}>Open Another Modal</Text>
    </TouchableOpacity>
  </View>
)
