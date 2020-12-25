import { ComponentElement, DomElement, Element, isComponentElement, isDomElement, isTextElement, TextElement } from "./createElement";
import type { Hook } from "./hooks"
export type BaseFiber = {
  type: Element["type"]
  origin: Element
  parent?: Fiber
  sibling?: Fiber
  child?: Fiber
  effectTag?: "UPDATE" | "PALCEMENT" | "DELETION"
}

export type DomFiber = BaseFiber & { origin: DomElement | TextElement, kind: "dom", dom: HTMLElement | Text | null, alternate?: DomFiber  }
export type ComponentFiber = BaseFiber & { 
  origin: ComponentElement, 
  kind: "component", 
  hooks?: Hook[]
  effectFuncList?: (() => void)[]
  alternate?: ComponentFiber,
  errorBoundary?: (err: {type: "plain" | "effect", name?: string, err: Error}) => void
}
export type Fiber = DomFiber | ComponentFiber


const createFiber = (element: Element): Fiber | null => {
  if (isTextElement(element) || isDomElement(element)) {
    return {
      type: element.type,
      origin: element,
      kind: "dom",
      dom: null,
    }
  }
  if (isComponentElement(element)) {
    return {
      type: element.type,
      origin: element,
      kind: "component",
    }
  } 
  return null
}

const createFiberRecursive = (element: Element): Fiber | null => {
  const children = element.props.children;
  const fiber = createFiber(element)
  if (!fiber) return null;

  const childrenFiber = children.reduceRight((acc, next) => {
    const childFiber = createFiber(next)
    if (!childFiber) return [...acc]

    doIfNotEmpty(acc, (acc) => {
      childFiber.sibling = acc[0]
    })

    return [childFiber, ...acc]
  }, [] as Fiber[])

  doIfNotEmpty(childrenFiber, (childrenFiber) => {
    fiber.child = childrenFiber[0] 
  })

  return fiber
}

function notEmpty<T>(list: T[]) {
  return list.length > 0
}
function doIfNotEmpty<T>(list: T[], f: (list: T[]) => void) {
  notEmpty(list) && f(list)
}

export { createFiber, createFiberRecursive }

