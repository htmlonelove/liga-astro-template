import { Modals } from './modals'
import type { ModalsType } from '@types'

let modals: ModalsType | undefined

const settings = {
  'default': {
    preventDefault: true,
    stopPlay: true,
    lockFocus: true,
    startFocus: true,
    focusBack: true,
    resetScrollPos: false,
    eventTimeout: 400,
    openCallback: false,
    closeCallback: false
  },
  // modal-1, modal-6 добавлен исключительно для примера при добавлении на проект ключ и обект записанный в нём нужно удалить
  'modal-1': {
    // openCallback: () => console.log('Я отработаю при открытии modal-1'),
    // closeCallback: () => console.log('Я отработаю при закрытии modal-1'),
  }
}

const initModals = () => {
  const modalElements = document.querySelectorAll('.modal')
  if (modalElements.length) {
    modalElements.forEach((el) => {
      setTimeout(() => {
        el.classList.remove('modal--preload')
      }, 100)
    })
  }

  modals = new Modals(settings)
  window.modals = modals
}

export { modals, initModals }
