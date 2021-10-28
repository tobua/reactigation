import React from 'react'
import { AppRegistry } from 'react-native'
import Reactigation, { register } from 'reactigation'
import { name as appName } from './app.json'
import { Static } from './component/Static'
import { Screen } from './component/Screen'
import { Modal } from './component/Modal'

// All possible screen components.
const Screens = {
  First: {
    component: (
      <Screen
        key="First"
        title="FirstScreen"
        showAnimations
        links={['Second']}
      />
    ),
  },
  Second: {
    component: (
      <Screen key="Second" title="SecondScreen" links={['First', 'Third']} />
    ),
  },
  Third: {
    component: (
      <Screen
        key="Third"
        title="ThirdScreen"
        showAnimations
        links={['Second']}
      />
    ),
    background: 'lightgray',
  },
  Modal: {
    component: <Modal key="Modal" title="Modal" />,
    transition: 'modal',
  },
  PeekModal: {
    component: <Modal key="PeekModal" title="Peek Modal" />,
    transition: 'peek',
  },
}

// Register screens.
Object.entries(Screens).map(([name, configuration]) =>
  register(configuration.component, name, {
    transition: configuration.transition,
    background: configuration.background,
  })
)

const App = () => (
  <>
    <Reactigation />
    <Static />
  </>
)

AppRegistry.registerComponent(appName, () => App)
// npx react-scripts start
// npm install react-dom react-native-web
// npm install --save-dev babel-plugin-react-native-web
// add public/index.html
// add main field to package.json pointing to index.js, doesn't work
// npm install --save-dev eslint-plugin-prettier, probably only eslint required, or prettier.
// AppRegistry.runApplication(appName, {
//   rootTag: document.getElementById('root'),
// })
