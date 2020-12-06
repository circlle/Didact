import { Fiber } from "./createFiber"

let rootFiber: Fiber | null = null

export const setRootFiber = (fiber: Fiber | null): Fiber | null => rootFiber = fiber
export const getRootFiber = (): Fiber | null => rootFiber


let currentRootFiber: Fiber | null = null
export const setCurrentRootFiber = (fiber: Fiber | null): Fiber | null => currentRootFiber = fiber
export const getCurrentRootFiber = (): Fiber | null => currentRootFiber

let deletions: Fiber[] = []

export const setDeletions = (fibers: Fiber[]): Fiber[] => deletions = fibers
export const getDeletions = (): Fiber[] => deletions

let currentFiber: Fiber | null = null
export const setCurrentFiber = (fiber: Fiber | null) => currentFiber = fiber
export const getCurrentFiber = () => currentFiber