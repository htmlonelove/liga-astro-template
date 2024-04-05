import { FocusLock } from 'src/scripts/utils/focus-lock'
import scrollLock from 'scroll-lock'

// TODO: add types

export class Modals {
  constructor(settings = {}) {
    this._scrollLock = scrollLock
    this._focusLock = new FocusLock()

    this._modalOpenElements = document.querySelectorAll('[data-open-modal]')
    this._stackModalElements = []
    this._openedModalElement = null
    this._modalName = null
    this._enableScrolling = true
    this._settingKey = 'default'

    this._settings = settings
    this._preventDefault = this._settings[this._settingKey].preventDefault
    this._stopPlay = this._settings[this._settingKey].stopPlay
    this._lockFocus = this._settings[this._settingKey].lockFocus
    this._startFocus = this._settings[this._settingKey].startFocus
    this._focusBack = this._settings[this._settingKey].focusBack
    this._eventTimeout = this._settings[this._settingKey].eventTimeout
    this._resetScrollPos = this._settings[this._settingKey].resetScrollPos
    this._openCallback = this._settings[this._settingKey].openCallback
    this._closeCallback = this._settings[this._settingKey].closeCallback

    this._documentKeydownHandler = this._documentKeydownHandler.bind(this)
    this._documentClickHandler = this._documentClickHandler.bind(this)
    this._modalClickHandler = this._modalClickHandler.bind(this)

    this._init()
  }

  _init() {
    if (this._modalOpenElements.length) {
      document.addEventListener('click', this._documentClickHandler)
    }
  }

  _setSettings(settingKey = this._settingKey) {
    if (!this._settings[settingKey]) {
      return
    }

    this._preventDefault =
      typeof this._settings[settingKey].preventDefault === 'boolean'
        ? this._settings[settingKey].preventDefault
        : this._settings[this._settingKey].preventDefault
    this._stopPlay =
      typeof this._settings[settingKey].stopPlay === 'boolean'
        ? this._settings[settingKey].stopPlay
        : this._settings[this._settingKey].stopPlay
    this._lockFocus =
      typeof this._settings[settingKey].lockFocus === 'boolean'
        ? this._settings[settingKey].lockFocus
        : this._settings[this._settingKey].lockFocus
    this._startFocus =
      typeof this._settings[settingKey].startFocus === 'boolean'
        ? this._settings[settingKey].startFocus
        : this._settings[this._settingKey].startFocus
    this._focusBack =
      typeof this._settings[settingKey].lockFocus === 'boolean'
        ? this._settings[settingKey].focusBack
        : this._settings[this._settingKey].focusBack
    this._resetScrollPos =
      typeof this._settings[settingKey].resetScrollPos === 'boolean'
        ? this._settings[settingKey].resetScrollPos
        : this._settings[this._settingKey].resetScrollPos
    this._eventTimeout =
      typeof this._settings[settingKey].eventTimeout === 'number'
        ? this._settings[settingKey].eventTimeout
        : this._settings[this._settingKey].eventTimeout
    this._openCallback =
      this._settings[settingKey].openCallback ||
      this._settings[this._settingKey].openCallback
    this._closeCallback =
      this._settings[settingKey].closeCallback ||
      this._settings[this._settingKey].closeCallback
  }

  _documentClickHandler(evt) {
    const target = evt.target

    if (!target.closest('[data-open-modal]')) {
      return
    }

    evt.preventDefault()

    this._modalName = target.closest('[data-open-modal]').dataset.openModal

    if (!this._modalName) {
      return
    }

    this.open()
  }

  _documentKeydownHandler(evt) {
    const isEscKey = evt.key === 'Escape' || evt.key === 'Esc'

    if (isEscKey) {
      evt.preventDefault()
      this.close(document.querySelector('.modal.is-active').dataset.modal)
    }
  }

  _modalClickHandler(evt) {
    const target = evt.target

    if (!target.closest('[data-close-modal]')) {
      return
    }

    if (target.closest('[data-close-modal="back"]')) {
      this.back()
    } else {
      this.close(target.closest('[data-modal]').dataset.modal)
      this._stackModalElements = []
    }
  }

  _addListeners(modal) {
    modal.addEventListener('click', this._modalClickHandler)
    document.addEventListener('keydown', this._documentKeydownHandler)
  }

  _removeListeners(modal) {
    modal.removeEventListener('click', this._modalClickHandler)
    document.removeEventListener('keydown', this._documentKeydownHandler)
  }

  _stopInteractive(modal) {
    if (this._stopPlay) {
      modal.querySelectorAll('video, audio').forEach((el) => el.pause())
      modal.querySelectorAll('[data-iframe]').forEach((el) => {
        el.querySelector('iframe').contentWindow.postMessage(
          '{"event": "command", "func": "pauseVideo", "args": ""}',
          '*'
        )
      })
    }
  }

  _autoPlay(modal) {
    modal.querySelectorAll('[data-iframe]').forEach((el) => {
      const autoPlay = el.closest('[data-auto-play]')
      if (autoPlay) {
        el.querySelector('iframe').contentWindow.postMessage(
          '{"event":"command","func":"playVideo","args":""}',
          '*'
        )
      }
    })
  }

  open(modalName = this._modalName) {
    const modal = document.querySelector(`[data-modal="${modalName}"]`)

    if (!modal || modal.classList.contains('is-active')) {
      return
    }

    document.removeEventListener('click', this._documentClickHandler)

    this._openedModalElement = document.querySelector('.modal.is-active')

    if (this._openedModalElement) {
      this._scrollLock.enablePageScroll(this._openedModalElement)
      this._scrollLock.disablePageScroll(modal)
      this._enableScrolling = false
      this.close(this._openedModalElement.dataset.modal)
    }

    this._setSettings(modalName)
    modal.classList.add('is-active')

    if (
      modalName !==
      this._stackModalElements[this._stackModalElements.length - 1]
    ) {
      this._stackModalElements.push(modalName)
    }

    if (!this._openedModalElement) {
      this._scrollLock.disablePageScroll(modal)
    }

    if (this._openCallback) {
      this._openCallback()
    }

    if (this._lockFocus) {
      this._focusLock.lock('.modal.is-active', this._startFocus)
    }

    if (this._resetScrollPos) {
      modal.scrollTo(0, 0)
    }

    setTimeout(() => {
      this._addListeners(modal)
      this._autoPlay(modal)
      document.addEventListener('click', this._documentClickHandler)
    }, this._eventTimeout)
  }

  back() {
    if (!this._stackModalElements.length) {
      return
    }

    const activeModal =
      this._stackModalElements[this._stackModalElements.length - 1]
    const prevModal =
      this._stackModalElements[this._stackModalElements.length - 2]

    if (this._stackModalElements.length === 1) {
      this._stackModalElements = []
    }

    if (prevModal) {
      this._stackModalElements.pop()
      this.open(prevModal)
    }

    this.close(activeModal)
  }

  close(modalName = this._modalName) {
    const modal = document.querySelector(`[data-modal="${modalName}"]`)
    document.removeEventListener('click', this._documentClickHandler)

    if (!modal || !modal.classList.contains('is-active')) {
      return
    }

    if (this._lockFocus) {
      this._focusLock.unlock(this._focusBack)
    }

    modal.classList.remove('is-active')
    this._removeListeners(modal)
    this._stopInteractive(modal)

    if (this._closeCallback) {
      this._closeCallback()
    }

    if (this._enableScrolling) {
      setTimeout(() => {
        this._scrollLock.enablePageScroll(modal)
      }, this._eventTimeout)
    }

    setTimeout(() => {
      document.addEventListener('click', this._documentClickHandler)
    }, this._eventTimeout)

    this._setSettings('default')
    this._enableScrolling = true
  }
}
