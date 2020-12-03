import type { Fiber } from './fiberMeta'
import { TEXT_ELEMENT_LITERAL } from './createElement'

const isProperty = (key: string) => key !== 'children' && !isEvent(key)
const isNew = (prev: Record<string, any>, next: Record<string, any>) => (key: string) => prev[key] !== next[key]
const isGone = (prev: Record<string, any>, next: Record<string, any>) => (key: string) => !(key in next)
const isEvent = (key: string) => key.startsWith("on")

const createDOM = (fiber: Fiber): HTMLElement | Text => {
  let dom: HTMLElement | Text

  if (fiber.type === TEXT_ELEMENT_LITERAL) {
    dom = document.createTextNode(fiber.props.nodeValue)
  } else {
    const innerDom = (dom = document.createElement(fiber.type))

    Object.keys(fiber.props)
      .filter(isProperty)
      .forEach((name) => innerDom.setAttribute(name, fiber.props[name]))
  }

  return dom
}

const updateDOM = (dom: HTMLElement | Text, prevProps?: Fiber['props'], nextProps?: Fiber['props']): void => {
  if (!prevProps || !nextProps) return;
  
  // remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach(name => {
      const eventType  = name.toLowerCase().substr(2)
      dom.removeEventListener(eventType, prevProps[name])
    })
  // add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.addEventListener(
        eventType,
        nextProps[name]
      )
    })

  // remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => dom[name] = "")

  // set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name]
    })
}

export { createDOM, updateDOM }
