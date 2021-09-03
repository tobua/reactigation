/* eslint-env jest */
import renderer, { act } from 'react-test-renderer'

export default (Navigation) => {
  let rendered
  // act to ensure effects are flushed in initial render.
  act(() => {
    rendered = renderer.create(Navigation)
  })
  const tree = rendered.toJSON()

  if (Array.isArray(tree)) {
    expect(tree[0].type).toEqual('View')
  } else {
    expect(tree.type).toEqual('View')
  }

  const screensRoot = Array.isArray(tree) ? tree[0] : tree

  expect(screensRoot.children.length > 0).toEqual(true)

  return {
    tree,
    wrapper: screensRoot,
    wrappers: screensRoot.children,
    screens: screensRoot.children.map((wrapper) => wrapper.children[0]),
  }
}
