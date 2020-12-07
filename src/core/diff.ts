import { Element, isComponentElement, isDomElement } from './createElement'
import type { ComponentFiber, DomFiber, Fiber } from './createFiber'
import { createDOM, updateDOM } from './createOrUpdateDom'
import { getDeletions, setCurrentFiber, setDeletions, setRootFiber } from './global'
import { setHookIndex } from './hooks'

const commitWork = (fiber?: Fiber) => {
  if (!fiber) return

  let nearestDomFiber = fiber.parent

  while (nearestDomFiber && !isDomElement(nearestDomFiber.origin)) {
    nearestDomFiber = nearestDomFiber.parent
  }
  // 如果没有找到最近的 dom 点，返回
  if (!nearestDomFiber || !isDomElement(nearestDomFiber?.origin)) return
  const parentDom = (nearestDomFiber as DomFiber).dom

  if (!parentDom) return

  switch (fiber.effectTag) {
    case 'DELETION': {
      commitDeletion(fiber, parentDom)
      break
    }
    case 'PALCEMENT': {
      if (!nearestDomFiber) return
      commitPlacement(fiber, parentDom)
      // here place dom, what about component?
    }
    case 'UPDATE': {
      if (fiber.kind == 'dom') {
        fiber.dom && updateDOM(fiber.dom, fiber.alternate?.origin.props, fiber.origin.props)
      }
    }
    default:
      break
  }
  commitWork(fiber.child)

  // HEAR DONE
  if (fiber.kind === "component") {
    if (fiber.effectFuncList) {
      fiber.effectFuncList.forEach(callback => callback())
    }
  }

  commitWork(fiber.sibling)
}
const commitPlacement = (fiber: Fiber | undefined, dom: HTMLElement | Text) => {
  if (!fiber) return

  if (fiber.kind === 'dom') {
    fiber.dom && dom.appendChild(fiber.dom)
  } else {
    commitPlacement(fiber.child, dom)
  }
}

const commitDeletion = (fiber: Fiber | undefined, dom: HTMLElement | Text) => {
  if (!fiber) return

  if (fiber.kind === 'dom') {
    fiber.dom && dom.removeChild(fiber.dom)
  } else {
    commitDeletion(fiber.child, dom)
  }
}

const reconcile = (newFiber: Fiber): void => {
  let nextWork = performUnitOfWork(newFiber)
  while (nextWork) {
    nextWork = performUnitOfWork(nextWork)
  }

  getDeletions().forEach(commitWork)

  commitWork(newFiber.child)

  setRootFiber(newFiber)
}

// diff fiber
const performUnitOfWork = (fiber: Fiber): Fiber => {
  if (fiber.kind === 'component') {
    fiber.hooks = []
    setCurrentFiber(fiber)
    setHookIndex(0)

    const children = [fiber.origin.type(fiber.origin.props)]
    reconcileChildren(fiber, children)
  } else if (fiber.kind === 'dom') {
    if (!fiber.dom) fiber.dom = createDOM(fiber)
    const elements = fiber.origin.props.children
    reconcileChildren(fiber, elements)
  }

  if (fiber.child) {
    return fiber.child
  }

  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling

    nextFiber = nextFiber.parent as Fiber
  }

  return nextFiber
}

function reconcileChildren(originFiber: Fiber, elements: Element[]) {
  let oldFiber = originFiber.alternate?.child

  let prevSibling: Fiber | null = null

  let index = 0
  const length = elements.length
  // 两个进行比较，element & sibling
  while (index < length || !!oldFiber) {
    let newFiber: Fiber | null = null

    const element = elements[index]

    const sameType = element && oldFiber && element.type === oldFiber.origin.type

    if (sameType && !!oldFiber) {
      // update fiber node
      const fiber =
        oldFiber.kind === 'component'
          ? ({
              kind: oldFiber.kind,
              origin: element,
              alternate: oldFiber,
              type: element.type,
              parent: originFiber,
              effectTag: 'UPDATE',
            } as ComponentFiber)
          : ({
              kind: oldFiber.kind,
              origin: element,
              dom: oldFiber.dom,
              alternate: oldFiber,
              type: element.type,
              parent: originFiber,
              effectTag: 'UPDATE',
            } as DomFiber)
      newFiber = fiber
    } else {
      if (!sameType && element) {
        const fiber = {
          origin: element,
          kind: isComponentElement(element) ? 'component' : 'dom',
          type: element.type,
          dom: null,
          parent: originFiber,
          effectTag: 'PALCEMENT',
        } as Fiber
        newFiber = fiber
      }

      if (!sameType && oldFiber) {
        oldFiber.effectTag = 'DELETION'
        setDeletions([...getDeletions(), oldFiber])
      }
    }

    if (index === 0) {
      originFiber.child = newFiber || undefined
    } else if (element) {
      prevSibling && (prevSibling.sibling = newFiber || undefined)
    }

    prevSibling = newFiber

    index++
    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }
  }
}

export { reconcile }
