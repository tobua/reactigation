/* eslint-env jest */
import renderer, { ReactTestRenderer, act } from 'react-test-renderer'

export default (Navigation: JSX.Element) => {
  let rendered: ReactTestRenderer | null = null
  // act to ensure effects are flushed in initial render.
  act(() => {
    rendered = renderer.create(Navigation)
  })

  // @ts-ignore TODO check if act can be avoided
  const tree = rendered.toJSON()

  if (Array.isArray(tree)) {
    expect(tree[0].type).toEqual('View')
  } else {
    expect(tree?.type).toEqual('View')
  }

  const screensRoot: any = Array.isArray(tree) ? tree[0] : tree

  expect(screensRoot.children.length > 0).toEqual(true)

  return {
    root: (rendered as unknown as ReactTestRenderer).root,
    tree,
    wrapper: screensRoot,
    wrappers: screensRoot.children,
    screens: screensRoot.children.map((wrapper: any) => wrapper.children[0]),
  }
}
