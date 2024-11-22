const deviceSize = {
  mobileS: 320,
  mobileM: 430,
  mobileL: 480,
  tabletS: 767,
  tablet: 1023,
  laptop: 1279,
  desktop: 1280,
  fhd: 1920,
  uhd: 2560
}

const BASE_FONT_SIZE = 16

const breakpointsArray = [
  {
    size: deviceSize.laptop,
    noScaleSize: deviceSize.laptop
  },
  {
    size: deviceSize.tablet,
    upscaleSize: deviceSize.laptop
  },
  {
    size: deviceSize.tabletS
  },
  {
    size: deviceSize.mobileM
  }
]

const getScaleFontSize = (
  windowWidth: number,
  minSize?: number,
  maxSize?: number
) => {
  const currentBreakpoint =
    breakpointsArray.find((item) => item.size < windowWidth) ||
    breakpointsArray[breakpointsArray.length - 1]
  const contentWidth = currentBreakpoint.noScaleSize
    ? currentBreakpoint.size
    : windowWidth

  const breakpointSize =
    currentBreakpoint.noScaleSize ||
    currentBreakpoint.upscaleSize ||
    currentBreakpoint.size

  let size = (contentWidth / breakpointSize) * BASE_FONT_SIZE
  if (minSize) {
    size = size < minSize ? minSize : size
  }
  if (maxSize) {
    size = size < maxSize ? size : maxSize
  }

  return size.toFixed(2)
}

const handleWindowResize = () => {
  const viewportWidth = window.innerWidth
  const htmlElement = document.querySelector('html')

  if (htmlElement) {
    const globalFontSize =
      viewportWidth !== null
        ? Number(getScaleFontSize(viewportWidth))
        : BASE_FONT_SIZE
    htmlElement.style.fontSize = `${globalFontSize}px`
  }
}

export const initScaling = () => {
  handleWindowResize()
  window.addEventListener('resize', handleWindowResize)
}
