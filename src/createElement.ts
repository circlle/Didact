import { Component } from "./component"

export type ElementType = string | Component
export type ElementProps = Record<string, any>
export type Element = {
  type: ElementType
  props: ElementProps & { children: Element[] }
}
export type PrimaryType = string | number
export type CreateElement = (
  type: string,
  props: ElementProps | null,
  ...children: (Element | PrimaryType)[]
) => Element
const createElement: CreateElement = (type, props, ...children) => {
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

export const TEXT_ELEMENT_LITERAL = "TEXT_ELEMENT"
const createTextElement = (text: PrimaryType): Element => {
  return {
    type: TEXT_ELEMENT_LITERAL,
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

export { createElement, createTextElement }
