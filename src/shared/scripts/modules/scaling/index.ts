import type { ScalingBreakpoint } from '@shared/const'
import { SCALING_BREAKPOINTS } from '@shared/const'

const getScaleFontSize = (
  windowWidth: number,
  breakpoints: ScalingBreakpoint[]
) => {
  const currentBreakpoint =
    breakpoints.find((breakpoint) =>
      breakpoint.size.min
        ? windowWidth >= breakpoint.size.min
        : windowWidth >= breakpoint.size.base
    ) || breakpoints[breakpoints.length - 1]

  const minFontSize = currentBreakpoint.fontSize?.min
  const maxFontSize = currentBreakpoint.fontSize?.max

  let size =
    (windowWidth / currentBreakpoint.size.base) *
    currentBreakpoint.fontSize.base

  if (minFontSize) {
    size = size > minFontSize ? size : minFontSize
  }

  if (maxFontSize) {
    size = size < maxFontSize ? size : maxFontSize
  }

  return Number(size.toFixed(2))
}

const handleWindowResize = (evt, isInitialCall?: boolean) => {
  if (!document || !window) {
    return
  }

  const htmlElement = document.documentElement

  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  htmlElement.style.fontSize = `${getScaleFontSize(viewportWidth, SCALING_BREAKPOINTS)}px`
  htmlElement.style.setProperty('--vh', `${viewportHeight * 0.01}px`)

  if (isInitialCall) {
    document.body.classList.remove('is-loading')
  }
}

export const initScaling = () => {
  handleWindowResize(null, true)
  window.addEventListener('resize', handleWindowResize)
}
