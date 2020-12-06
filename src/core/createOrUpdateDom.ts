import type { Fiber } from './createFiber'
import { isDomElement, isTextElement } from './createElement'
import type { Element } from "./createElement"

const isProperty = (key: string) => key !== 'children' && !isEvent(key)
const isNew = (prev: Record<string, any>, next: Record<string, any>) => (key: string) => prev[key] !== next[key]
const isGone = (prev: Record<string, any>, next: Record<string, any>) => (key: string) => !(key in next)
const isEvent = (key: string) => key.startsWith("on")

const createDOM = (fiber: Fiber): HTMLElement | Text | null => {
  let dom: HTMLElement | Text

  if (isTextElement(fiber.origin)) {
    dom = document.createTextNode(fiber.origin.props.nodeValue)
  } else if (isDomElement(fiber.origin)) {
    dom = document.createElement(fiber.origin.type)
  } else {
    return null
  }
  // todo: create fake prevProps
  updateDOM(dom, { children: [] }, fiber.origin.props)

  return dom
}

const updateDOM = (dom: HTMLElement | Text, prevProps?: Element['props'], nextProps?: Element['props']): void => {
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