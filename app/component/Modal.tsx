import React, { useRef } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Platform, TouchableHighlight } from 'react-native'
import { go, back, CustomTransition, ScreenProps } from 'reactigation'

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
  count: {
    position: 'absolute',
    right: 80,
    top: Platform.OS === 'ios' ? 44 : 16,
    color: 'black',
    backgroundColor: '#61dafb',
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: 'black',
  },
  countText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  description: {
    fontSize: 25,
    color: 'black',
  },
})

const AlmostFullPeek = CustomTransition.peek(20)

export const Modal = ({ title }: ScreenProps) => {
  const renderCount = useRef(0)

  renderCount.current += 1

  return (
    <View style={styles.modal}>
      <View style={styles.count}>
        <Text style={styles.countText}>{renderCount.current}</Text>
      </View>
      <TouchableHighlight underlayColor="white" style={styles.closeTouchable} onPress={() => back()}>
        <Text style={styles.close}>Close</Text>
      </TouchableHighlight>
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
}
