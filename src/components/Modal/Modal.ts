import { lockFocus, unlockFocus } from '@shared/helpers'
import { modalSettings, type ModalSettings } from '@shared/settings'
import { enablePageScroll, disablePageScroll } from 'scroll-lock'

/**
 * Represents an item in the modals stack.
 */
interface ModalsStackItem {
  modalName: string
  settings: ModalSettings
}

let currentSettings: ModalSettings = {}
let currentModalName: string | null = null
const modalsStack: ModalsStackItem[] = []

/**
 * Initializes the modals.
 */
function initModals(): void {
  clearPreload()
  initTriggers()
}

/**
 * Initializes the triggers for opening modals.
 */
function initTriggers(): void {
  const triggers = document.querySelectorAll('[data-open-modal]')
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      const target = (event.target as HTMLElement).closest(
        '[data-open-modal]'
      ) as HTMLElement
      const modalName = target.dataset.openModal

      if (modalName) {
        openModal(modalName)
      }
    })
  })
}

/**
 * Clears the preload state of modals.
 */
function clearPreload(): void {
  const modalElements = document.querySelectorAll('.modal')
  if (modalElements.length) {
    modalElements.forEach((el) => {
      setTimeout(() => {
        el.classList.remove('modal--preload')
      }, 100)
    })
  }
}

/**
 * Adds event listeners to the modal.
 * @param { HTMLElement } modal - The modal element.
 */
function addListeners(modal: HTMLElement): void {
  modal.addEventListener('click', onModalClickHandler)
  window.addEventListener('keydown', onModalKeyboardHandler)
}

/**
 * Removes event listeners from the modal.
 * @param { HTMLElement } modal - The modal element.
 */
function removeListeners(modal: HTMLElement): void {
  modal.removeEventListener('click', onModalClickHandler)
  window.removeEventListener('keydown', onModalKeyboardHandler)
}

/**
 * Event handler for modal click events.
 * @param { MouseEvent } event - The click event.
 */
function onModalClickHandler(event: MouseEvent): void {
  const closeTrigger = (event.target as HTMLElement).closest(
    '[data-close-modal]'
  ) as HTMLElement

  if (!closeTrigger) {
    return
  }

  closeModal(currentModalName)
}

/**
 * Event handler for modal keyboard events.
 * @param { KeyboardEvent } event - The keyboard event.
 */
function onModalKeyboardHandler(event: KeyboardEvent): void {
  const isEscKey = event.key === 'Escape' || event.key === 'Esc'

  if (isEscKey) {
    event.preventDefault()
    closeModal(currentModalName)
  }
}

/**
 * Stops interactive elements inside the modal.
 * @param { HTMLElement } modal - The modal element.
 */
function stopInteractive(modal: HTMLElement): void {
  if (currentSettings.stopPlay) {
    modal
      .querySelectorAll('video, audio')
      .forEach((el: HTMLVideoElement | HTMLAudioElement) => el.pause())
    modal.querySelectorAll('iframe').forEach((el: HTMLIFrameElement) => {
      el.contentWindow.postMessage(
        '{"event": "command", "func": "pauseVideo", "args": ""}',
        '*'
      )
    })
  }
}

/**
 * Autoplays elements inside the modal.
 * @param { HTMLElement } modal - The modal element.
 */
function autoPlay(modal: HTMLElement): void {
  const autoPlayElements = modal.querySelectorAll('[data-auto-play]')
  autoPlayElements.forEach((el: HTMLElement) => {
    const iframe = el.querySelector('iframe')
    iframe?.contentWindow.postMessage(
      '{"event":"command","func":"playVideo","args":""}',
      '*'
    )

    const media = el.querySelector('video, audio') as
      | HTMLVideoElement
      | HTMLAudioElement
    media?.play()
  })
}

/**
 * Opens a modal with the specified name and settings.
 * @param { string } modalName - The name of the modal to open.
 * @param { ModalSettings } settings - Optional. The settings for the modal. If not provided, modalSettings from settings.ts will be used.
 */
function openModal(modalName: string, settings: ModalSettings = {}): void {
  const modal = document.querySelector(
    `[data-modal="${modalName}"]`
  ) as HTMLElement

  if (!modal || modal.classList.contains('is-active')) {
    return
  }

  const openedModal = document.querySelector('.modal.is-active') as HTMLElement
  if (openedModal) {
    closeModalImpl(openedModal.dataset.modal, false, false)
  }

  currentModalName = modalName
  currentSettings = {
    ...modalSettings['default'],
    ...modalSettings[modalName],
    ...settings
  }

  modal.classList.add('is-active')
  disablePageScroll(modal)
  currentSettings.openCallback?.()

  if (currentSettings.lockFocus) {
    lockFocus(modal, currentSettings.startFocus)
  }

  modalsStack.push({ modalName, settings: currentSettings })

  if (currentSettings.resetScrollPos) {
    window.scrollTo(0, 0)
  }

  setTimeout(() => {
    addListeners(modal)
    autoPlay(modal)
  }, currentSettings.eventTimeout)
}

/**
 * Closes the specified modal.
 * @param { string } modalName - The name of the modal to close. If not provided, the current opened modal will be closed.
 */
function closeModal(modalName: string = currentModalName): void {
  closeModalImpl(modalName)
}

/**
 * Inner implementation of the closeModal function.
 * @param { string } modalName - The name of the modal to close.
 * @param { boolean } clearStack - Indicates whether to clear the modals stack. Default is `true`.
 * @param { boolean } checkModalBack - Indicates whether to check modals stack. Default is `true`.
 */
function closeModalImpl(
  modalName: string = currentModalName,
  clearStack: boolean = true,
  checkModalBack: boolean = true
): void {
  const modal = document.querySelector(
    `[data-modal="${modalName}"]`
  ) as HTMLElement

  if (!modal || !modal.classList.contains('is-active')) {
    return
  }

  modal.classList.remove('is-active')
  removeListeners(modal)
  stopInteractive(modal)

  if (currentSettings.lockFocus) {
    unlockFocus()
  }

  currentSettings.closeCallback?.()

  setTimeout(() => {
    enablePageScroll(modal)
  }, currentSettings.eventTimeout)

  currentModalName = null
  currentSettings = {}

  // check if the closeModal needs to work with stack
  if (checkModalBack) {
    const isModalBack = modal.querySelector('[data-close-modal="back"]')
    if (isModalBack) {
      // pop once for the current modal
      modalsStack.pop()

      // check if there is a previous modal
      if (modalsStack.length > 0) {
        const { modalName: prevModalName, settings } = modalsStack.pop()
        openModal(prevModalName, settings)
      }
    } else if (clearStack) {
      modalsStack.length = 0
    }
  }
}

export { initModals, openModal, closeModal }
