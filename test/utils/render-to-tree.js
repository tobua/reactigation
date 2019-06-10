import renderer from 'react-test-renderer'
import Reactigation from 'reactigation'

export default Navigation => {
  const rendered = renderer.create(Navigation)
  return rendered.toJSON()
}
