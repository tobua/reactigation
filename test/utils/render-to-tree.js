import renderer from 'react-test-renderer'
import Reactigation from 'reactigation'

export default Navigation => {
  const rendered = renderer.create(Navigation)
  const tree = rendered.toJSON()

  expect(tree.type).toEqual('View')
  expect(tree.children.length > 0).toEqual(true)

  return {
    wrapper: tree,
    wrappers: tree.children,
    screens: tree.children.map(wrapper => wrapper.children[0])
  }
}
