import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native'
import Reactigation, { register, go, back, currentScreen } from 'reactigation'

const animations = ['Regular', 'None', 'Slow', 'Fast', 'Opacity', 'Modal']

const styles = StyleSheet.create({
  animations: {
    marginLeft: 20
  },
  text: {
    color: 'black'
  }
})

export default class AnimatedLink extends Component {
  renderAnimations() {
    const { name, showAnimations } = this.props

    if (!showAnimations) {
      return
    }

    return (
      <View style={styles.animations}>
        {animations.map(animation => (
          <TouchableHighlight key={animation} onPress={() => go(name, animation.toLowerCase())}>
            <Text style={styles.text}>{animation} Animation</Text>
          </TouchableHighlight>
        ))}
      </View>
    )
  }

  renderLink() {
    const { name, textStyle, showAnimations } = this.props

    if (showAnimations) {
      return <Text style={textStyle}>Go to {name}Screen</Text>
    }

    return (
      <TouchableHighlight key={name} onPress={() => go(name)}>
        <Text style={textStyle}>Go to {name}Screen</Text>
      </TouchableHighlight>
    )
  }

  render() {
    const { name } = this.props

    return (
      <View key={name}>
        {this.renderLink()}
        {this.renderAnimations()}
      </View>
    )
  }
}
