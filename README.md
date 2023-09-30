<p align="center">
  <img src="https://github.com/tobua/reactigation/raw/main/video.gif" alt="Reactigation" width="250">
  <!--- Recorded from iOS Simulator using ⌘ ⇧ 5 combination and converted with Gifsky from Mac App Store. -->
</p>

# Reactigation

[![npm](https://img.shields.io/npm/v/reactigation)](https://npmjs.com/reactigation)
[![codesandbox](https://img.shields.io/badge/demo-codesandbox-yellow)](https://codesandbox.io/s/reactigation-c0xeqh)

Navigation for React Native using only JavaScript.

## Installation

```
npm i reactigation
```

## Usage

A minimal setup with two screens looks like this.

```jsx
import React from 'react'
import { AppRegistry, Text, Button } from 'react-native'
import Reactigation, { register, go, back } from 'reactigation'

const FirstScreen = (props) => (
  <>
    <Text>{props.title} Screen</Text>
    <Button title="go to Second Screen" onPress={() => go('Second')} />
  </>
)

const SecondScreen = (props) => (
  <>
    <Text>{props.title} Screen</Text>
    <Button title="go back" onPress={() => back()} />
  </>
)

register(<FirstScreen />, 'First')
register(<SecondScreen />, 'Second')

AppRegistry.registerComponent('NavigationApp', () => Reactigation)
```

## Navigating to a Screen

At runtime it's possible to navigate to any of the registered screens. A transition is how the switch between two screens looks like. For each navigation the transition can be configured.

`go(screen: string, transition?: Transition, props?: object)`

```jsx
import { go, Transition } from 'reactigation'

go('HelloWorld', 'modal')
go('AboutScreen', Transition.fast)
// Pass props to screen and use default screen transition.
go('DetailPage', null, { id: 5 })
```

Available transitions: `regular`, `slow`, `fast`, `none`, `opacity`, `modal` & `peek` can all be imported as `Transition`.

## Going Back

Returning to the previous screen is simple. Unless defined otherwise the animation defined by `go` will be applied in reverse. On Android when the user clicks the system back button this function is also called.

`back(transition?: Transition)`

```jsx
import { back, Transition } from 'reactigation'

back()
back('fast')
back(Transition.slow)
```

## Registering Screens

At least one screen needs to be registered before `Reactigation` is initialized. The `register` function takes any React Component (preferably resembling a screen) and a title for the screen which is required. Optionally the default transition for this screen can be set during registration. It is also the possible to register screens after `Reactigation` was rendered.

`register(Component: React.ReactNode, title: string, { transition?: Transition, background?: string, initial?: boolean })`

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

## Configuring the Initial Screen

By default the first registered screen will appear initially. To use another screen initially, pass the `initial` option as the third argument to register or call `initial()` with the name of a previously registered screen.

```js
import { register, initial } from 'reactigation'

register(screen, 'FirstScreen')
register(screen, 'SecondScreen', { initial: true })
register(screen, 'ThirdScreen')

initial('SecondScreen')
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

## Custom Transitions

It's possible to configure some variables for the base animations.

```tsx
import { CustomTransition } from 'reactigation'

const AlmostFullPeek = CustomTransition.peek(20) // 20% backdrop visible.
const SuperSlow = CustomTransition.regular(5000) // 5 seconds duration.
const SuperFastOpacity = CustomTransition.opacity(50) // 50 ms duration of opacity blur.

register(<FirstScreen />, 'First', { transition: AlmostFullPeek })
go('First', SuperSlow)
back(SuperFastOpacity)
```

## Headless Mode for Testing

Headless mode will automatically be enabled in a testing environment `process.env.NODE === 'test'`. It's also possible to control this mode manually on the main component.

```jsx
import Reactigation from 'reactigation'

const App = () => <Reactigation headless={false} />
AppRegistry.registerComponent('NavigationApp', () => App)
```

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
  <img src="https://github.com/naminho/reactigation/raw/main/inspiration.png" alt="Inspiration Comment">
</a>

<br />
<br />

<p align="center">
  <img src="https://github.com/naminho/reactigation/raw/main/logo.png" alt="Reactigation" width="250">
</p>
