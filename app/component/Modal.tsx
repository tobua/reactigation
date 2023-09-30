import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native'
import { go, back, CustomTransition } from 'reactigation'

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
    marginBottom: 20,
  },
  description: {
    fontSize: 25,
    color: 'black',
  },
})

const AlmostFullPeek = CustomTransition.peek(20)

export const Modal = ({ title }) => (
  <View style={styles.modal}>
    <TouchableOpacity underlayColor="white" style={styles.closeTouchable} onPress={() => back()}>
      <Text style={styles.close}>Close</Text>
    </TouchableOpacity>
    <Text style={styles.title}>{title}</Text>
    {title !== 'PeekModal' && (
      <>
        <TouchableOpacity onPress={() => go('PeekModal')}>
          <Text style={styles.description}>Peek Another Modal</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => go('PeekModal', AlmostFullPeek)}>
          <Text style={styles.description}>Peek Further</Text>
        </TouchableOpacity>
      </>
    )}
  </View>
)
