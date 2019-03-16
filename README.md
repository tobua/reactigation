# Reactigation

React-only Navigation for React Native.

## Getting Started

```
npm i reactigation
```

## Usage

```js
// App.js
import React from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
import Reactigation, { register, go, back } from 'reacigation'

const FirstScreen = () => (
  <View>
    <Text>FirstScreen</Text>
    <TouchableHighlight onPress={() => go('Second')}>
      <Text>go to SecondScreen</Text>
    </TouchableHighlight>
  </View>
)

const SecondScreen = () => (
  <View>
    <Text>FirstScreen</Text>
    <TouchableHighlight onPress={() => back()}>
      <Text>go back</Text>
    </TouchableHighlight>
  </View>
)

register(FirstScreen, 'First')
register(SecondScreen, 'Second')

export default Reactigation
```

## Example

To run the example app checkout this repository and run the following inside
the root folder

```
npm install
npm run app
cd app
react-native run-ios
```
