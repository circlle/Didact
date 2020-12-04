/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Fiber, getCurrentRoot, setDeletions, setNextUnitWork, setWipRoot } from './fiberMeta'

let wipFiber: Fiber | null = null
let hookIndex: number | null = null

export type HookAction = any | (() => any)
export type Hook = {
  state: any,
  queue: HookAction[]
}

export const getWipFiber = () => wipFiber
export const getHookIndex = () => hookIndex

export const setWipFiber = (fiber: Fiber) => (wipFiber = fiber)
export const setHookIndex = (index: number | null) => (hookIndex = index)

const useState = <T>(initialState: T | ((t: T) => void)): [T, (t: T) => void] => {
  const wipFiber = getWipFiber()
  const hookIndex = getHookIndex()

  // @ts-ignore
  const oldHook = wipFiber.alternate && wipFiber.alternate.hooks && wipFiber.alternate.hooks[hookIndex]

  const hook: Hook = {
    state: oldHook ? oldHook.state : initialState,
    queue: []
  }

  const actions = oldHook ? oldHook.queue : []
  actions.forEach(action => {
    hook.state = action(hook.state)
  })

  const setState = (action: HookAction) => {
    hook.queue.push(action)
    const currentRoot = getCurrentRoot()
    if (!currentRoot) return;

    const newWipRoot: Fiber =       {
      type: "default",
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
      child: null,
      sibling: null,
      parent: null
    }
    setWipRoot(newWipRoot)
    setNextUnitWork(newWipRoot)
    setDeletions([])
  }

  wipFiber?.hooks?.push(hook)
  // @ts-ignore
  setHookIndex(hookIndex + 1)

  return [hook.state, setState]
}

export { useState }
