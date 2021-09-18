import React from 'react'
import { AppRegistry } from 'react-native'
import Reactigation, { register } from 'reactigation'
import { name as appName } from './app.json'
import { Static } from './component/Static'
import { Screen } from './component/Screen'
import { Modal } from './component/Modal'

// All possible screen components.
const Screens = {
  First: (
    <Screen key="First" title="FirstScreen" showAnimations links={['Second']} />
  ),
  Second: (
    <Screen key="Second" title="SecondScreen" links={['First', 'Third']} />
  ),
  Third: (
    <Screen key="Third" title="ThirdScreen" showAnimations links={['Second']} />
  ),
  Modal: <Modal key="Modal" title="Modal" />,
  AnotherModal: <Modal key="AnotherModal" title="Another Modal" />,
}

// Register screens.
Object.keys(Screens).map((ScreenName) =>
  register(Screens[ScreenName], ScreenName, {
    transition: ScreenName.includes('Modal') ? 'modal' : undefined,
    background: ScreenName === 'Second' ? 'lightgray' : 'white',
  })
)

const App = () => (
  <>
    <Reactigation />
    <Static />
  </>
)

AppRegistry.registerComponent(appName, () => App)
