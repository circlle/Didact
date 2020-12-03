import type { Element } from './createElement'
import { Fiber, getCurrentRoot, setDeletions } from './fiberMeta'
import { setNextUnitWork, setWipRoot } from './fiberMeta'
import { workLoop } from './concurrent'

export type Render = (element: Element, containers: HTMLElement) => void
const render: Render = (element, containers) => {
  const wipRoot: Fiber = {
    dom: containers,
    parent: null,
    child: null,
    sibling: null,
    type: 'root',
    props: {
      children: [element],
    },
    alternate: getCurrentRoot()
  }
  setWipRoot(wipRoot)

  setNextUnitWork(wipRoot)

  setDeletions([])

  requestIdleCallback(workLoop)
}

export { render }
