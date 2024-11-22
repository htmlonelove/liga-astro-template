interface IDefaultModalSettings {
  preventDefault: boolean
  stopPlay: boolean
  lockFocus: boolean
  startFocus: boolean
  focusBack: boolean
  resetScrollPos: boolean
  eventTimeout: number
  openCallback: () => void | null
  closeCallback: () => void | null
}

export type ModalSettings = {
  [T in keyof IDefaultModalSettings]?: IDefaultModalSettings[T]
}

interface IModalSettingsGroup {
  default: IDefaultModalSettings
  [key: string]: ModalSettings
}

export const modalSettings: IModalSettingsGroup = {
  default: {
    preventDefault: true,
    stopPlay: true,
    lockFocus: true,
    startFocus: true,
    focusBack: true,
    resetScrollPos: false,
    eventTimeout: 400,
    openCallback: null,
    closeCallback: null
  },
  // Удалите перед стартом проекта
  sample: {
    preventDefault: false,

    openCallback: () =>
      console.log('Я отработала при открытии модального окна'),

    closeCallback: () =>
      console.log('Я отработала при закрытии модального окна')
  }
}
