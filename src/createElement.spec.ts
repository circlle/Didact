import { createElement, createTextElement, TEXT_ELEMENT_LITERAL } from './createElement'
import type { Element } from './createElement'

describe('createElement', () => {
  it('only tag', () => {
    const toMatch: Element = {
      type: 'div',
      props: { children: [] },
    }
    expect(createElement('div', null)).toMatchObject(toMatch)
  })
  it('with children', () => {
    const toMatch: Element = {
      type: 'div',
      props: {
        children: [
          {
            type: 'span',
            props: {
              children: [],
            },
          },
        ],
      },
    }
    expect(createElement('div', null, createElement('span', null))).toMatchObject(toMatch)
  })
  it('with multi children', () => {
    const toMatch: Element = {
      type: 'div',
      props: {
        children: [
          {
            type: 'span',
            props: {
              children: [],
            },
          },
          {
            type: 'li',
            props: {
              children: [],
            },
          },
        ],
      },
    }
    expect(createElement('div', null, createElement('span', null), createElement('li', null))).toMatchObject(toMatch)
  })
  it('create text element', () => {
    const TEXT = "my_text"
    const toMatch: Element = {
      type: TEXT_ELEMENT_LITERAL,
      props: {
        nodeValue: TEXT,
        children: []
      }
    }
    expect(createTextElement(TEXT)).toMatchObject(toMatch)
  })
})
