/* eslint-env jest */
import { register } from 'reactigation'
import createTestScreen from '../components/Screen'

export default (names: string[]) => {
  return names.map((name) => {
    const mock = jest.fn()
    const effectMock = jest.fn()
    const component = createTestScreen(name, mock, effectMock)

    register(component, name)

    return {
      mock: mock.mock,
      effectMock: effectMock.mock,
      component,
    }
  })
}
