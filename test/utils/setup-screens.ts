/* eslint-env jest */
import { register, Transition } from 'reactigation'
import createTestScreen from '../components/Screen'

export default (
  screens: (string | { name: string; options?: { initial?: boolean; background?: string; transition?: Transition } })[],
) => {
  return screens.map((screen) => {
    let name: string
    let options = {} as any

    if (typeof screen === 'string') {
      name = screen
    } else {
      name = screen.name
      options = screen.options
    }

    const mock = jest.fn()
    const effectMock = jest.fn()
    const component = createTestScreen(name, mock, effectMock)

    register(component, name, options)

    return {
      mock: mock.mock,
      effectMock: effectMock.mock,
      component,
    }
  })
}
