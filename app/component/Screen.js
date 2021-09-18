import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native'
import { go, back } from 'reactigation'
import { AnimatedLink } from './AnimatedLink'

// Shadow styles with iOS Compatibility (elevation).
const shadow = () => ({
  shadowOpacity: 0.25,
  shadowRadius: 3,
  shadowOffset: {
    height: 0,
  },
  elevation: 5,
})

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
    paddingRight: 20,
    paddingLeft: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    ...shadow(),
  },
  body: {
    flex: 1,
    paddingBottom: 20,
    paddingRight: 20,
    paddingLeft: 20,
  },
  backTouchable: {
    position: 'absolute',
    flex: 1,
    left: 20,
    top: Platform.OS === 'ios' ? 46 : 16,
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
  description: {
    fontSize: 25,
    color: 'black',
  },
})

export const Screen = ({ title, links, showAnimations, backPossible }) => (
  <View style={styles.screen}>
    <View style={styles.header}>
      {!backPossible ? (
        <View style={styles.headerPlaceholder} />
      ) : (
        <TouchableOpacity
          underlayColor="white"
          style={styles.backTouchable}
          onPress={() => back()}
        >
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
    <View style={styles.body}>
      {links.map((linkName) => (
        <AnimatedLink
          key={linkName}
          name={linkName}
          textStyle={styles.description}
          showAnimations={showAnimations}
        />
      ))}
      <TouchableOpacity onPress={() => go('Modal')}>
        <Text style={styles.description}>Open Modal</Text>
      </TouchableOpacity>
    </View>
  </View>
)
