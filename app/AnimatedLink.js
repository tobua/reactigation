import React from 'react'
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native'
import { go } from 'reactigation'

const animations = ['Regular', 'None', 'Slow', 'Fast', 'Opacity', 'Modal']

const styles = StyleSheet.create({
  animations: {
    marginLeft: 20,
  },
  text: {
    color: 'black',
  },
})

const renderLink = ({ name, textStyle, showAnimations }) => {
  if (showAnimations) {
    return <Text style={textStyle}>Go to {name}Screen</Text>
  }

  return (
    <TouchableHighlight key={name} onPress={() => go(name)}>
      <Text style={textStyle}>Go to {name}Screen</Text>
    </TouchableHighlight>
  )
}

export const AnimatedLink = (props) => (
  <View key={props.name}>
    {renderLink(props)}
    {props.showAnimations && (
      <View style={styles.animations}>
        {animations.map((animation) => (
          <TouchableHighlight
            key={animation}
            onPress={() => go(props.name, animation.toLowerCase())}
          >
            <Text style={styles.text}>{animation} Animation</Text>
          </TouchableHighlight>
        ))}
      </View>
    )}
  </View>
)
