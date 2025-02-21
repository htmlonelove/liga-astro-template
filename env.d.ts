/* eslint-disable no-var */
import type { FocusLockType, ModalsType } from '@shared/types'

declare global {
  var modals: ModalsType
  var focusLock: FocusLockType
}

export {}
