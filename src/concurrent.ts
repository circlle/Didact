import { createDOM, updateDOM } from './createDOM'
import type { Element } from './createElement'
import { Fiber, getDeletions, getNextUnitWork, getWipRoot, setCurrentRoot, setDeletions, setNextUnitWork, setWipRoot } from "./fiberMeta"
import { setHookIndex, setWipFiber } from './hooks'

const commitWork = (fiber: Fiber | null) => {
  if (!fiber) return

  let domParentFiber = fiber.parent
  while(!domParentFiber?.dom) {
    if (!domParentFiber) break;
    domParentFiber = domParentFiber?.parent
  }

  if (!domParentFiber) return;

  const domParent = domParentFiber.dom


  if (fiber.effectTag === "PLACEMENT" && !!fiber.dom) {
    domParent?.appendChild(fiber.dom as HTMLElement | Text)
  } else if (fiber.effectTag === "DELETION" && !!fiber.dom) {
    // domParent?.removeChild(fiber.dom)
    commitDeletion(fiber, domParent)
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

const commitDeletion = (fiber: Fiber | null, domParent: HTMLElement | Text | null) => {
  if (!fiber) return;
  if (!domParent) return;

  if (fiber.dom) {
    domParent.removeChild(fiber.dom)
  } else {
    // 如果是 function 组件，则删除 fiber 的 child。 注：因为我们的实现是，组件的fiberNode 只有一个child，那就是 return 的 element
    commitDeletion(fiber.child, domParent)
  }
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



const updateHostComponent = (fiber: Fiber) => {
  // add dom node
  if (!fiber.dom) {
    fiber.dom = createDOM(fiber)
  }

  // create new fibers
  const elements = fiber.props.children
  reconcileChildren(fiber, elements)
}

const updateFunctionComponent = (fiber: Fiber) => {
  if ( typeof fiber.type === "string") return;

  fiber.hooks = []
  setWipFiber(fiber)
  setHookIndex(0)


  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}


const performUnitOfWork = (fiber: Fiber): Fiber | null => {

  const isFunctionComponent = fiber.type instanceof Function

  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }


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
