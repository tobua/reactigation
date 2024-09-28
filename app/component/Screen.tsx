import React, { useRef } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, TouchableHighlight, Platform, Image } from 'react-native'
import { go, back, type ScreenProps } from 'reactigation'
import { AnimatedLink } from './AnimatedLink'
import logo from '../logo.png'

// Shadow styles with iOS Compatibility (elevation).
const shadow = () => ({
  shadowOpacity: 0.25,
  shadowRadius: 3,
  shadowOffset: {
    height: 0,
    width: 0,
  },
  elevation: 5,
})

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
    paddingRight: 20,
    paddingLeft: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    ...shadow(),
  },
  headerPlaceholder: {},
  body: {
    flex: 1,
    paddingBottom: 20,
    paddingRight: 20,
    paddingLeft: 20,
  },
  backTouchable: {
    position: 'absolute',
    left: 20,
    top: Platform.OS === 'ios' ? 56 : 16,
    backgroundColor: 'black',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingRight: 20,
    paddingBottom: 8,
    paddingLeft: 20,
    marginRight: 20,
    borderWidth: 2,
    borderColor: 'black',
  },
  back: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
  },
  count: {
    position: 'absolute',
    right: 20,
    top: Platform.OS === 'ios' ? 56 : 16,
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
    marginBottom: 10,
    color: 'black',
  },
  about: {
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    marginBottom: 20,
    width: 112.5,
    height: 125,
  },
})

export const Screen = ({
  title,
  links = [],
  showAnimations,
  backPossible,
}: ScreenProps & { links?: string[]; showAnimations?: boolean }) => {
  const renderCount = useRef(0)

  renderCount.current += 1

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        {!backPossible ? (
          <View style={styles.headerPlaceholder} />
        ) : (
          <TouchableHighlight underlayColor="lightgray" style={styles.backTouchable} onPress={() => back()}>
            <Text style={styles.back}>Back</Text>
          </TouchableHighlight>
        )}
        <Text style={styles.title}>{title}</Text>
        <View style={styles.count}>
          <Text style={styles.countText}>{renderCount.current}</Text>
        </View>
      </View>
      <View style={styles.body}>
        {links.map((linkName) => (
          <AnimatedLink key={linkName} name={linkName} textStyle={styles.description} showAnimations={showAnimations} />
        ))}
        <TouchableOpacity onPress={() => go('Modal', 'modal')}>
          <Text style={styles.description}>Open Modal</Text>
        </TouchableOpacity>
        {title !== 'First' && (
          <TouchableOpacity onPress={() => back('opacity')}>
            <Text style={styles.description}>Back Using Opacity</Text>
          </TouchableOpacity>
        )}
      </View>
      {title === 'First' && (
        <View style={styles.about}>
          <Image style={styles.logo} source={logo} />
          <Text>reactigation Demo</Text>
        </View>
      )}
    </View>
  )
}
