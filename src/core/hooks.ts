import { DomFiber } from './createFiber'
import { reconcile } from './diff'
import {
  getCurrentFiber,
  getCurrentRootFiber,
  getRootFiber,
  setCurrentRootFiber,
  setDeletions,
  setRootFiber,
} from './global'

export type Hook = {
  // state
  state: any
  // action list
  queue: any[]
}

let hookIndex = 0
export const setHookIndex = (index: number) => (hookIndex = index)
export const getHookIndex = () => hookIndex
export const succHookIndex = () => setHookIndex(getHookIndex() + 1)

const useState = (initialState) => {
  const currentFiber = getCurrentFiber()
  if (!currentFiber) return
  if (currentFiber.kind !== 'component') return

  const hookIndex = getHookIndex()
  const maybeHooks = currentFiber.alternate?.hooks || []
  const maybeOldHook = maybeHooks[hookIndex]
  const hook: Hook = {
    state: maybeOldHook ? maybeOldHook.state : initialState,
    queue: [],
  }

  const actions = maybeOldHook ? maybeOldHook.queue : []
  actions.forEach((action) => {

    hook.state = action(hook.state)
  })

  const setState = (action) => {
    if (!(action instanceof Function)) {
      const value = action;
      action = () => value
    }
    hook.queue.push(action)

    const currentRootFiber = getRootFiber() as DomFiber
    const rootFiber: DomFiber = {
      kind: 'dom',
      dom: currentRootFiber.dom,
      type: currentRootFiber.origin.type,
      origin: currentRootFiber.origin,
      alternate: currentRootFiber || undefined,
    }
    setRootFiber(rootFiber)
    setDeletions([])
    reconcile(rootFiber)
  }

  currentFiber.hooks = currentFiber.hooks ? [...currentFiber.hooks, hook] : [hook]
  succHookIndex()

  return [hook.state, setState]
}

export { useState }
