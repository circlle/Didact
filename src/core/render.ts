import type { Element } from './createElement'
import type { DomFiber, Fiber } from './createFiber'
import { reconcile } from './diff'
import { getRootFiber } from './global'

export type Render = (element: Element, containers: HTMLElement) => void
const render: Render = (element, containers) => {
  const wipRoot: Fiber = {
    kind: 'dom',
    dom: containers,
    origin: { type: 'root', props: { children: [element] } },
    type: 'root',
    alternate: (getRootFiber() as DomFiber) || undefined,
  }

  reconcile(wipRoot)
}

export { render }
