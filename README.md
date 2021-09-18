<p align="center">
  <img src="https://github.com/tobua/reactigation/raw/master/video.gif" alt="Reactigation" width="250">
</p>

# Reactigation

JS-only Navigation for React Native.

## Installation

```
npm i reactigation
```

## Usage

A minimal setup with two screens looks like this.

```jsx
import React from 'react'
import { AppRegistry, View, Text, TouchableHighlight } from 'react-native'
import Reactigation, { register, go, back } from 'reactigation'

const FirstScreen = (props) => (
  <View style={{ margin: 50 }}>
    <Text>{props.title} Screen</Text>
    <TouchableHighlight onPress={() => go('Second')}>
      <Text>go to SecondScreen</Text>
    </TouchableHighlight>
  </View>
)

const SecondScreen = (props) => (
  <View style={{ margin: 50 }}>
    <Text>{props.title} Screen</Text>
    <TouchableHighlight onPress={() => back()}>
      <Text>go back</Text>
    </TouchableHighlight>
  </View>
)

register(<FirstScreen />, 'First')
register(<SecondScreen />, 'Second')

AppRegistry.registerComponent('NavigationApp', () => Reactigation)
```

## Navigating to a Screen

At runtime it's possible to navigate to any of the registered screens. A transition is how the switch between two screens looks like. For each navigation the transition can be configured.

`go(screen: string, transition?: string, props?: object)`

```jsx
import { go } from 'reactigation'

go('HelloWorld', 'modal')
// Pass props to screen and use default screen transition.
go('DetailPage', null, { id: 5 })
```

Available transitions: `regular`, `slow`, `fast`, `none`, `opacity` & `modal`

## Going Back

Returning to the previous screen is simple. Unless defined otherwise the animation defined by `go` will be applied in reverse. On Android when the user clicks the system back button this function is also called.

`back()`

```jsx
import { back } from 'reactigation'

back()
```

## Registering Screens

At least one screen needs to be registered before `Reactigation` is initialized. The `register` function takes any React Component (preferably resembling a screen) and a title for the screen which is required. Optionally the default transition for this screen can be set during registration. It is also the possible to register screens after `Reactigation` was rendered.

`register(Component: React.ReactNode, title: string, { transition?: string, background?: string })`

```jsx
import { register } from 'reactigation'

const screen = () => (
  <View style={{ flex: 1 }}>
    <Text>Hello World</Text>
  </View>
)

register(screen, 'HelloWorld')
register(screen, 'HelloModal', {
  transition: 'modal',
  background: 'transparent',
})
```

## Accessing the Current Screen

To conditionally render elements based on the current screen use the following React hook that will rerender the component with the new `currentScreen` each time a navigation occurs.

```jsx
import { useCurrentScreen } from 'reactigation'

export const Footer = () => {
  const currentScreen = useCurrentScreen()

  if (currentScreen !== 'Overview') {
    return null
  }

  ...
}
```

If you don't need a rerender to be triggered use the variable `import { currentScreen } from 'reactigation'`.

## Static Parts

In order for some components to always be rendered simply add another view next to the navigation.

```jsx
export default () => (
  <>
    <Reactigation />
    <View style={styles.tabs}>
      {...}
    </View>
  </>
)
```

When you need to wrap `<Reactigation />` in a view make sure to add `<View style={{ flex: 1 }}>` in order for the navigation to be visible.

## Running the Example App

The example app shown on top is found in the repository. Run it by cloning this repository and then executing the following commands inside the main directory.

```
npm install
npm run app --silent
cd app
react-native run-ios
```

## Development

To develop the plugin further generate and run the example app. After that `npm run watch` in the main directory will copy over changes made in the `src` folder directly to the app. There are also a few static tests in the `test` folder which can be run with `npm test`.

## Inspiration

The idea for the plugin came after experiencing some issues with native dependencies for an existing React Native navigation plugin.

<a href="https://github.com/kmagiera/react-native-gesture-handler/issues/494#issuecomment-471204581">
  <img src="https://github.com/naminho/reactigation/raw/master/inspiration.png" alt="Inspiration Comment">
</a>

<br />
<br />

<p align="center">
  <img src="https://github.com/naminho/reactigation/raw/master/logo.png" alt="Reactigation" width="250">
</p>
