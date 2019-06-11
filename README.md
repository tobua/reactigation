# Reactigation

JS-only Navigation for React Native.

## Getting Started

```
npm i reactigation
```

## Usage

```jsx
// App.js
import React from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
import Reactigation, { register, go, back } from 'reacigation'

const FirstScreen = props => (
  <View>
    <Text>{props.title}</Text>
    <TouchableHighlight onPress={() => go('Second')}>
      <Text>go to SecondScreen</Text>
    </TouchableHighlight>
  </View>
)

const SecondScreen = props => (
  <View>
    <Text>{props.title}</Text>
    <TouchableHighlight onPress={() => back()}>
      <Text>go back</Text>
    </TouchableHighlight>
  </View>
)

register(<FirstScreen />, 'First')
register(<SecondScreen />, 'Second')

export default Reactigation
```

## Running the Example App

The example app shown on top is found in the repository. Run it by cloning this repository and then executing the following commands inside the main directory.

npm install
npm run app --silent
cd app
react-native run-ios
