import type { Element } from './createElement'
import { Hook } from './hooks'

export type Fiber = {
  parent: Fiber | null
  child: Fiber | null
  sibling: Fiber | null
  dom: HTMLElement | Text | null
  alternate?: Fiber | null
  hooks?: Hook[]
  effectTag?: "UPDATE" | "DELETION" | "PLACEMENT"
} & Element

// next fiber
let nextUnitWork: Fiber | null = null
// root fiber
let wipRoot: Fiber | null = null
let currentRoot: Fiber | null = null
let deletions: Fiber[] = []

export const setDeletions = (fibers: Fiber[]): void => {
  deletions = fibers
}
export const getDeletions = (): Fiber[] => deletions
export const setCurrentRoot = (root: Fiber | null): void => {
  currentRoot = root
}
export const getCurrentRoot = (): Fiber | null => currentRoot
export const setNextUnitWork = (unitWork: Fiber | null): void => {
  nextUnitWork = unitWork
}
export const getNextUnitWork = (): Fiber | null => nextUnitWork
export const setWipRoot = (root: Fiber | null): void => {
  wipRoot = root
}
export const getWipRoot = (): Fiber | null => wipRoot