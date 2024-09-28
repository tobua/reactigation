import React from 'react'
import Reactigation, { register, Transition } from 'reactigation'
import { Static } from './component/Static'
import { Screen } from './component/Screen'
import { Modal } from './component/Modal'

// Register all screens.
register(<Screen key="First" title="FirstScreen" showAnimations links={['Second']} />, 'First')
register(<Screen key="Second" title="SecondScreen" links={['First', 'Third']} />, 'Second')
register(<Screen key="Third" title="ThirdScreen" showAnimations links={['Second']} />, 'Third', {
  background: 'lightgray',
})
register(<Modal key="Modal" title="Modal" />, 'Modal', {
  transition: Transition.modal,
})
register(<Modal key="PeekModal" title="Peek Modal" />, 'PeekModal', {
  transition: Transition.peek,
})

export default () => (
  <>
    <Reactigation />
    <Static />
  </>
)
