import { ComponentFiber, DomFiber, Fiber } from './createFiber'
import { reconcile } from './diff'
import { getCurrentFiber, getRootFiber, setDeletions, setRootFiber } from './global'

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

const useErrorBoundary = (callback: ComponentFiber["errorBoundary"]) => {
  const currentFiber = getCurrentFiber()
  if (!currentFiber) return
  if (currentFiber.kind !== 'component') return

  currentFiber.errorBoundary = callback
}

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
      const value = action
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

const useEffect = (callback, depArray) => {
  const currentFiber = getCurrentFiber()
  if (!currentFiber) return
  if (currentFiber.kind !== 'component') return
  const rawCallback = callback

  if (currentFiber.errorBoundary) {
    callback = () => {
      try {
        rawCallback()
      } catch (error) {
        if (!currentFiber.errorBoundary) return;
        currentFiber.errorBoundary({type: "effect", name: currentFiber.origin.type.name,  err: error})        
      }
    }
  }

  const hookIndex = getHookIndex()
  const maybeHooks = currentFiber.alternate?.hooks || []
  const maybeOldHook = maybeHooks[hookIndex]

  const isFirst = !maybeOldHook

  const hook: Hook = {
    state: maybeOldHook ? maybeOldHook.state : [],
    queue: [],
  }

  const hasNoDeeps = !depArray
  const oldDeps = hook.state
  const hasChangedDeps = hasNoDeeps ? true : oldDeps ? !depArray.every((el, i) => el === oldDeps[i]) : true
  
  currentFiber.hooks = currentFiber.hooks ? [...currentFiber.hooks, hook] : [hook]
  if (isFirst || hasNoDeeps || hasChangedDeps) {
    currentFiber.effectFuncList = currentFiber.effectFuncList ? [...currentFiber.effectFuncList, callback] : [callback]
    hook.state = depArray
  }
  succHookIndex()
}

export { useState, useEffect, useErrorBoundary }
