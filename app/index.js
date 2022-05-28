import React from 'react'
import { AppRegistry } from 'react-native'
import Reactigation, { register, Transition } from 'reactigation'
import { name as appName } from './app.json'
import { Static } from './component/Static'
import { Screen } from './component/Screen'
import { Modal } from './component/Modal'

// All possible screen components.
const Screens = {
  First: {
    component: <Screen key="First" title="FirstScreen" showAnimations links={['Second']} />,
  },
  Second: {
    component: <Screen key="Second" title="SecondScreen" links={['First', 'Third']} />,
  },
  Third: {
    component: <Screen key="Third" title="ThirdScreen" showAnimations links={['Second']} />,
    background: 'lightgray',
  },
  Modal: {
    component: <Modal key="Modal" title="Modal" />,
    transition: Transition.modal,
  },
  PeekModal: {
    component: <Modal key="PeekModal" title="Peek Modal" />,
    transition: Transition.peek,
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
