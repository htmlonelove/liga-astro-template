import { initModals } from './modules/modals/init-modals'
import { mobileVhFix } from './utils/mobile-vh-fix'

mobileVhFix()
document.addEventListener(
  'DOMContentLoaded',
  () => {
    initModals()
  },
  true
)
