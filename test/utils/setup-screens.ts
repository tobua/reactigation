/* eslint-env jest */
import { register } from 'reactigation'
import createTestScreen from '../components/Screen'

export default (screens: (string | { name: string; options?: { initial?: boolean; background?: string } })[]) => {
  return screens.map((screen) => {
    let name
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
