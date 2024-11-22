// eslint-disable-next-line no-undef
let focusableElements: NodeListOf<HTMLElement> = null
let focusedElement: HTMLElement = null

const selectors: string[] = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
  'select:not([disabled]):not([aria-hidden])',
  'textarea:not([disabled]):not([aria-hidden])',
  'button:not([disabled]):not([aria-hidden])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex^="-"])'
]

/**
 * Locks the focus within a specified element and its focusable children.
 * @param { HTMLElement } element - The element to lock the focus within.
 * @param { boolean } startFocus - Optional. Determines whether to focus the first focusable element within the locked element. Defaults to `true`.
 */
function lockFocus(element: HTMLElement, startFocus: boolean = true): void {
  if (focusedElement !== null) {
    unlockFocus(false)
  }

  if (!element) {
    return
  }

  focusedElement = document.activeElement as HTMLElement
  focusableElements = element.querySelectorAll(selectors.join(','))

  if (focusableElements.length === 0) {
    return
  }

  setTimeout(() => {
    focusedElement?.blur()

    if (startFocus) {
      focusableElements[0].focus()
    }

    document.addEventListener('keydown', keydownHandler)
  }, 100)
}

/**
 * Unlocks the focus and returns it to the previously focused element.
 * @param { boolean } returnFocus - Optional. Determines whether to return the focus to the previously focused element. Defaults to `true`.
 */
function unlockFocus(returnFocus: boolean = true): void {
  if (returnFocus && focusedElement) {
    focusedElement.focus()
  }

  focusedElement = null
  focusableElements = null
  document.removeEventListener('keydown', keydownHandler)
}

function keydownHandler(event: KeyboardEvent): void {
  const isTabPressed = event.key === 'Tab'

  if (!isTabPressed) {
    return
  }

  if (event.shiftKey && document.activeElement === focusableElements[0]) {
    event.preventDefault()
    focusableElements[focusableElements.length - 1].focus()
    return
  }

  if (
    !event.shiftKey &&
    document.activeElement === focusableElements[focusableElements.length - 1]
  ) {
    event.preventDefault()
    focusableElements[0].focus()
  }
}

export { lockFocus, unlockFocus }
