import { TEXT_ELEMENT } from './constant'

export type Component = (props: Record<string, any>) => Element

export type Element = DomElement | ComponentElement | TextElement
export type DomElement = {
  type: string
  props: Record<string, any> & { children: Element[] }
}
export type ComponentElement = {
  type: Component
  props: Record<string, any> & { children: Element[] }
}
export type TextElement = {
  type: typeof TEXT_ELEMENT
  props: {
    nodeValue: string
    children: Element[]
  }
}

export function isTextElement(elem: Element): elem is TextElement {
  return elem.type === TEXT_ELEMENT
} 
export function isDomElement(elem: Element): elem is DomElement {
  return typeof elem.type === 'string' && !isTextElement(elem)
}
export function isComponentElement(elem: Element): elem is ComponentElement {
  return  elem.type instanceof Function
}

export type PrimaryType = string | number

const createElement = (
  type: Element['type'],
  props: Record<string, any>,
  ...children: (Element | PrimaryType)[]
): Element => {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === 'object' ? child : createTextElement(child)
      }),
    },
  }
}

const createTextElement = (text: PrimaryType): Element => {
  return {
    type: TEXT_ELEMENT,
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

export { createElement }
