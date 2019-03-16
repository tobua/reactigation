import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native'
import Reactigation, { register, go, back } from 'reactigation'

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 50,
    paddingRight: 20,
    paddingBottom: 20,
    paddingLeft: 20
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  description: {
    fontSize: 25
  }
})

class FirstScreen extends Component {
  render() {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>FirstScreen</Text>
        <TouchableHighlight onPress={() => go('Second')}>
          <Text style={styles.description}>Go to SecondScreen</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

class SecondScreen extends Component {
  render() {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>SecondScreen</Text>
        <TouchableHighlight onPress={() => go('First')}>
          <Text style={styles.description}>Go to FirstScreen</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => go('Third')}>
          <Text style={styles.description}>Go to ThirdScreen</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

class ThirdScreen extends Component {
  render() {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>ThirdScreen</Text>
        <TouchableHighlight onPress={() => go('Second')}>
          <Text style={styles.description}>Go to SecondScreen</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

register(FirstScreen, 'First')
register(SecondScreen, 'Second')
register(ThirdScreen, 'Third')

export default Reactigation
