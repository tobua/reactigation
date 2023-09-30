import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { go } from 'reactigation'

const animations = ['Regular', 'None', 'Slow', 'Fast', 'Opacity', 'Modal']

const styles = StyleSheet.create({
  animations: {
    marginLeft: 20,
    marginBottom: 10,
  },
  text: {
    color: 'black',
  },
  hasAnimations: {
    marginBottom: 5,
  },
})

const renderLink = ({ name, textStyle, showAnimations }) => {
  if (showAnimations) {
    return <Text style={[textStyle, styles.hasAnimations]}>Go to {name}Screen</Text>
  }

  return (
    <TouchableOpacity key={name} onPress={() => go(name)}>
      <Text style={textStyle}>Go to {name}Screen</Text>
    </TouchableOpacity>
  )
}

export const AnimatedLink = (props) => (
  <View key={props.name}>
    {renderLink(props)}
    {props.showAnimations && (
      <View style={styles.animations}>
        {animations.map((animation) => (
          <TouchableOpacity key={animation} onPress={() => go(props.name, animation.toLowerCase())}>
            <Text style={styles.text}>{animation} Animation</Text>
          </TouchableOpacity>
        ))}
      </View>
    )}
  </View>
)
