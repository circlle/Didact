import { createDOM, updateDOM } from './createDOM'
import type { Element } from './createElement'
import { Fiber, getDeletions, getNextUnitWork, getWipRoot, setCurrentRoot, setDeletions, setNextUnitWork, setWipRoot } from "./fiberMeta"

const commitWork = (fiber: Fiber | null) => {
  if (!fiber) return

  const domParent = fiber.parent?.dom

  if (fiber.effectTag === "PLACEMENT" && !!fiber.dom) {
    domParent?.appendChild(fiber.dom as HTMLElement | Text)
  } else if (fiber.effectTag === "DELETION" && !!fiber.dom) {
    domParent?.removeChild(fiber.dom)
  } else if (fiber.effectTag === "UPDATE" && !!fiber.dom) {
    updateDOM(
      fiber.dom,
      fiber.alternate?.props,
      fiber.props
    )
  }

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

const commitRoot = () => {
  // add nodes to dom
  getDeletions().forEach(commitWork)

  const wipRoot = getWipRoot()
  if (!wipRoot) return
  if (!wipRoot.child) return

  commitWork(wipRoot?.child)
  setCurrentRoot(wipRoot)
  setWipRoot(null)
}

if (!window.requestIdleCallback) {
  window.requestIdleCallback = (callback) => {
    callback({
      timeRemaining: () => Infinity,
      didTimeout: false,
    })
    // fake handle
    return -1
  }
}

export const workLoop = (deadline: IdleDeadline): void => {
  let shouldYield = false
  while (getNextUnitWork() && !shouldYield) {
    const unitWork = getNextUnitWork()
    if (!unitWork) break
    setNextUnitWork(performUnitOfWork(unitWork))
    shouldYield = deadline.timeRemaining() < 1
  }


  if (!getNextUnitWork() && getWipRoot()) {
    commitRoot()
    return
  }
  requestIdleCallback(workLoop)
}

// react 内部已经不再使用 requestIdleCallback API， 使用了 scheduler package
// requestIdleCallback(workLoop)

const performUnitOfWork = (fiber: Fiber): Fiber | null => {
  // add dom node
  if (!fiber.dom) {
    fiber.dom = createDOM(fiber)
  }

  // 可能会看到残缺的 ui。 需要去监听 根 fiber,
  // if (fiber.parent) {
  //   fiber.parent.dom?.appendChild(fiber.dom)
  // }

  // create new fibers
  const elements = fiber.props.children
  reconcileChildren(fiber, elements)

  // return next unit of work

  if (fiber.child) return fiber.child

  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent as Fiber
  }

  return nextFiber
}

function reconcileChildren(wipFiber: Fiber, elements: Element[]) {
  let index = 0
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child

  let prevSibling: Fiber | null = null

  while (index < elements.length || !!oldFiber) {
    const element = elements[index]

    let newFiber: Fiber | null = null

    // compare old fiber to element
    const sameType = oldFiber && element && oldFiber.type === element.type
    if (oldFiber && element && oldFiber.type === element.type) {
      // update the node
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
        child: null,
        sibling: null
      }
    } else {
      if (element && !sameType) {
        newFiber = {
          type: element.type,
          props: element.props,
          dom: null,
          parent: wipFiber,
          alternate: null,
          effectTag: "PLACEMENT",
          child: null,
          sibling: null
        }
      }
      if (oldFiber && !sameType) {
        // delete the old fiber node
        oldFiber.effectTag = "DELETION"
        setDeletions([...getDeletions(), oldFiber])
      }
    }


    if (index === 0) {
      wipFiber.child = newFiber
    } else if (element) {
      prevSibling && (prevSibling.sibling = newFiber)
    }

    prevSibling = newFiber
    // set element to next
    index++
    // set fiber to next
    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }
  }
}
