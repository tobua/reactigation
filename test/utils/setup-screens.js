import { register } from 'reactigation'
import createTestScreen from './../components/Screen'

export default names => {
  return names.map(name => {
    const mock = jest.fn()
    const constructorMock = jest.fn()
    const component = createTestScreen(name, mock, constructorMock)

    register(component, name)

    return {
      mock: mock.mock,
      constructorMock: constructorMock.mock,
      component
    }
  })
}
